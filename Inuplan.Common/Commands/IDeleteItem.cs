using Inuplan.Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inuplan.Common.Commands
{
    public interface IDeleteItem
    {
        Task<bool> Remove(int id, NewsType ofType);
    }
}
