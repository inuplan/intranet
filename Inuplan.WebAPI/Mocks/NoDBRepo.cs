using Inuplan.Common.Models;
using Inuplan.Common.Repositories;
using Optional;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inuplan.WebAPI.Mocks
{
    public class NoDBRepo : IScalarRepository<string, User>
    {
        public Task<Option<User>> Create(User entity)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Delete(User entity)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Delete(string key)
        {
            throw new NotImplementedException();
        }

        public Task<Option<User>> Get(string key)
        {
            return Task.FromResult(new User
            {
                Email = "jdoe@corp.com",
                ID = 1,
                FirstName = "John",
                LastName = "Doe",
                Role = RoleType.User,
                Username = "jdoe"
            }.Some());
        }

        public Task<List<User>> Get(int skip, int take)
        {
            throw new NotImplementedException();
        }

        public Task<List<User>> GetAll()
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

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

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

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
        }
        #endregion
    }
}
