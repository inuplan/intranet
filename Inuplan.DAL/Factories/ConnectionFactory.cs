namespace Inuplan.DAL.Factories
{
    using Common.Factories;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.Contracts;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Data;
    using System.Data.SqlClient;

    public class ConnectionFactory : IConnectionFactory
    {
        readonly string connectionString;

        public ConnectionFactory(string connectionString)
        {
            Contract.Requires(connectionString != null);
            this.connectionString = connectionString;
        }

        public IDbConnection CreateConnection()
        {
            var connection = new SqlConnection(connectionString);
            connection.Open();
            return connection;
        }
    }
}
