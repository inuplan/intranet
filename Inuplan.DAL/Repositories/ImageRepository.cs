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
        private readonly IDbConnection connection;
        private bool disposedValue = false;

        public ImageRepository(IDbConnection connection)
        {
            this.connection = connection;
        }

        public async Task<Option<Image>> Create(Image entity)
        {
            entity.MetaData.ID = 0;
            var sqlInfo = @"INSERT INTO FileInfo
                        (Filename, Extension, MimeType, OwnerID)
                        VALUES(@Filename, @Extension, @MimeType, OwnerID);
                        SELECT ID FROM FileInfo WHERE ID = @@IDENTITY;";

            // Create info file
            entity.MetaData.ID = await connection.ExecuteScalarAsync<int>(sqlInfo, new
            {
                Filename = entity.MetaData.Filename,
                Extension = entity.MetaData.Extension,
                MimeType = entity.MetaData.MimeType,
                OwnerID = entity.MetaData.Owner.ID
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
                FID = entity.MetaData.ID,
                TID = entity.Thumbnail.ID,
                MID = entity.Medium.ID,
                OID = entity.Original.ID
            });

            // Write directory...
            // Assumption: All files are in the same directory
            var dir = System.IO.Path.GetDirectoryName(entity.Medium.Path);
            var dirInfo = System.IO.Directory.CreateDirectory(dir);

            var success = entity.MetaData.ID > 0 &&
                            entity.Original.ID > 0 &&
                            entity.Medium.ID > 0 &&
                            entity.Thumbnail.ID > 0;

            if(success)
            {
                // Write files 
                // Assumption: Files always succeed
                System.IO.File.WriteAllBytes(entity.Original.Path, entity.Original.Data.Value);
                System.IO.File.WriteAllBytes(entity.Medium.Path, entity.Medium.Data.Value);
                System.IO.File.WriteAllBytes(entity.Thumbnail.Path, entity.Thumbnail.Data.Value);
            }

            return entity.SomeWhen(i => success);
        }

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

        public Task<bool> Delete(Tuple<string, string, string> key)
        {
            throw new NotSupportedException("Use Delete(Image entity) method instead!");
        }

        public async Task<Option<Image>> Get(Tuple<string, string, string> key)
        {
            var sqlUserID = @"SELECT ID AS OwnerID FROM Users WHERE Username = @Username";
            var ownerID = (await connection.QueryAsync<int>(sqlUserID, new { Username = key.Item1 })).Single();

            var sqlImage = @"SELECT ID, Filename, Extension, MimeType, OwnerID
                            FROM FileInfo
                            WHERE Filename = @Filename AND Extension = @Extension AND OwnerID = @OwnerID";
            var fileInfo = (await connection.QueryAsync<Common.Models.FileInfo>(sqlImage, new
            {
                Filename = key.Item2,
                Extension = key.Item3,
                OwnerID = ownerID
            })).SingleOrDefault();

            var imagesTable = (await connection.QueryAsync(@"SELECT * FROM Images WHERE ID = @ID", new { ID = fileInfo.ID })).Single();

            // TODO: Continue... tomorrow
            int thumbnailID = imagesTable.ThumbnailID;


            throw new NotImplementedException();
        }

        public Task<List<Image>> Get(int skip, int take)
        {
            throw new NotImplementedException();
        }

        public Task<List<Image>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<Option<Image>> GetByID(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Update(Tuple<string, string, string> key, Image entity)
        {
            throw new NotImplementedException();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    connection.Dispose();
                }

                disposedValue = true;
            }
        }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
        }
    }
}
