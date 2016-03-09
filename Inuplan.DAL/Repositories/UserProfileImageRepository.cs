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
    using Common.DTOs;
    using Common.Repositories;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Optional;
    using System.Data;
    using Common.Enums;
    using Common.Models;
    using System.Transactions;
    using NLog;
    using Dapper;
    using System.Diagnostics;
    using System.IO;
    using System.Data.SqlClient;
    using System.Data.Common;
    public class UserProfileImageRepository : IScalarRepository<string, ProfileImage>
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();

        private readonly IDbConnection connection;

        private bool disposedValue = false; // To detect redundant calls

        public UserProfileImageRepository(IDbConnection connection)
        {
            this.connection = connection;
        }

        public async Task<Option<ProfileImage>> Create(ProfileImage entity)
        {
            Debug.Assert(entity.Metadata.Owner != null, "Must have a corresponding user for the profile picture");

            try
            {
                using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    var sqlInfo = @"INSERT INTO FileInfo
                                (Filename, Extension, MimeType, OwnerID)
                                VALUES
                                (@Filename, @Extension, @MimeType, @OwnerID);
                                SELECT ID FROM FileInfo WHERE ID = @@IDENTITY;";
                    var fileInfoID = await connection.ExecuteScalarAsync<int>(sqlInfo, new
                    {
                        Filename = entity.Metadata.Filename,
                        Extension = entity.Metadata.Extension,
                        MimeType = entity.Metadata.MimeType,
                        OwnerID = entity.Metadata.Owner.ID
                    });

                    var sqlData = @"INSERT INTO FileData
                                (Path)
                                VALUES (@Path);
                                SELECT ID FROM FileData WHERE ID = @@IDENTITY;";
                    var fileDataID = await connection.ExecuteScalarAsync<int>(sqlData, new
                    {
                        Path = entity.Data.Path
                    });

                    var sqlProfileImages = @"INSERT INTO ProfileImages
                                        (FileInfoID, FileDataID)
                                        VALUES (@FileInfoID, @FileDataID)";
                    await connection.ExecuteAsync(sqlProfileImages, new
                    {
                        FileInfoID = fileInfoID,
                        FileDataID = fileDataID
                    });

                    var profileSql = @"UPDATE Profiles
                                    SET FileInfoID = @FileInfoID
                                    WHERE ID = @ID
                                  IF @@ROWCOUNT = 0
                                   INSERT INTO Profiles
                                    (ID, FileInfoID)
                                   VALUES
                                    (@ID, @FileInfoID)";
                    var row = await connection.ExecuteAsync(profileSql, new
                    {
                        ID = entity.Metadata.Owner.ID,
                        FileInfoID = fileInfoID
                    });

                    // Now we save the image to the filesystem
                    // If sql inserts & updates have been successfull
                    var success = (row > 0) && fileInfoID > 0 && fileDataID > 0;
                    if (success)
                    {
                        // Create directory
                        var dir = Path.GetDirectoryName(entity.Data.Path);
                        var dirInfo = Directory.CreateDirectory(dir);

                        // Set values and save to db
                        entity.Data.ID = fileDataID;
                        entity.Metadata.ID = fileInfoID;
                        transactionScope.Complete();

                        // Save to filesystem
                        File.WriteAllBytes(entity.Data.Path, entity.Data.Data.Value);

                        // Return the updated entity
                        return entity.Some();
                    }
                }
            }
            catch (DbException ex)
            {
                logger.Error(ex);
            }

            // Fail, we return nothing
            return Option.None<ProfileImage>();
        }

        public async Task<Option<ProfileImage>> Get(string key)
        {
            var result = Option.None<ProfileImage>();

            // TODO: must return FileInfo & FileData so a ProfileImage can be constructed.
            var sql = @"select B.Path from
                        (select P.FileInfoID from Users U inner join Profiles P on U.ID = P.ID where U.Username = @Username) A
                        inner join
                        (select D.Path, PIM.FileInfoID from ProfileImages PIM inner join FileData D on PIM.FileDataID = D.ID) B
                        on A.FileInfoID = B.FileInfoID;";
            var path = await connection.ExecuteScalarAsync<string>(sql, new { Username = key });

            result = path.SomeNotNull().Map(p => new ProfileImage
            {
                Data = new FileData
                {
                }
            });

            throw new NotImplementedException();
        }

        public Task<Option<ProfileImage>> GetByID(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<ProfileImage>> Get(int skip, int take)
        {
            throw new NotImplementedException();
        }

        public Task<List<ProfileImage>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<bool> Update(string key, ProfileImage entity)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Delete(string key)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Delete(ProfileImage entity)
        {
            throw new NotImplementedException();
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
