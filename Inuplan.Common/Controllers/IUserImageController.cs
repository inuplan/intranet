using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Inuplan.Common.DTOs;

namespace Inuplan.Common.Controllers
{
    public interface IUserImageController
    {
        Task<HttpResponseMessage> Delete(string username, string file);
        Task<HttpResponseMessage> Get(string username, string file);
        Task<List<UserImageDTO>> GetAll(string username, bool comments = false);
        Task<HttpResponseMessage> GetByID(int id);
        Task<HttpResponseMessage> GetPreview(string username, string file);
        Task<HttpResponseMessage> GetProfilePicture(string username);
        Task<HttpResponseMessage> GetThumbnail(string username, string file);
        Task<HttpResponseMessage> Post(string username);
        Task<HttpResponseMessage> UploadProfileImage(string username);
    }
}