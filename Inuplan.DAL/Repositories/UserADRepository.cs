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
    using System.Threading.Tasks;
    using Optional;
    using System.DirectoryServices.AccountManagement;

    /// <summary>
    /// Retrieves user information from Active Directory
    /// Only GET method is supported.
    /// </summary>
    public class UserADRepository : IScalarRepository<string, User>
    {
        /// <summary>
        /// The principal context from which every query is run against
        /// </summary>
        private readonly PrincipalContext ctx;
        
        /// <summary>
        /// Lock mechanism for multithreaded access
        /// </summary>
        private readonly object locking;

        /// <summary>
        /// Dispose pattern implementation.
        /// Indicates whether dispose has been called multiple times.
        /// </summary>
        private bool disposed;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserADRepository"/> class.
        /// </summary>
        /// <param name="ctx">The principal context from which every query is run against</param>
        public UserADRepository(PrincipalContext ctx)
        {
            this.ctx = ctx;
            locking = new object();
        }

        /// <summary>
        /// Not supported operation
        /// </summary>
        /// <param name="entity">N/A</param>
        /// <exception cref="NotSupportedException">Not supported operation</exception>
        /// <returns>N/A</returns>
        public Task<Option<User>> Create(User entity, Func<User, Task> onCreate, params object[] identifiers)
        {
            throw new NotSupportedException("Not supported operation!");
        }

        /// <summary>
        /// Not supported operation
        /// </summary>
        /// <param name="entity">N/A</param>
        /// <exception cref="NotSupportedException">Not supported operation</exception>
        /// <returns>N/A</returns>
        public Task<bool> Delete(User entity)
        {
            throw new NotSupportedException("Not supported operation!");
        }

        /// <summary>
        /// Not supported operation
        /// </summary>
        /// <param name="key">N/A</param>
        /// <exception cref="NotSupportedException">Not supported operation</exception>
        /// <returns>N/A</returns>
        public Task<bool> Delete(string key, Func<string, Task> onDelete)
        {
            throw new NotSupportedException("Not supported operation!");
        }

        /// <summary>
        /// Returns a user with the given username.
        /// Or none, if none found.
        /// </summary>
        /// <param name="key">The username</param>
        /// <returns>An awaitable optional user</returns>
        public Task<Option<User>> Get(string key)
        {
            var adUser = UserPrincipal.FindByIdentity(ctx, key).SomeNotNull();

            var user = adUser.Map(u =>
                new User
                {
                    Email = u.EmailAddress,
                    FirstName = u.GivenName,
                    LastName = u.Surname,
                    Username = u.SamAccountName
                }
            );

            return Task.FromResult(user);
        }

        /// <summary>
        /// Not supported operation
        /// </summary>
        /// <param name="skip">N/A</param>
        /// <param name="take">N/A</param>
        /// <exception cref="NotSupportedException">Not supported operation</exception>
        /// <returns>N/A</returns>
        public Task<Pagination<User>> GetPage(int skip, int take, Func<string> sortBy = null, Func<string> orderBy = null, params object[] identifiers)
        {
            throw new NotSupportedException("Not supported operation!");
        }

        /// <summary>
        /// Not supported operation
        /// </summary>
        /// <exception cref="NotSupportedException">Not supported operation</exception>
        /// <returns>N/A</returns>
        public Task<List<User>> GetAll(params object[] identifiers)
        {
            throw new NotSupportedException("Not supported operation!");
        }

        /// <summary>
        /// Not supported operation
        /// </summary>
        /// <param name="id">N/A</param>
        /// <exception cref="NotSupportedException">Not supported operation</exception>
        /// <returns>N/A</returns>
        public Task<Option<User>> GetByID(int id)
        {
            throw new NotSupportedException("Not supported operation!");
        }

        /// <summary>
        /// Not supported operation
        /// </summary>
        /// <param name="key">N/A</param>
        /// <param name="entity">N/A</param>
        /// <exception cref="NotSupportedException">Not supported operation</exception>
        /// <returns>N/A</returns>
        public Task<bool> Update(string key, User entity)
        {
            throw new NotSupportedException("Not supported operation!");
        }

        /// <summary>
        /// A protected dispose method for the dispose pattern.
        /// </summary>
        /// <param name="disposing">Indicates whether to dispose this resource</param>
        protected virtual void Dispose(bool disposing)
        {
            lock(locking)
            {
                if(disposed)
                {
                    return;
                }

                if(disposing)
                {
                    if(ctx != null)
                    {
                        ctx.Dispose();
                        disposed = true;
                    }
                }
            }
        }

        /// <summary>
        /// Implementation of the dispose pattern.
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
        }
    }
}
