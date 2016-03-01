using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inuplan.Common.DTOs
{
    public class ImageDTO
    {
        public int ImageID { get; set; }
        public string Filename { get; set; }
        public string Extension { get; set; }
        public string Username { get; set; }
        public string PathUrl { get; set; }
    }
}
