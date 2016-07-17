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
    using Common.Models;
    using Common.Repositories;
    using Dapper;
    using Optional;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Threading.Tasks;
    using System.Linq;
    using System.Diagnostics;
    using System.Transactions;
    using System.IO;
    using Optional.Unsafe;
    using Common.Tools;
    using System.Data.SqlClient;
    using NLog;

    public class UserAlbumRepository : IScalarRepository<int, Album>
    {
        private static Logger Logger = LogManager.GetCurrentClassLogger();
        
        private readonly IDbConnection connection;

        private bool disposedValue = false;

        public UserAlbumRepository(IDbConnection connection)
        {
            this.connection = connection;
        }

        public async Task<Option<Album>> Create(Album entity, Action<Album> onCreate, params object[] identifiers)
        {
            try
            {
                var images = identifiers != null ?
                                identifiers.Cast<Image>().ToList() :
                                new List<Image>();

                Debug.Assert(entity.Owner != null && entity.Owner.ID > 0, "Must have a valid owner!");
                Debug.Assert(images.All(img => img.ID > 0), "All images must have existing ID's");

                using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {

                    var sql = @"INSERT INTO Albums (Description, Owner, Name)
                        VALUES(@Description, @Owner, @Name);
                        SELECT ID FROM Albums WHERE ID = @@IDENTITY;";

                    entity.ID = await connection.ExecuteScalarAsync<int>(sql, new
                    {
                        Description = entity.Description,
                        Owner = entity.Owner.ID,
                        Name = entity.Name,
                    });

                    foreach (var image in images)
                    {

                        var imgSql = @"INSERT INTO AlbumImages (AlbumID, ImageID) VALUES(@AlbumID, @ImageID);";
                        var row = await connection.ExecuteAsync(imgSql, new
                        {
                            AlbumID = entity.ID,
                            ImageID = image.ID,
                        });
                    }

                    var result = entity.SomeWhen(a => a.ID > 0);
                    if (result.HasValue)
                    {
                        onCreate(entity);
                        transactionScope.Complete();
                    }

                    return result;
                }
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
                throw;
            }
        }

        public async Task<bool> Delete(int key, Action<int> onDelete)
        {
            try
            {
                Debug.Assert(key > 0, "Must have valid key!");
                using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    var sql = @"DELETE FROM Albums WHERE ID = @key;";
                    var success = (await connection.ExecuteAsync(sql, new { key })).Equals(1);
                    if (success)
                    {
                        onDelete(key);
                        transactionScope.Complete();
                    }

                    return success;
                }
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
                throw;
            }
        }

        public async Task<Option<Album>> Get(int key)
        {
            try
            {
                // Assumption: The Album owner = Image owner
                var sql = @"SELECT 
                            img.ID, img.Description, Filename, Extension, MimeType,		/* Image */
                            preview.ID, preview.Path,									/* Preview */
                            thumbnail.ID, thumbnail.Path,								/* Thumbnail */
                            original.ID, original.Path,									/* Original */
                            u.ID, FirstName, LastName, Username, Email					/* Owner */

                        FROM Albums a INNER JOIN albumimages aimg
                        ON a.ID = aimg.AlbumID

                        INNER JOIN Images img
                        ON img.ID = aimg.ImageID

                        INNER JOIN FileInfo preview
                        ON img.Preview = preview.ID

                        INNER JOIN FileInfo thumbnail
                        ON img.Thumbnail = thumbnail.ID

                        INNER JOIN FileInfo original
                        ON img.Original = original.ID

                        INNER JOIN Users u
                        ON img.Owner = u.ID

                        WHERE a.ID = @key;";

                var albumImages = await connection.QueryAsync<
                    Image,
                    Common.Models.FileInfo,
                    Common.Models.FileInfo,
                    Common.Models.FileInfo,
                    User,
                    Image>(sql, (img, pre, thumb, orig, user) =>
                {
                    pre.Data = new Lazy<byte[]>(() => File.ReadAllBytes(pre.Path));
                    thumb.Data = new Lazy<byte[]>(() => File.ReadAllBytes(thumb.Path));
                    orig.Data = new Lazy<byte[]>(() => File.ReadAllBytes(orig.Path));

                    img.Owner = user;
                    img.Preview = pre;
                    img.Thumbnail = thumb;
                    img.Original = orig;

                    return img;
                }, new { key });

                var album = await connection.ExecuteScalarAsync<Album>(@"SELECT * FROM Albums WHERE ID = @key;", new { key });
                album.Images = albumImages.ToList();

                return album.SomeWhen(a => a.ID > 0);
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
                throw;
            }
        }

        public async Task<List<Album>> GetAll(params object[] identifiers)
        {
            try
            {
                var userID = (int)identifiers[0];
                Debug.Assert(userID > 0, "Must be valid user!");
                var sqlIds = @"SELECT ID FROM Albums WHERE Owner = @key;";
                var albumIds = await connection.QueryAsync<int>(sqlIds, new
                {
                    key = userID
                });

                var result = new List<Album>();
                foreach (var id in albumIds)
                {
                    var album = await Get(id);
                    result.Add(album.ValueOrFailure());
                }

                return result;

            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
                throw;
            }
        }

        public async Task<Option<Album>> GetByID(int id)
        {
            return await Get(id);
        }

        public async Task<Pagination<Album>> GetPage(int skip, int take, params object[] identifiers)
        {
            try
            {
                var userID = (int)identifiers[0];
                Debug.Assert(userID > 0, "Must have a valid user ID!");
                var sql = @"SELECT ID, Description, Owner, Name FROM
                            (SELECT *, Row_Number() OVER (ORDER BY ID) AS rn
                            FROM Albums WHERE Owner = @Owner) as seq
                        WHERE seq.rn BETWEEN @From AND @To;";

                // Album info without images
                var items = await connection.QueryAsync<Album>(sql, new
                {
                    Owner = userID,
                    From = skip + 1,
                    To = skip + take,
                });

                var total = await connection.ExecuteScalarAsync<int>(@"SELECT COUNT(*) FROM Albums WHERE Owner = @Owner", new
                {
                    Owner = userID
                });

                return Helpers.Paginate(skip, take, total, items.ToList());
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
                throw;
            }
        }

        public async Task<bool> Update(int key, Album entity)
        {
            try
            {
                Debug.Assert(entity.Images.All(img => img.ID > 0), "Images must pre-exist!");
                using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    var sql = @"UPDATE Album SET Description=@Description, Name=@Name WHERE ID=@ID";
                    var update = (await connection.ExecuteAsync(sql, new
                    {
                        Description = entity.Description,
                        Name = entity.Name,
                        ID = key
                    })).Equals(1);

                    var deleteSql = @"DELETE FROM AlbumImages WHERE AlbumID=@AlbumID";
                    var deleted = (await connection.ExecuteAsync(deleteSql, new
                    {
                        AlbumID = entity.ID
                    })).Equals(entity.Images.Count);

                    var imgs = entity.Images.Select(img => new { AlbumID = entity.ID, ImageID = img.ID }).ToArray();
                    var insertSql = @"INSERT INTO AlbumImages (AlbumID, ImageID) VALUES(@AlbumID, @ImageID);";
                    var inserted = (await connection.ExecuteAsync(insertSql, imgs)).Equals(imgs.Count());

                    var success = update && deleted && inserted;
                    if (success)
                    {
                        transactionScope.Complete();
                    }

                    return success;
                }
            }
            catch (SqlException ex)
            {
                Logger.Error(ex);
                throw;
            }
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects).
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
