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
    using NLog;
    using Common.Tools;
    using ImageID = System.Int32;
    using UserID = System.Int32;

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
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// The database connection
        /// </summary>
        private readonly IDbConnection connection;

        /// <summary>
        /// Determines whether this instance has been disposed earlier
        /// </summary>
        private bool disposedValue = false;

        /// <summary>
        /// Initializes a new instance of this <see cref="UserImageRepository"/> class.
        /// </summary>
        /// <param name="connection">The database connection</param>
        public UserImageRepository(IDbConnection connection)
        {
            this.connection = connection;
        }

        /// <summary>
        /// Creates a new image in the database as well as the filesystem
        /// </summary>
        /// <param name="entity">The image to create</param>
        /// <param name="identifiers">N/A</param>
        /// <returns>An optional image with correct ID</returns>
        public async Task<Option<Image>> Create(Image entity, Action<Image> onCreate, params object[] identifiers)
        {
            try
            {
                Debug.Assert(entity.Owner != null && entity.Owner.ID > 0, "Must have a valid user id");
                using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    try
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
                            var fileInfoID = await connection.ExecuteScalarAsync<int>(sqlFileInfo, info);
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
                            entity.Description,
                            entity.Filename,
                            entity.Extension,
                            entity.MimeType,
                            entity.Uploaded
                        });

                        entity.ID = imageID;

                        var success = entity.ID > 0 &&
                                        entity.Original.ID > 0 &&
                                        entity.Thumbnail.ID > 0 &&
                                        entity.Preview.ID > 0;

                        if (success)
                        {
                            // Write directory...
                            // Assumption: All files are in the same directory
                            var dir = Path.GetDirectoryName(entity.Original.Path);
                            var dirInfo = Directory.CreateDirectory(dir);

                            onCreate(entity);
                            transactionScope.Complete();

                            // Write files 
                            // Assumption: Filesystem always succeed writing
                            File.WriteAllBytes(entity.Original.Path, entity.Original.Data.Value);
                            File.WriteAllBytes(entity.Preview.Path, entity.Preview.Data.Value);
                            File.WriteAllBytes(entity.Thumbnail.Path, entity.Thumbnail.Data.Value);

                            return entity.Some();
                        }
                    }
                    catch (SqlException ex)
                    {
                        // log error
                        Logger.Error(ex);
                    }
                }

                return Option.None<Image>();
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
                throw;
            }
        }

        /// <summary>
        /// Deletes an image from the database
        /// </summary>
        /// <param name="key">The username, filename and extension</param>
        /// <returns>True if deleted otherwise false</returns>
        public async Task<bool> Delete(int key, Action<int> onDelete)
        {
            try
            {
                Debug.Assert(key > 0, "The image must have a valid ID!");
                using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    var sqlImage = @"SELECT * FROM Images WHERE ID = @ID";
                    var imageRow = (await connection.QueryAsync(sqlImage, new { ID = key }))
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
                        var info = (await connection.QueryAsync<Common.Models.FileInfo>(sqlInfos, id)).Single();
                        filePaths.Add(info.Path);
                    }

                    var nullFields = (await connection.ExecuteAsync(
                        @"UPDATE Images SET Preview=NULL, Thumbnail=NULL, Original=NULL WHERE ID=@key;",
                        new { key })).Equals(1);

                    var sqlDeleteInfo = @"DELETE FROM FileInfo WHERE ID = @ID";
                    var deleted = (await connection.ExecuteAsync(sqlDeleteInfo, ids)).Equals(3);

                    var sqlDeleteImage = @"DELETE FROM Images WHERE ID = @ID;";
                    deleted = deleted && (await connection.ExecuteAsync(sqlDeleteImage, new { ID = key })).Equals(1);

                    if (nullFields && deleted && filePaths.Count() == 3)
                    {
                        onDelete(key);
                        transactionScope.Complete();

                        //Delete files from filesystem
                        foreach (var path in filePaths)
                        {
                            if (File.Exists(path))
                            {
                                File.Delete(path);
                            }
                        }

                        return true;
                    }

                    return false;
                }
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
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

                return image.SingleOrDefault().SomeNotNull();
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
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
        public async Task<Pagination<Image>> GetPage(int skip, int take, params object[] identifiers)
        {
            try
            {
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
                            ROW_NUMBER() OVER (ORDER BY Filename ASC) AS 'RowNumber'
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
                                }, new
                                {
                                    Owner = identifiers[0],
                                    From = skip + 1,
                                    To = skip + take,
                                });

                var totalImagesSql = @"SELECT COUNT(*) FROM Images WHERE Owner = @Owner;";
                var total = await connection.ExecuteScalarAsync<int>(totalImagesSql, new { Owner = identifiers });

                var currentPage = Helpers.Paginate(skip, take, total, result.ToList());
                return currentPage;
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
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

                return result.ToList();
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
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
                // Only update the description!
                var sql = @"UPDATE Images SET Description = @Description WHERE ID=@key;";
                var updated = await connection.ExecuteAsync(sql, new { key, Description = entity.Description });
                return updated == 1;
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
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
                    connection.Close();
                    connection.Dispose();
                }

                disposedValue = true;
            }
        }
    }
}
