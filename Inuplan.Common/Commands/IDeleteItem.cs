using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inuplan.Common.Commands
{
    public interface IDeleteItem
    {
        void Connect();
        Task<bool> Remove(int id);
    }
}
