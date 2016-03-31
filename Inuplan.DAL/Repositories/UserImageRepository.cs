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
    using Key = System.Tuple<string, string, string>;

    /// <summary>
    /// The first item in the key tuple is the <see cref="User.Username"/> and the
    /// second item is the filename of the image, and the third is the extension of the filename
    /// </summary>
    public class UserImageRepository : IScalarRepository<Key, UserImage>
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
        /// <returns>An optional image with correct ID</returns>
        public async Task<Option<UserImage>> Create(UserImage entity)
        {
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    entity.Metadata.ID = 0;
                    var sqlInfo = @"INSERT INTO FileInfo
                        (Filename, Extension, MimeType, OwnerID)
                        VALUES(@Filename, @Extension, @MimeType, @OwnerID);
                        SELECT ID FROM FileInfo WHERE ID = @@IDENTITY;";

                    // Create info file
                    entity.Metadata.ID = await connection.ExecuteScalarAsync<int>(sqlInfo, new
                    {
                        Filename = entity.Metadata.Filename,
                        Extension = entity.Metadata.Extension,
                        MimeType = entity.Metadata.MimeType,
                        OwnerID = entity.Metadata.Owner.ID
                    });

                    // Create 3 images
                    var sqlOriginal = @"INSERT INTO FileData (Path) VALUES (@Path);
                                SELECT ID FROM FileData WHERE ID = @@IDENTITY;";
                    entity.Original.ID = await connection.ExecuteScalarAsync<int>(sqlOriginal, new
                    {
                        Path = entity.Original.Path
                    });

                    var sqlMedium = @"INSERT INTO FileData (Path) VALUES (@Path);
                                SELECT ID FROM FileData WHERE ID = @@IDENTITY;";
                    entity.Medium.ID = await connection.ExecuteScalarAsync<int>(sqlMedium, new
                    {
                        Path = entity.Medium.Path
                    });

                    var sqlThumbnail = @"INSERT INTO FileData (Path) VALUES (@Path);
                                SELECT ID FROM FileData WHERE ID = @@IDENTITY;";
                    entity.Thumbnail.ID = await connection.ExecuteScalarAsync<int>(sqlThumbnail, new
                    {
                        Path = entity.Thumbnail.Path
                    });

                    var sql = @"INSERT INTO Images (ID, ThumbnailID, MediumID, OriginalID)
                        VALUES (@FID, @TID, @MID, @OID);";
                    await connection.ExecuteAsync(sql, new
                    {
                        FID = entity.Metadata.ID,
                        TID = entity.Thumbnail.ID,
                        MID = entity.Medium.ID,
                        OID = entity.Original.ID
                    });

                    var success = entity.Metadata.ID > 0 &&
                                    entity.Original.ID > 0 &&
                                    entity.Medium.ID > 0 &&
                                    entity.Thumbnail.ID > 0;

                    if (success)
                    {
                        // Write directory...
                        // Assumption: All files are in the same directory
                        var dir = Path.GetDirectoryName(entity.Medium.Path);
                        var dirInfo = Directory.CreateDirectory(dir);

                        // Commit database transactions
                        transactionScope.Complete();

                        // Write files 
                        // Assumption: Filesystem always succeed writing
                        File.WriteAllBytes(entity.Original.Path, entity.Original.Data.Value);
                        File.WriteAllBytes(entity.Medium.Path, entity.Medium.Data.Value);
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

            return Option.None<UserImage>();
        }

        /// <summary>
        /// Deletes an image entity from the database as well as the filesystem
        /// </summary>
        /// <param name="entity">The image entity to delete</param>
        /// <returns>A boolean value indicating whether the operation was succesfull</returns>
        public async Task<bool> Delete(UserImage entity)
        {
            Debug.Assert(entity.Metadata.ID > 0, "The image must have an ID!");

            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var deleted = 0;
                var imagesTable = await connection.QueryAsync(@"SELECT * FROM Images WHERE ID = @ID", new
                {
                    ID = entity.Metadata.ID
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


                // Delete the comments for the image. (cascades: Posts -> ImagePosts)
                var deletePostsSql = @"DELETE P
                    FROM Posts P INNER JOIN ImagePosts I
                    ON P.ID = I.PostID
                    WHERE I.FileInfoID = @key";

                // We cannot know if it was successfull, because there might be no comments...
                // Although an exception will be thrown, if unsuccesfull.
                await connection.ExecuteAsync(deletePostsSql, new { key = entity.Metadata.ID });

                // Delete the data in FileInfo and Images (cascades)
                deleted = await connection.ExecuteAsync(@"DELETE FROM FileInfo WHERE ID = @ID", new { ID = entity.Metadata.ID });

                // Delete the data in FileData
                deleted += await connection.ExecuteAsync(@"DELETE FROM FileData WHERE ID = @ID", new[]
                {
                    new { ID = thumbnailID },
                    new { ID = mediumID },
                    new { ID = originalID }
                });


                if(deleted == 4)
                {
                    // Commit database changes
                    transactionScope.Complete();

                    // Delete files from filesystem
                    if (File.Exists(pathThumbnail))
                    {
                        File.Delete(pathThumbnail);
                    }

                    if (File.Exists(pathMedium))
                    {
                        File.Delete(pathMedium);
                    }

                    if (File.Exists(pathOriginal))
                    {
                        File.Delete(pathOriginal);
                    }

                    return true;
                }

                return false;
            }
        }

        /// <summary>
        /// Deletes an image from the database
        /// </summary>
        /// <param name="key">The username, filename and extension</param>
        /// <returns>True if deleted otherwise false</returns>
        public async Task<bool> Delete(Key key)
        {
            // Username, filename, extension
            var image = await Get(key);
            return await image.Match(async img =>
            {
                return await Delete(img);
            },
            () => Task.FromResult(false));
        }

        /// <summary>
        /// Retrieves an image from the database with the give key.
        /// </summary>
        /// <param name="key">First item is the <see cref="User.Username"/>, the second item is the <see cref="Common.Models.FileInfo.Filename"/>m
        /// the third item is the file extension <see cref="Common.Models.FileInfo.Extension"/>.</param>
        /// <returns>An optional image.</returns>
        public async Task<Option<UserImage>> Get(Key key)
        {
            // Get unique user
            var sqlUserID = @"SELECT * FROM Users WHERE Username = @Username";
            var owner = (await connection.QueryAsync<User>(sqlUserID, new { Username = key.Item1 })).Single();
            // TODO: Clean up the database.
            // When deleting a user, the constraints are NOT set to NULL because of NO ACTION
            // Must set the rule to: SET NULL where it applies!

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
                return Option.None<UserImage>();
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
                return Option.None<UserImage>();
            }

            // Retrieve the FileData images
            var thumbnailPath = connection.ExecuteScalar<string>(@"SELECT Path FROM FileData WHERE ID = @ID", new { ID = thumbnailID });
            var mediumPath = connection.ExecuteScalar<string>(@"SELECT Path FROM FileData WHERE ID = @ID", new { ID = mediumID });
            var originalPath = connection.ExecuteScalar<string>(@"SELECT Path FROM FileData WHERE ID = @ID", new { ID = originalID });

            // Construct Image object
            var image = new UserImage
            {
                Thumbnail = new FileData { ID = thumbnailID, Path = thumbnailPath, Data = new Lazy<byte[]>(() => File.ReadAllBytes(thumbnailPath)) },
                Medium = new FileData { ID = mediumID, Path = mediumPath, Data = new Lazy<byte[]>(() => File.ReadAllBytes(mediumPath)) },
                Original = new FileData { ID = originalID, Path = originalPath, Data = new Lazy<byte[]>(() => File.ReadAllBytes(originalPath)) },
                Metadata = fileInfo
            };

            return image.Some();
        }

        /// <summary>
        /// Retrieves a list of images, sorted by their filename in ascending order.
        /// </summary>
        /// <param name="skip">The number of images to skip</param>
        /// <param name="take">The number of images to take</param>
        /// <returns>A list of images</returns>
        public async Task<List<UserImage>> Get(int skip, int take)
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
        public async Task<List<UserImage>> GetAll()
        {
            var sql = @"(SELECT
                            FID AS ID, Filename, Extension, MimeType, /* FileInfo */
                            UserID AS ID, FirstName, LastName, Email, Username, RoleID AS Role /* User */
                        FROM
                            (SELECT
                                F.ID AS FID, Filename, Extension, MimeType,
                                U.ID AS UserID, FirstName, LastName, Email, Username, RoleID
                            FROM
                                FileInfo F INNER JOIN Users U
                                ON F.OwnerID = U.ID) AS FileUsers
                        INNER JOIN Images I
                        ON I.ID = FileUsers.FID)";

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
        public async Task<Option<UserImage>> GetByID(int id)
        {
            var infoSql = @"SELECT F.ID, Filename, Extension, MimeType, U.ID, FirstName, LastName, Email, Username, RoleID AS Role
                            FROM FileInfo F INNER JOIN Users U ON F.OwnerID = U.ID
                            WHERE F.ID = @ID";

            var info = (await connection.QueryAsync<Common.Models.FileInfo, User, Common.Models.FileInfo>(infoSql, (i, u) =>
            {
                i.Owner = u;
                return i;
            }, new { ID = id })).Single();

            var image = new UserImage();
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

                image.Metadata = info;
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
        public Task<bool> Update(Key key, UserImage entity)
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

        /// <summary>
        /// Helper method which creates a collection of images given a collection of <see cref="Common.Models.FileInfo"/>
        /// </summary>
        /// <param name="fileInfos">The file info collection</param>
        /// <returns>An awaitable list of images</returns>
        private async Task<List<UserImage>> CreateImagesFromInfos(IEnumerable<Common.Models.FileInfo> fileInfos)
        {
            List<UserImage> images = new List<UserImage>();

            foreach (var info in fileInfos)
            {
                var image = new UserImage();
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

                    image.Metadata = info;
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
