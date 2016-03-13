using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inuplan.Common.Models
{
    /// <summary>
    /// An album consists of a collection of images as well as comments
    /// </summary>
    public class Album
    {
        /// <summary>
        /// Gets or sets the ID of the album
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// Gets or sets the owner of the album
        /// </summary>
        public User Owner { get; set; }

        /// <summary>
        /// Gets or sets the name of the album
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the images for this album
        /// </summary>
        public List<UserImage> Images { get; set; }

        /// <summary>
        /// Gets or sets the comments for this album
        /// </summary>
        public List<Post> Comments { get; set; }
    }
}
