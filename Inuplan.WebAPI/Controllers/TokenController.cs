using Inuplan.Common.Tools;
using NLog;
using Optional;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Inuplan.WebAPI.Controllers
{
    [RoutePrefix("api/v1")]
    public class TokenController : ApiController
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();

        [Route("token/{username}")]
        public async Task<HttpResponseMessage> Get(string username)
        {
            var owinContext = Request.GetOwinContext();
            var bearer = owinContext.Get<string>(Constants.OWIN_JWT).SomeNotNull();
            var response = bearer.Match(b =>
            {
                var same = User.Identity.Name.Equals(username, System.StringComparison.OrdinalIgnoreCase);
                if (!same)
                {
                    logger.Error("User token request for {0}, but is authenticated as: {1}", username, User.Identity.Name);
                    return Request.CreateResponse(HttpStatusCode.Unauthorized);
                }

                var token = new { Token = b.Split(' ')[1] };
                return Request.CreateResponse(HttpStatusCode.OK, token);
            }, () => Request.CreateResponse(HttpStatusCode.BadRequest));

            return await Task.FromResult(response);
        }
    }
}