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

namespace Inuplan.DAL.UserSpaceInfo.Queries
{
    using Common.Queries.UserSpaceInfoQueries;
    using System;
    using System.Threading.Tasks;
    using Common.DTOs;
    using Optional;
    using Common.Models;
    using System.Data;
    using Dapper;
    using Common.Logger;
    using System.Transactions;
    using Common.Tools;

    public class UserSpaceQueryHandles : IGetUserSpaceInfo
    {
        private readonly IDbConnection connection;
        private readonly ILogger<UserSpaceQueryHandles> logger;
        private readonly int quota;
        private readonly string root;

        public UserSpaceQueryHandles(
            string root,
            IDbConnection connection,
            ILogger<UserSpaceQueryHandles> logger,
            int quota
        )
        {
            this.root = root;
            this.connection = connection;
            this.logger = logger;
            this.quota = quota;
        }

        public async Task<Option<UserSpaceInfoDTO>> GetUserSpaceInfo(int userId)
        {
            try
            {
                logger.Begin();
                using(var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    var sqlUser = @"SELECT
                                        ID, FirstName, LastName, Username, Email, DisplayName
                                    FROM Users
                                    WHERE ID = @UserID";

                    var user = await connection.QuerySingleOrDefaultAsync<User>(sqlUser, new
                    {
                        UserID = userId
                    });

                    // Get path for user upload folder:
                    var uploadFolder = Helpers.GetUserImageFolder(root, user.Username);
                    var folderSize = (int)(Helpers.GetDirectorySizeKb(uploadFolder));
                    var userDto = Converters.ToUserDTO(user);

                    var result = new UserSpaceInfoDTO
                    {
                        SpaceQuotaKB = quota,
                        UsedSpaceKB = folderSize,
                        User = userDto
                    };

                    logger.End();
                    return result.SomeWhen(r => r.User != null);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }
    }
}
