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
        private bool disposedValue = false; // To detect redundant calls
        private readonly List<User> users;
        private int nextId;

        public NoDBRepo(List<User> users)
        {
            this.users = users;
        }

        public Task<Option<User>> Create(User entity, params object[] identifiers)
        {
            var id = nextId + 1;
            nextId++;

            entity.ID = id;
            users.Add(entity);

            return Task.FromResult(entity.SomeNotNull());
        }

        public Task<bool> Delete(string key)
        {
            var user = users
                            .SingleOrDefault(u => u.Username.Equals(key, StringComparison.OrdinalIgnoreCase))
                            .SomeNotNull();

            var result = user.Match(
                u => users.Remove(u),
                () => false);

            return Task.FromResult(result);
        }

        public Task<Option<User>> Get(string key)
        {
            var user = users.SingleOrDefault(u => u.Username.Equals(key, StringComparison.OrdinalIgnoreCase)).SomeNotNull();
            return Task.FromResult(user);
        }

        public Task<Pagination<User>> GetPage(int skip, int take, params object[] identifiers)
        {
            throw new NotImplementedException();
        }

        public Task<List<User>> GetAll(params object[] identifiers)
        {
            return Task.FromResult(users);
        }

        public Task<Option<User>> GetByID(int id)
        {
            var user = users.SingleOrDefault(u => u.ID == id).SomeNotNull();
            return Task.FromResult(user);
        }

        public Task<bool> Update(string key, User entity)
        {
            var user = users.SingleOrDefault(u => u.Username.Equals(key, StringComparison.OrdinalIgnoreCase)).SomeNotNull();
            var removed = user.Match(u => users.Remove(u), () => false);
            if(removed)
            {
                users.Add(entity);
            }

            return Task.FromResult(removed);
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

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
        }
    }
}
