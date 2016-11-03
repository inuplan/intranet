// Copyright © 2015 Inuplan
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

namespace Inuplan.DAL.Repositories
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Diagnostics;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Transactions;
    using Common.Models;
    using Common.Repositories;
    using Dapper;
    using Optional;
    using System.Data.SqlClient;
    using Common.Tools;
    using Common.Logger;
    using Common.Commands;
    using Common.Queries.UserSpaceInfoQueries;
    using Optional.Unsafe;
    using Common.Factories;

    /// <summary>
    /// A repository for the images a user has.
    /// The first is the key for the image.
    /// The second is the user id to which the image belongs.
    /// The third is the image.
    /// The fourth is the return type.
    /// </summary>
    public class UserImageRepository : IScalarRepository<int, Image>
    {
        /// <summary>
        /// The logging framework
        /// </summary>
        private readonly ILogger<UserImageRepository> logger;

        /// <summary>
        /// Determines whether this instance has been disposed earlier
        /// </summary>
        private bool disposedValue = false;
        private readonly IGetUserSpaceInfo userSpaceHandle;
        private readonly int quotaKb;
        private readonly IConnectionFactory connectionFactory;

        /// <summary>
        /// Initializes a new instance of this <see cref="UserImageRepository"/> class.
        /// </summary>
        public UserImageRepository(
            IGetUserSpaceInfo userSpaceHandle,
            ILogger<UserImageRepository> logger,
            IConnectionFactory connectionFactory,
            int quotaKb
        )
        {
            this.connectionFactory = connectionFactory;
            this.quotaKb = quotaKb;
            this.userSpaceHandle = userSpaceHandle;
            this.logger = logger;
        }

        /// <summary>
        /// Creates a new image in the database as well as the filesystem
        /// </summary>
        /// <param name="entity">The image to create</param>
        /// <param name="identifiers">N/A</param>
        /// <returns>An optional image with correct ID</returns>
        public async Task<Option<Image>> Create(Image entity, Func<Image, Task<bool>> onCreate, params object[] identifiers)
        {
            try
            {
                logger.Debug("Class: UserImageRepository, Method: Create, BEGIN");
                Debug.Assert(entity.Owner != null && entity.Owner.ID > 0, "Must have a valid user id");

                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    var sqlFileInfo = @"INSERT INTO FileInfo (Path)
                                        VALUES (@Path);
                                        SELECT ID FROM FileInfo WHERE ID = @@IDENTITY;";
                    var fileInfos = new[]
                    {
                            entity.Original,
                            entity.Preview,
                            entity.Thumbnail
                        };

                    foreach (var info in fileInfos)
                    {
                        var fileInfoID = await connection.ExecuteScalarAsync<int>(sqlFileInfo, info, transaction);
                        info.ID = fileInfoID;
                    }

                    var sqlImage = @"INSERT INTO Images
                                    (Preview, Thumbnail, Original, Owner, Description, Filename, Extension, MimeType, Uploaded)
                                    VALUES
                                    (@Preview, @Thumbnail, @Original, @Owner, @Description, @Filename, @Extension, @MimeType, @Uploaded);
                                    SELECT ID FROM Images WHERE ID = @@IDENTITY;";

                    var imageID = await connection.ExecuteScalarAsync<int>(sqlImage, new
                    {
                        Preview = entity.Preview.ID,
                        Thumbnail = entity.Thumbnail.ID,
                        Original = entity.Original.ID,
                        Owner = entity.Owner.ID,
                        Description = entity.Description,
                        Filename = entity.Filename,
                        Extension = entity.Extension,
                        MimeType = entity.MimeType,
                        Uploaded = entity.Uploaded
                    }, transaction);

                    entity.ID = imageID;

                    var success = entity.ID > 0 &&
                                    entity.Original.ID > 0 &&
                                    entity.Thumbnail.ID > 0 &&
                                    entity.Preview.ID > 0;


                    var sizePreview = entity.Preview.GetKilobytes();
                    var sizeOriginal = entity.Original.GetKilobytes();
                    var sizeThumbnail = entity.Thumbnail.GetKilobytes();
                    var totalSize = sizePreview + sizeOriginal + sizeThumbnail;

                    var usedSpace = (await userSpaceHandle.GetUserSpaceInfo(entity.Owner.ID)).ValueOrFailure().UsedSpaceKB;
                    var exceeds = (usedSpace + totalSize) > quotaKb;

                    success = success && !exceeds;

                    logger.Trace("Database updated successfully on image created: {0}", success);

                    if (success)
                    {
                        // Write directory...
                        // Assumption: All files are in the same directory
                        var dir = Path.GetDirectoryName(entity.Original.Path);
                        var dirInfo = Directory.CreateDirectory(dir);

                        var continuation = await onCreate(entity);
                        if (!continuation)
                        {
                            logger.Error("Continuation failed, rolling back everything...");
                            transaction.Rollback();
                            return Option.None<Image>();
                        }

                        transaction.Commit();

                        // Write files 
                        // Assumption: Filesystem always succeed writing
                        File.WriteAllBytes(entity.Original.Path, entity.Original.Data.Value);
                        File.WriteAllBytes(entity.Preview.Path, entity.Preview.Data.Value);
                        File.WriteAllBytes(entity.Thumbnail.Path, entity.Thumbnail.Data.Value);

                        logger.Debug("Class: UserImageRepository, Method: Create, END");
                        return entity.Some();
                    }

                    transaction.Rollback();
                }

                logger.Error("Could not create image on database");
                logger.Debug("Class: UserImageRepository, Method: Create, END");
                return Option.None<Image>();
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        /// <summary>
        /// Deletes an image from the database
        /// </summary>
        /// <param name="key">The username, filename and extension</param>
        /// <returns>True if deleted otherwise false</returns>
        public async Task<bool> Delete(int key, Func<int, Task> onDelete)
        {
            try
            {
                logger.Debug("Class: UserImageRepository, Method: Delete, BEGIN");
                Debug.Assert(key > 0, "The image must have a valid ID!");
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    var sqlImage = @"SELECT * FROM Images WHERE ID = @ID";
                    var imageRow = (await connection.QueryAsync(sqlImage, new { ID = key }, transaction))
                                    .SingleOrDefault();

                    var ids = new[]
                    {
                        new { ID = imageRow.Preview },
                        new { ID = imageRow.Original },
                        new { ID = imageRow.Thumbnail }
                    };

                    var sqlInfos = @"SELECT * FROM FileInfo WHERE ID = @ID;";

                    var filePaths = new List<string>();
                    foreach (var id in ids)
                    {
                        var info = (await connection.QueryAsync<Common.Models.FileInfo>(sqlInfos, id, transaction)).Single();
                        filePaths.Add(info.Path);
                    }

                    var nullFields = (await connection.ExecuteAsync(
                        @"UPDATE Images SET Preview=NULL, Thumbnail=NULL, Original=NULL WHERE ID=@key;",
                        new { key }, transaction)).Equals(1);

                    var sqlDeleteInfo = @"DELETE FROM FileInfo WHERE ID = @ID";
                    var deleted = (await connection.ExecuteAsync(sqlDeleteInfo, ids, transaction)).Equals(3);

                    var sqlDeleteImage = @"DELETE FROM Images WHERE ID = @ID;";
                    deleted = deleted && (await connection.ExecuteAsync(sqlDeleteImage, new { ID = key }, transaction)).Equals(1);

                    if (nullFields && deleted && filePaths.Count() == 3)
                    {
                        await onDelete(key);

                        //Delete files from filesystem
                        foreach (var path in filePaths)
                        {
                            if (File.Exists(path))
                            {
                                logger.Trace("Deleting file: {0}", path);
                                File.Delete(path);
                            }
                        }

                        int userId = imageRow.Owner;
                        //transactionScope.Complete();
                        transaction.Commit();

                        logger.End();
                        return true;
                    }

                    logger.Error("Could not delete every image");
                    transaction.Rollback();
                    logger.End();
                    return false;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        /// <summary>
        /// Retrieves an image from the database with the give key.
        /// </summary>
        /// <param name="key">The ID of the image</param>
        /// <returns>An optional image.</returns>
        public async Task<Option<Image>> Get(int key)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    var sql = @"SELECT
                        img.ID, Description, Filename, Extension, MimeType, Uploaded,   /* Image */
                        u.ID, FirstName, LastName, Username, Email,                     /* User */
                        prev.ID, prev.Path,	                                            /* Preview */
                        orig.ID, orig.Path,                                             /* Original */
                        thumb.ID, thumb.Path                                            /* Thumbnail */
                    FROM Images img INNER JOIN Users u
                    ON img.Owner = u.ID

                    INNER JOIN FileInfo prev
                    ON img.Preview = prev.ID

                    INNER JOIN FileInfo orig
                    ON img.Original = orig.ID

                    INNER JOIN FileInfo thumb
                    ON img.Thumbnail = thumb.ID
                    WHERE img.ID = @key";

                    var image = await connection.
                        QueryAsync<Image, User, Common.Models.FileInfo, Common.Models.FileInfo, Common.Models.FileInfo, Image>
                        (sql, (img, user, preview, original, thumbnail) =>
                        {
                            // Setup file info
                            preview.Data = new Lazy<byte[]>(() => File.ReadAllBytes(preview.Path));
                            original.Data = new Lazy<byte[]>(() => File.ReadAllBytes(original.Path));
                            thumbnail.Data = new Lazy<byte[]>(() => File.ReadAllBytes(thumbnail.Path));

                            // Construct image details
                            img.Owner = user;
                            img.Preview = preview;
                            img.Original = original;
                            img.Thumbnail = thumbnail;

                            return img;
                        }, new { key });

                    logger.End();
                    return image.SingleOrDefault().SomeNotNull();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        /// <summary>
        /// Retrieves a list of images, sorted by their filename in ascending order.
        /// </summary>
        /// <param name="skip">The number of images to skip</param>
        /// <param name="take">The number of images to take</param>
        /// <param name="identifiers">The user ID to which the image belongs</param>
        /// <returns>A list of images</returns>
        public async Task<Pagination<Image>> GetPage(int skip, int take, Func<string> sortBy = null, Func<string> orderBy = null, params object[] identifiers)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    sortBy = sortBy ?? new Func<string>(() => "Filename");
                    orderBy = orderBy ?? new Func<string>(() => "ASC");

                    var sql = @"SELECT
                            imgID AS ID, Description, Filename, Extension, MimeType, Uploaded,
                            userID AS ID, FirstName, LastName, Username, Email,
                            prevID AS ID, prevPath AS Path,
                            origID AS ID, origPath AS Path,
                            thumbID AS ID, thumbPath AS Path
                        FROM
                        (
                        SELECT
                            img.ID AS imgID, Description, Filename, Extension, MimeType, Uploaded,
                            u.ID AS userID, FirstName, LastName, Username, Email,
                            prev.ID AS prevID, prev.Path AS prevPath,
                            orig.ID AS origID, orig.Path AS origPath,
                            thumb.ID AS thumbID, thumb.Path AS thumbPath,
                            ROW_NUMBER() OVER (ORDER BY @Sort @Order) AS 'RowNumber'
                        FROM Images img INNER JOIN Users u
                        ON img.Owner = u.ID

                        INNER JOIN FileInfo prev
                        ON img.Preview = prev.ID

                        INNER JOIN FileInfo orig
                        ON img.Original = orig.ID

                        INNER JOIN FileInfo thumb
                        ON img.Thumbnail = thumb.ID
                        
                        WHERE img.Owner = @Owner
                        ) AS seq
                        WHERE seq.RowNumber BETWEEN @From AND @To;";

                    var query = sql.Replace("@Sort", sortBy()).Replace("@Order", orderBy());

                    var result = await connection.QueryAsync
                                    <Image, User, Common.Models.FileInfo, Common.Models.FileInfo, Common.Models.FileInfo, Image>
                                    (query, (img, user, preview, original, thumbnail) =>
                                    {
                                        // Setup file info
                                        preview.Data = new Lazy<byte[]>(() => File.ReadAllBytes(preview.Path));
                                        original.Data = new Lazy<byte[]>(() => File.ReadAllBytes(original.Path));
                                        thumbnail.Data = new Lazy<byte[]>(() => File.ReadAllBytes(thumbnail.Path));

                                        // Construct image details
                                        img.Owner = user;
                                        img.Preview = preview;
                                        img.Original = original;
                                        img.Thumbnail = thumbnail;

                                        return img;
                                    }, new
                                    {
                                        Owner = identifiers[0],
                                        From = skip + 1,
                                        To = skip + take,
                                    });

                    var totalImagesSql = @"SELECT COUNT(*) FROM Images WHERE Owner = @Owner;";
                    var total = await connection.ExecuteScalarAsync<int>(totalImagesSql, new { Owner = identifiers });

                    logger.End();
                    return Helpers.Paginate(skip, take, total, result.ToList());
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        /// <summary>
        /// Retrieves all images from the database
        /// </summary>
        /// <param name="identifiers">The user ID to which the images belong</param>
        /// <returns>A list of images</returns>
        public async Task<List<Image>> GetAll(params object[] identifiers)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                {
                    Debug.Assert(identifiers.Length == 1, "Must have a valid user ID!");
                    var sql = @"SELECT
                        img.ID, Description, Filename, Extension, MimeType, Uploaded,   /* Image */
                        u.ID, FirstName, LastName, Username, Email,                     /* User */
                        prev.ID, prev.Path,	                                            /* Preview */
                        orig.ID, orig.Path,                                             /* Original */
                        thumb.ID, thumb.Path                                            /* Thumbnail */
                    FROM Images img INNER JOIN Users u
                    ON img.Owner = u.ID

                    INNER JOIN FileInfo prev
                    ON img.Preview = prev.ID

                    INNER JOIN FileInfo orig
                    ON img.Original = orig.ID

                    INNER JOIN FileInfo thumb
                    ON img.Thumbnail = thumb.ID
                    WHERE img.Owner = @Owner;";

                    var result = await connection.QueryAsync
                                    <Image, User, Common.Models.FileInfo, Common.Models.FileInfo, Common.Models.FileInfo, Image>
                                    (sql, (img, user, preview, original, thumbnail) =>
                                    {
                                        // Setup file info
                                        preview.Data = new Lazy<byte[]>(() => File.ReadAllBytes(preview.Path));
                                        original.Data = new Lazy<byte[]>(() => File.ReadAllBytes(original.Path));
                                        thumbnail.Data = new Lazy<byte[]>(() => File.ReadAllBytes(thumbnail.Path));

                                        // Construct image details
                                        img.Owner = user;
                                        img.Preview = preview;
                                        img.Original = original;
                                        img.Thumbnail = thumbnail;

                                        return img;
                                    }, new { Owner = identifiers[0] });

                    logger.End();
                    return result.ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        /// <summary>
        /// Gets an image by the ID
        /// </summary>
        /// <param name="id">The id of the image</param>
        /// <returns>An optional image</returns>
        public async Task<Option<Image>> GetByID(int id)
        {
            return await Get(id);
        }

        /// <summary>
        /// Not supported operation. Delete then reupload image.
        /// </summary>
        /// <param name="key">N/A</param>
        /// <param name="entity">N/A</param>
        /// <returns>N/A</returns>
        public async Task<bool> Update(int key, Image entity)
        {
            try
            {
                logger.Begin();
                using (var connection = connectionFactory.CreateConnection())
                using (var transaction = connection.BeginTransaction())
                {
                    // Only update the description!
                    var sql = @"UPDATE Images SET Description = @Description WHERE ID=@key;";
                    var updated = await connection.ExecuteAsync(sql, new { key, Description = entity.Description }, transaction);

                    var success = updated == 1;
                    if(success)
                    {
                        logger.Trace("Succesfully updated image description");
                        transaction.Commit();
                    }
                    else
                    {
                        logger.Error("Could not update image description");
                        transaction.Rollback();
                    }

                    logger.End();
                    return success;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        /// <summary>
        /// The dispose pattern
        /// </summary>
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
        }

        /// <summary>
        /// Dispose pattern which disposes managed resources.
        /// </summary>
        /// <param name="disposing">Boolean value indicating whether to dispose</param>
        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    //connection.Close();
                    //connection.Dispose();
                }

                disposedValue = true;
            }
        }
    }
}
