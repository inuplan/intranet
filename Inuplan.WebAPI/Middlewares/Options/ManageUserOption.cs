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

namespace Inuplan.WebAPI.Middlewares.Options
{
    using Autofac.Extras.Attributed;
    using Common.Commands;
    using Common.Enums;
    using Common.Logger;
    using Common.Models;
    using Common.Repositories;

    public class ManageUserOption
    {
        public ManageUserOption(
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            [WithKey(ServiceKeys.UserActiveDirectory)] IScalarRepository<string, User> userActiveDirectoryRepository,
            IScalarRepository<int, Role> roleRepository,
            ISetSpaceQuota spaceCommands,
            int quotaKB,
            ILogger<ManageUserMiddleware> logger
        )
        {
            UserDatabaseRepository = userDatabaseRepository;
            UserActiveDirectoryRepository = userActiveDirectoryRepository;
            RoleRepository = roleRepository;
            SpaceCommands = spaceCommands;
            QuotaKB = quotaKB;
            Logger = logger;
        }

        public IScalarRepository<string, User> UserDatabaseRepository { get; private set; }
        public IScalarRepository<string, User> UserActiveDirectoryRepository { get; private set; }
        public IScalarRepository<int, Role> RoleRepository { get; private set; }
        public ILogger<ManageUserMiddleware> Logger { get; private set; }
        public ISetSpaceQuota SpaceCommands { get; private set; }
        public int QuotaKB { get; private set; }
    }
}
