﻿using Inuplan.Common.Models;
using Inuplan.Common.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inuplan.WebAPI.Middlewares.JWT
{
    class JWTClaimsRetrieverOptions
    {
        public IRepository<string, User> UserRepository { get; set; }

        public string Domain { get; set; }
    }
}
