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
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Optional;
    using System.Data;

    public class ImageCommentRepository : IRepository<int, List<Post>>
    {
        private bool disposedValue = false;

        private readonly IDbConnection connection;

        public ImageCommentRepository(IDbConnection connection)
        {
            this.connection = connection;
        }

        public Task<Option<List<Post>>> Create(List<Post> entity)
        {
            throw new NotImplementedException();
        }

        public Task<Option<List<Post>>> Get(int key)
        {
            throw new NotImplementedException();
        }

        public Task<Option<List<Post>>> GetByID(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<List<Post>>> Get(int skip, int take)
        {
            throw new NotImplementedException();
        }

        public Task<List<List<Post>>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<bool> Update(int key, List<Post> entity)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Delete(int key)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Delete(List<Post> entity)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
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
    }
}
