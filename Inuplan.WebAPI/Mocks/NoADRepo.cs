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

namespace Inuplan.WebAPI.Mocks
{
    using Common.Models;
    using Common.Repositories;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Optional;

    public class NoADRepo : IScalarRepository<string, User>
    {
        private bool disposedValue = false;
        private readonly List<User> users;

        public NoADRepo()
        {
            users = MockUsers();
        }

        public Task<Option<User>> Create(User entity, Func<User, Task> onCreate, params object[] identifiers)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Delete(string key, Func<string, Task> onDelete)
        {
            throw new NotImplementedException();
        }

        public Task<Option<User>> Get(string key)
        {
            var user = users
                        .SingleOrDefault(u => u.Username.Equals(key, StringComparison.OrdinalIgnoreCase))
                        .SomeNotNull();
            var result = user.Or(new User
            {
                Email = string.Format("{0}@corp.com", key),
                FirstName = string.Format("F{0}", key),
                LastName = string.Format("L{0}", key),
                Username = key
            });

            return Task.FromResult(result);
        }

        public Task<Pagination<User>> GetPage(int skip, int take, Func<string> sortBy = null, Func<string> orderBy = null, params object[] identifiers)
        {
            throw new NotImplementedException();
        }

        public Task<List<User>> GetAll(params object[] identifiers)
        {
            throw new NotImplementedException();
        }

        public Task<Option<User>> GetByID(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Update(string key, User entity)
        {
            throw new NotImplementedException();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                }

                disposedValue = true;
            }
        }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
        }

        /// <summary>
        /// Creates a mock of users
        /// </summary>
        /// <returns>A list of mocked users</returns>
        private static List<User> MockUsers()
        {
            var roles = new List<Role> { new Role { ID = 1, Name = "User" } };
            return new List<User>
            {
                new User
                {
                    Email = "jdoe@corp.com",
                    FirstName = "John",
                    LastName = "Doe",
                    Username = "jdoe",
                    ID = 1,
                    Roles = roles,
                },
                new User
                {
                    Email = "my@mail.com",
                    FirstName = "Johnny",
                    LastName = "Cash",
                    Username = "Johnny",
                    ID = 2,
                    Roles = roles,
                }
            };
        }
    }
}
