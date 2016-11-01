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

namespace Inuplan.DAL.WhatsNew.Commands
{
    using Common.Commands;
    using Common.Enums;
    using Common.Logger;
    using Dapper;
    using System;
    using System.Data;
    using System.Diagnostics;
    using System.Threading.Tasks;
    using System.Transactions;

    public class AddWhatsNewItem : IAddItem
    {
        private readonly IDbConnection connection;
        private readonly ILogger<AddWhatsNewItem> logger;

        public AddWhatsNewItem(
            IDbConnection connection,
            ILogger<AddWhatsNewItem> logger
        )
        {
            this.connection = connection;
            this.logger = logger;
        }

        public async Task<int> AddItem(int id, NewsType itemType)
        {
            logger.Debug("Class: AddWhatsNewItem, Method: AddItem, BEGIN");
            logger.Trace("{0}", Transaction.Current);
            Debug.Assert(id > 0, "Must have a valid ID");
            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var sql = @"INSERT INTO WhatsNew (TimeOn, Event, TargetID) VALUES(@TimeOn, @Event, @TargetID);
                            SELECT ID FROM WhatsNew WHERE ID = @@IDENTITY";

                var itemId = await connection.ExecuteScalarAsync<int>(sql, new
                {
                    TimeOn = DateTime.Now,
                    Event = itemType,
                    TargetID = id,
                });

                if (itemId > 0)
                {
                    transactionScope.Complete();
                }

                logger.Debug("Class: AddWhatsNewItem, Method: AddItem, END");
                return itemId;
            }
        }
    }
}
