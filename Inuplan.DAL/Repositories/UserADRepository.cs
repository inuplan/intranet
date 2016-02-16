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
    using System.DirectoryServices.AccountManagement;
    public class UserADRepository : IRepository<string, User>
    {
        private readonly PrincipalContext ctx;

        public UserADRepository(PrincipalContext ctx)
        {
            this.ctx = ctx;
        }

        public Task<Option<User>> Create(User entity)
        {
            throw new NotSupportedException();
        }

        public Task<Option<bool>> Delete(User entity)
        {
            throw new NotSupportedException();
        }

        public Task<Option<bool>> Delete(string key)
        {
            throw new NotSupportedException();
        }

        public Task<Option<User>> Get(string key)
        {
            // var adUser = UserPrincipal.FindByIdentity(principalContext, c.Username);
            // TODO: Only this method can work...
            var adUser = UserPrincipal.FindByIdentity(ctx, key);
            throw new NotImplementedException();
        }

        public Task<List<User>> Get(int skip, int take)
        {
            throw new NotSupportedException();
        }

        public Task<List<User>> GetAll()
        {
            throw new NotSupportedException();
        }

        public Task<Option<User>> GetByID(int id)
        {
            throw new NotSupportedException();
        }

        public Task<Option<bool>> Update(string key, User entity)
        {
            throw new NotSupportedException();
        }

        public void Dispose()
        {
            // No resources to dispose
        }
    }
}
