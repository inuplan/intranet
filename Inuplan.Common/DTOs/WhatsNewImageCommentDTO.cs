using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inuplan.Common.DTOs
{
    public class WhatsNewImageCommentDTO
    {
        public int ID { get; set; }
        public int ImageID { get; set; }
        public bool Deleted { get; set; }
        public UserDTO Author { get; set; }
        public string Text { get; set; }
        public UserDTO ImageUploadedBy { get; set; }
    }
}
