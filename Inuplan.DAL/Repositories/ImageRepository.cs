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

    /// <summary>
    /// The first item in the key tuple is the <see cref="User.Username"/> and the
    /// second item is the filename of the image, and the third is the extension of the filename
    /// </summary>
    public class ImageRepository : IScalarRepository<int, Image>
    {
        /// <summary>
        /// The logging framework
        /// </summary>
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// The database connection
        /// </summary>
        private readonly IDbConnection connection;

        /// <summary>
        /// Determines whether this instance has been disposed earlier
        /// </summary>
        private bool disposedValue = false;

        /// <summary>
        /// Initializes a new instance of this <see cref="ImageRepository"/> class.
        /// </summary>
        /// <param name="connection">The database connection</param>
        public ImageRepository(IDbConnection connection)
        {
            this.connection = connection;
        }

        /// <summary>
        /// Creates a new image in the database as well as the filesystem
        /// </summary>
        /// <param name="entity">The image to create</param>
        /// <returns>An optional image with correct ID</returns>
        public async Task<Option<Image>> Create(Image entity)
        {
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

                    foreach(var info in fileInfos)
                    {
                        var fileInfoID = await connection.ExecuteScalarAsync<int>(sqlFileInfo, info);
                        info.ID = fileInfoID;
                    }

                    var sqlImage = @"INSERT INTO Images
                                    (Preview, Thumbnail, Original, Owner, Description, Filename, Extension, MimeType)
                                    VALUES
                                    (@Preview, @Thumbnail, @Original, @Owner, @Description, @Filename, @Extension, @MimeType);
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
                        entity.MimeType
                    });

                    entity.ID = imageID;

                    var success = entity.ID > 0 &&
                                    entity.Original.ID > 0 &&
                                    entity.Thumbnail.ID > 0 &&
                                    entity.Preview.ID > 0;

                    if(success)
                    {
                        // Write directory...
                        // Assumption: All files are in the same directory
                        var dir = Path.GetDirectoryName(entity.Original.Path);
                        var dirInfo = Directory.CreateDirectory(dir);
                        
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
                    logger.Error(ex);
                }
            }

            return Option.None<Image>();
        }

        /// <summary>
        /// Deletes an image entity from the database as well as the filesystem
        /// </summary>
        /// <param name="entity">The image entity to delete</param>
        /// <returns>A boolean value indicating whether the operation was succesfull</returns>
        public async Task<bool> Delete(Image entity)
        {
            Debug.Assert(entity.ID > 0, "The image must have an ID!");
            return await Delete(entity.ID);
        }

        /// <summary>
        /// Deletes an image from the database
        /// </summary>
        /// <param name="key">The username, filename and extension</param>
        /// <returns>True if deleted otherwise false</returns>
        public async Task<bool> Delete(int key)
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
                var infos = (await connection.QueryAsync(sqlInfos, ids)).ToList();

                var sqlDeleteInfo = @"DELETE FROM FileInfo WHERE ID = @ID";
                var deleted = (await connection.ExecuteAsync(sqlDeleteInfo, ids)).Equals(3);

                var sqlDeleteImage = @"DELETE FROM Images WHERE ID = @ID;";
                deleted = deleted && (await connection.ExecuteAsync(sqlDeleteImage, new { ID = key })).Equals(1);

                if(deleted && infos.Count() == 3)
                {
                    transactionScope.Complete();

                    //Delete files from filesystem
                    foreach(var info in infos)
                    {
                        if(File.Exists(info.Path))
                        {
                            File.Delete(info.Path);
                        }
                    }

                    return true;
                }

                return false;
            }
        }

        /// <summary>
        /// Retrieves an image from the database with the give key.
        /// </summary>
        /// <param name="key">First item is the <see cref="User.Username"/>, the second item is the <see cref="Common.Models.FileInfo.Filename"/>m
        /// the third item is the file extension <see cref="Common.Models.FileInfo.Extension"/>.</param>
        /// <returns>An optional image.</returns>
        public async Task<Option<Image>> Get(int key)
        {
            var sql = @"SELECT
                        img.ID, Description, Filename, Extension, MimeType,     /* Image */
                        u.ID, FirstName, LastName, Username, Email,             /* User */
                        prev.ID, prev.Path,	                                    /* Preview */
                        orig.ID, orig.Path,                                     /* Original */
                        thumb.ID, thumb.Path                                    /* Thumbnail */
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

        /// <summary>
        /// Retrieves a list of images, sorted by their filename in ascending order.
        /// </summary>
        /// <param name="skip">The number of images to skip</param>
        /// <param name="take">The number of images to take</param>
        /// <returns>A list of images</returns>
        public async Task<List<Image>> Get(int skip, int take)
        {
            var sql = @"SELECT
                            imgID AS ID, Description, Filename, Extension, MimeType,
                            userID AS ID, FirstName, LastName, Username, Email,
                            prevID AS ID, prevPath AS Path,
                            origID AS ID, origPath AS Path,
                            thumbID AS ID, thumbPath AS Path
                        FROM
                        (
                        SELECT
                            img.ID AS imgID, Description, Filename, Extension, MimeType,
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
                                From = skip + 1,
                                To = skip + take,
                            });

            return result.ToList();
        }

        /// <summary>
        /// Retrieves all images from the database
        /// </summary>
        /// <returns>A list of images</returns>
        public async Task<List<Image>> GetAll()
        {
            var sql = @"SELECT
                        img.ID, Description, Filename, Extension, MimeType,     /* Image */
                        u.ID, FirstName, LastName, Username, Email,             /* User */
                        prev.ID, prev.Path,	                                    /* Preview */
                        orig.ID, orig.Path,                                     /* Original */
                        thumb.ID, thumb.Path                                    /* Thumbnail */
                    FROM Images img INNER JOIN Users u
                    ON img.Owner = u.ID

                    INNER JOIN FileInfo prev
                    ON img.Preview = prev.ID

                    INNER JOIN FileInfo orig
                    ON img.Original = orig.ID

                    INNER JOIN FileInfo thumb
                    ON img.Thumbnail = thumb.ID;";

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
                            });

            return result.ToList();
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
        public Task<bool> Update(int key, Image entity)
        {
            throw new NotSupportedException("Cannot update an image! Delete then reupload.");
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
