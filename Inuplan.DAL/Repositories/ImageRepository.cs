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
    using Common.Models;
    using Common.Repositories;
    using Dapper;
    using Optional;

    /// <summary>
    /// The first item in the key tuple is the <see cref="User.Username"/> and the
    /// second item is the filename of the image, and the third is the extension of the filename
    /// </summary>
    public class ImageRepository : IRepository<Tuple<string, string, string>, Image>
    {
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
            this.connection.Open();
        }

        /// <summary>
        /// Creates a new image in the database as well as the filesystem
        /// </summary>
        /// <param name="entity">The image to create</param>
        /// <returns>An optional image with correct ID</returns>
        public async Task<Option<Image>> Create(Image entity)
        {
            using (var transaction = connection.BeginTransaction())
            {
                var conn = transaction.Connection;
                entity.MetaData.ID = 0;
                var sqlInfo = @"INSERT INTO FileInfo
                        (Filename, Extension, MimeType, OwnerID)
                        VALUES(@Filename, @Extension, @MimeType, OwnerID);
                        SELECT ID FROM FileInfo WHERE ID = @@IDENTITY;";

                // Create info file
                entity.MetaData.ID = await conn.ExecuteScalarAsync<int>(sqlInfo, new
                {
                    Filename = entity.MetaData.Filename,
                    Extension = entity.MetaData.Extension,
                    MimeType = entity.MetaData.MimeType,
                    OwnerID = entity.MetaData.Owner.ID
                });

                // Create 3 images
                var sqlOriginal = @"INSERT INTO FileData (Path) VALUES (@Path);
                                SELECT ID FROM FileData WHERE ID = @@IDENTITY;";
                entity.Original.ID = await conn.ExecuteScalarAsync<int>(sqlOriginal, new
                {
                    Path = entity.Original.Path
                });

                var sqlMedium = @"INSERT INTO FileData (Path) VALUES (@Path);
                                SELECT ID FROM FileData WHERE ID = @@IDENTITY;";
                entity.Medium.ID = await conn.ExecuteScalarAsync<int>(sqlMedium, new
                {
                    Path = entity.Medium.Path
                });

                var sqlThumbnail = @"INSERT INTO FileData (Path) VALUES (@Path);
                                SELECT ID FROM FileData WHERE ID = @@IDENTITY;";
                entity.Thumbnail.ID = await conn.ExecuteScalarAsync<int>(sqlThumbnail, new
                {
                    Path = entity.Thumbnail.Path
                });

                var sql = @"INSERT INTO Images (ID, ThumbnailID, MediumID, OriginalID)
                        VALUES (@FID, @TID, @MID, @OID);";
                await conn.ExecuteAsync(sql, new
                {
                    FID = entity.MetaData.ID,
                    TID = entity.Thumbnail.ID,
                    MID = entity.Medium.ID,
                    OID = entity.Original.ID
                });

                // Write directory...
                // Assumption: All files are in the same directory
                var dir = Path.GetDirectoryName(entity.Medium.Path);
                var dirInfo = Directory.CreateDirectory(dir);

                var success = entity.MetaData.ID > 0 &&
                                entity.Original.ID > 0 &&
                                entity.Medium.ID > 0 &&
                                entity.Thumbnail.ID > 0;

                if (success)
                {
                    // Commit database transactions
                    transaction.Commit();

                    // Write files 
                    // Assumption: Filesystem always succeed writing
                    File.WriteAllBytes(entity.Original.Path, entity.Original.Data.Value);
                    File.WriteAllBytes(entity.Medium.Path, entity.Medium.Data.Value);
                    File.WriteAllBytes(entity.Thumbnail.Path, entity.Thumbnail.Data.Value);

                    return entity.SomeWhen(i => success);
                }

                // Rollback to pre-transaction
                transaction.Rollback();
                return Option.None<Image>();
            }
        }

        /// <summary>
        /// Deletes an image entity from the database as well as the filesystem
        /// </summary>
        /// <param name="entity">The image entity to delete</param>
        /// <returns>A boolean value indicating whether the operation was succesfull</returns>
        public async Task<bool> Delete(Image entity)
        {
            Debug.Assert(entity.MetaData.ID > 0, "The image must have an ID!");

            var imagesTable = await connection.QueryAsync(@"SELECT * FROM Images WHERE ID = @ID", new
            {
                ID = entity.MetaData.ID
            });

            // Get ID for each image
            int thumbnailID = imagesTable.Single().ThumbnailID;
            int mediumID = imagesTable.Single().MediumID;
            int originalID = imagesTable.Single().OriginalID;

            // Get path for each image
            var pathThumbnail = (await connection.QueryAsync<string>(@"SELECT Path FROM FileData WHERE ID = @ID", new
            {
                ID = thumbnailID
            })).Single();
            var pathMedium = (await connection.QueryAsync<string>(@"SELECT Path FROM FileData WHERE ID = @ID", new
            {
                ID = mediumID
            })).Single();
            var pathOriginal = (await connection.QueryAsync<string>(@"SELECT Path FROM FileData WHERE ID = @ID", new
            {
                ID = originalID
            })).Single();

            // Delete files from filesystem
            if(File.Exists(pathThumbnail))
            {
                File.Delete(pathThumbnail);
            }

            if(File.Exists(pathMedium))
            {
                File.Delete(pathMedium);
            }

            if(File.Exists(pathOriginal))
            {
                File.Delete(pathOriginal);
            }

            // Delete the data in FileData
            var deleted = await connection.ExecuteAsync(@"DELETE FROM FileData WHERE ID = @ID", new[]
            {
                new { ID = thumbnailID },
                new { ID = mediumID },
                new { ID = originalID }
            });

            // Delete the data in FileInfo and Images (cascades)
            deleted += await connection.ExecuteAsync(@"DELETE FROM FileInfo WHERE ID = @ID", new { ID = entity.MetaData.ID });

            // 4 Rows should have been affected
            return (deleted == 4);
        }

        /// <summary>
        /// Not supported operation. Use <seealso cref="Delete(Image)"/> method.
        /// </summary>
        /// <param name="key">N/A</param>
        /// <returns>N/A</returns>
        public Task<bool> Delete(Tuple<string, string, string> key)
        {
            throw new NotSupportedException("Use Delete(Image entity) method instead!");
        }

        /// <summary>
        /// Retrieves an image from the database with the give key.
        /// </summary>
        /// <param name="key">First item is the <see cref="User.Username"/>, the second item is the <see cref="Common.Models.FileInfo.Filename"/>m
        /// the third item is the file extension <see cref="Common.Models.FileInfo.Extension"/>.</param>
        /// <returns>An optional image.</returns>
        public async Task<Option<Image>> Get(Tuple<string, string, string> key)
        {
            // Get unique user
            var sqlUserID = @"SELECT * AS OwnerID FROM Users WHERE Username = @Username";
            var owner = (await connection.QueryAsync<User>(sqlUserID, new { Username = key.Item1 })).Single();

            // Get unique file info
            var sqlImage = @"SELECT ID, Filename, Extension, MimeType, OwnerID
                            FROM FileInfo
                            WHERE Filename = @Filename AND Extension = @Extension AND OwnerID = @OwnerID";
            var fileInfo = (await connection.QueryAsync<Common.Models.FileInfo>(sqlImage, new
            {
                Filename = key.Item2,
                Extension = key.Item3,
                OwnerID = owner.ID
            })).SingleOrDefault();

            // Did not find file information
            if (fileInfo == null)
            {
                return Option.None<Image>();
            }

            // Get ID for each image
            var imagesTable = (await connection.QueryAsync(@"SELECT * FROM Images WHERE ID = @ID", new { ID = fileInfo.ID })).Single();

            int thumbnailID = imagesTable.ThumbnailID;
            int mediumID = imagesTable.MediumID;
            int originalID = imagesTable.OriginalID;

            // Should be valid (consistent)
            var isValid = thumbnailID > 0 &&
                            mediumID > 0 &&
                            originalID > 0;

            // The IDs are not valid
            if (!isValid)
            {
                return Option.None<Image>();
            }

            // Retrieve the FileData images
            var thumbnailPath = connection.ExecuteScalar<string>(@"SELECT Path FROM FileData WHERE ID = @ID", new { thumbnailID });
            var mediumPath = connection.ExecuteScalar<string>(@"SELECT Path FROM FileData WHERE ID = @ID", new { mediumID });
            var originalPath = connection.ExecuteScalar<string>(@"SELECT Path FROM FileData WHERE ID = @ID", new { originalID });

            // Construct Image object
            var image = new Image
            {
                Thumbnail = new FileData { ID = thumbnailID, Path = thumbnailPath, Data = new Lazy<byte[]>(() => File.ReadAllBytes(thumbnailPath)) },
                Medium = new FileData { ID = mediumID, Path = mediumPath, Data = new Lazy<byte[]>(() => File.ReadAllBytes(mediumPath)) },
                Original = new FileData { ID = originalID, Path = originalPath, Data = new Lazy<byte[]>(() => File.ReadAllBytes(originalPath)) }
            };

            return image.Some();
        }

        /// <summary>
        /// Retrieves a list of images, sorted by their filename in ascending order.
        /// </summary>
        /// <param name="skip">The number of images to skip</param>
        /// <param name="take">The number of images to take</param>
        /// <returns>A list of images</returns>
        public async Task<List<Image>> Get(int skip, int take)
        {
            var sql = @"SELECT ID, Filename, Extension, MimeType, UserID AS ID, FirstName, LastName, Email, Username, RoleID AS Role
                        FROM
                        (
                            SELECT tmp.*, ROW_NUMBER() OVER (ORDER BY Filename ASC) AS 'RowNumber',
							u.ID AS UserID, u.FirstName, u.LastName, u.Email, u.Username, u.RoleID
                            FROM FileInfo AS tmp INNER JOIN Users u ON tmp.OwnerID = u.ID
                        ) AS seq
                        WHERE seq.RowNumber BETWEEN @From AND @To;";

            var fileInfos = await connection.QueryAsync<Common.Models.FileInfo, User, Common.Models.FileInfo>(sql, (info, user) =>
            {
                info.Owner = user;
                return info;
            }, new
            {
                From = skip + 1,
                To = skip + take
            });

            return await CreateImagesFromInfos(fileInfos);
        }

        /// <summary>
        /// Retrieves all images from the database
        /// </summary>
        /// <returns>A list of images</returns>
        public async Task<List<Image>> GetAll()
        {
            var sql = @"SELECT f.ID, Filename, Extension, MimeType, u.ID, FirstName, LastName, Email, Username, RoleID AS Role
                        FROM FileInfo f INNER JOIN Users u ON f.OwnerID = u.ID";

            var fileInfos = await connection.QueryAsync<Common.Models.FileInfo, User, Common.Models.FileInfo>(sql, (info, user) =>
            {
                info.Owner = user;
                return info;
            });

            return await CreateImagesFromInfos(fileInfos);
        }

        /// <summary>
        /// Gets an image by the ID
        /// </summary>
        /// <param name="id">The id of the image</param>
        /// <returns>An optional image</returns>
        public async Task<Option<Image>> GetByID(int id)
        {
            var infoSql = @"SELECT F.ID, Filename, Extension, MimeType, U.ID, FirstName, LastName, Email, Username, RoleID AS Role
                            FROM FileInfo F INNER JOIN Users U ON F.OwnerID = U.ID
                            WHERE F.ID = @ID";

            var info = (await connection.QueryAsync<Common.Models.FileInfo, User, Common.Models.FileInfo>(infoSql, (i, u) =>
            {
                i.Owner = u;
                return i;
            }, new { ID = id })).Single();

            var image = new Image();
            var thumbnailSql = @"SELECT F.ID, F.Path
                                     FROM Images I INNER JOIN FileData F ON I.ThumbnailID = F.ID
                                     WHERE I.ID = @ID;";
            var mediumSql = @"SELECT F.ID, F.Path
                                     FROM Images I INNER JOIN FileData F ON I.MediumID = F.ID
                                     WHERE I.ID = @ID;";
            var originalSql = @"SELECT F.ID, F.Path
                                     FROM Images I INNER JOIN FileData F ON I.OriginalID = F.ID
                                     WHERE I.ID = @ID;";

            using (var multi = await connection.QueryMultipleAsync(thumbnailSql + mediumSql + originalSql, new { ID = info.ID }))
            {
                var thumbnailData = multi.Read<FileData>().Single();
                var mediumData = multi.Read<FileData>().Single();
                var originalData = multi.Read<FileData>().Single();

                thumbnailData.Data = new Lazy<byte[]>(() => File.ReadAllBytes(thumbnailData.Path));
                mediumData.Data = new Lazy<byte[]>(() => File.ReadAllBytes(mediumData.Path));
                originalData.Data = new Lazy<byte[]>(() => File.ReadAllBytes(originalData.Path));

                image.MetaData = info;
                image.Thumbnail = thumbnailData;
                image.Medium = mediumData;
                image.Original = originalData;
            }

            return image.Some();
        }

        /// <summary>
        /// Not supported operation. Delete then reupload image.
        /// </summary>
        /// <param name="key">N/A</param>
        /// <param name="entity">N/A</param>
        /// <returns>N/A</returns>
        public Task<bool> Update(Tuple<string, string, string> key, Image entity)
        {
            throw new NotSupportedException("Cannot update an image! Delete then reupload.");
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

        /// <summary>
        /// The dispose pattern
        /// </summary>
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
        }

        /// <summary>
        /// Helper method which creates a collection of images given a collection of <see cref="Common.Models.FileInfo"/>
        /// </summary>
        /// <param name="fileInfos">The file info collection</param>
        /// <returns>An awaitable list of images</returns>
        private async Task<List<Image>> CreateImagesFromInfos(IEnumerable<Common.Models.FileInfo> fileInfos)
        {
            List<Image> images = new List<Image>();

            foreach (var info in fileInfos)
            {
                var image = new Image();
                var thumbnailSql = @"SELECT F.ID, F.Path
                                     FROM Images I INNER JOIN FileData F ON I.ThumbnailID = F.ID
                                     WHERE I.ID = @ID;";
                var mediumSql = @"SELECT F.ID, F.Path
                                     FROM Images I INNER JOIN FileData F ON I.MediumID = F.ID
                                     WHERE I.ID = @ID;";
                var originalSql = @"SELECT F.ID, F.Path
                                     FROM Images I INNER JOIN FileData F ON I.OriginalID = F.ID
                                     WHERE I.ID = @ID;";

                using (var multi = await connection.QueryMultipleAsync(thumbnailSql + mediumSql + originalSql, new { ID = info.ID }))
                {
                    var thumbnailData = multi.Read<FileData>().Single();
                    var mediumData = multi.Read<FileData>().Single();
                    var originalData = multi.Read<FileData>().Single();

                    thumbnailData.Data = new Lazy<byte[]>(() => File.ReadAllBytes(thumbnailData.Path));
                    mediumData.Data = new Lazy<byte[]>(() => File.ReadAllBytes(mediumData.Path));
                    originalData.Data = new Lazy<byte[]>(() => File.ReadAllBytes(originalData.Path));

                    image.MetaData = info;
                    image.Thumbnail = thumbnailData;
                    image.Medium = mediumData;
                    image.Original = originalData;
                }

                images.Add(image);
            }

            return images;
        }
    }
}
