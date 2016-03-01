using Inuplan.Common.Tools;
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
        [Route("token")]
        public async Task<HttpResponseMessage> Get()
        {
            var owinContext = Request.GetOwinContext();
            var bearer = owinContext.Get<string>(Constants.JWT_BEARER).SomeNotNull();
            var response = bearer.Match(b =>
            {
                var token = new { Token = b.Split(' ')[1] };
                return Request.CreateResponse(HttpStatusCode.OK, token);
            }, () => Request.CreateResponse(HttpStatusCode.BadRequest));

            return await Task.FromResult(response);
        }
    }
}