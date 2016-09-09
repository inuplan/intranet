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
    using Common.Models.Forum;
    using Common.Repositories;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Common.Models;
    using Optional;
    using System.Data;
    using Dapper;
    using System.Transactions;
    using System.Diagnostics;

    public class ForumPostTitleRepository : IScalarRepository<int, ThreadPostTitle>
    {
        private readonly IDbConnection connection;

        public ForumPostTitleRepository(IDbConnection connection)
        {
            this.connection = connection;
        }

        public async Task<Option<ThreadPostTitle>> Create(ThreadPostTitle entity, Func<ThreadPostTitle, Task> onCreate, params object[] identifiers)
        {
            Debug.Assert(entity.Author != null && entity.Author.ID > 0, "Must have a valid user assigned");
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var sql = @"INSERT INTO ThreadTitles
                            (CreatedOn, Published, Author, Deleted, Title)
                            VALUES (@CreatedOn, @IsPublished, @AuthorID, @Deleted, @Title);
                            SELECT ID FROM ThreadTitles WHERE ID = @@IDENTITY;";

                var createdOn = DateTime.Now;
                var id = await connection.ExecuteScalarAsync<int>(sql, new
                {
                    CreatedOn = createdOn,
                    entity.IsPublished,
                    AuthorID = entity.Author.ID,
                    entity.Deleted,
                    entity.Title
                });

                entity.ID = id;

                if(id > 0)
                {
                    transactionScope.Complete();
                    await onCreate(entity);
                }

                return entity.SomeWhen(e => e.ID > 0);
            }
        }

        public Task<bool> Delete(int key, Func<int, Task> onDelete)
        {
            throw new NotImplementedException();
        }

        public Task<Option<ThreadPostTitle>> Get(int key)
        {
            throw new NotImplementedException();
        }

        public Task<List<ThreadPostTitle>> GetAll(params object[] identifiers)
        {
            throw new NotImplementedException();
        }

        public Task<Option<ThreadPostTitle>> GetByID(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Pagination<ThreadPostTitle>> GetPage(int skip, int take, params object[] identifiers)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Update(int key, ThreadPostTitle entity)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }

    }
}
