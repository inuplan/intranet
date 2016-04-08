namespace Inuplan.WebAPI.Controllers
{
    using Common.Models;
    using Common.Repositories;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;

    [EnableCors(origins: @"http://beta.intranet", headers: "", methods: "*", SupportsCredentials = true)]
    public class UserAlbumController : DefaultController
    {
        private readonly IScalarRepository<int, Album> albumRepository;

        public UserAlbumController(IScalarRepository<int, Album> albumRepository)
        {
            this.albumRepository = albumRepository;
        }

        public async Task<Album> Get(int albumId)
        {
            var album = await albumRepository.Get(albumId);
            return album.Match(a => a,
                () => { throw new HttpResponseException(HttpStatusCode.NotFound); });
        }

        public async Task<HttpResponseMessage> Put([FromUri] int albumId, Album album)
        {
            var updated = await albumRepository.Update(albumId, album);
            return updated ?
                Request.CreateResponse(HttpStatusCode.NoContent) :
                Request.CreateResponse(HttpStatusCode.InternalServerError);
        }

        public async Task<HttpResponseMessage> Delete(int albumId)
        {
            var user = GetPrincipalIdentityUser(RequestContext.Principal);
            var album = await albumRepository.Get(albumId);
            var isOwner = album
                .Map(a => a.Owner.Username.Equals(user.Username, StringComparison.OrdinalIgnoreCase))
                .ValueOr(false);

            if(!isOwner && !RequestContext.Principal.IsInRole("Admin"))
            {
                Request.CreateResponse(HttpStatusCode.Forbidden);
            }

            var deleted = await albumRepository.Delete(albumId);
            return deleted ?
                Request.CreateResponse(HttpStatusCode.NoContent) :
                Request.CreateResponse(HttpStatusCode.InternalServerError);
        }

        public async Task<HttpResponseMessage> Post(Album album, List<int> imageIds)
        {
            // Set owner to current  user
            var owner = GetPrincipalIdentityUser(RequestContext.Principal);
            album.Owner = owner;

            // Convert ids to shallow images
            var images = imageIds
                .Where(imgID => imgID > 0)
                .Select(imgID => new Image
                {
                    ID = imgID
                });

            // Create album
            var created = await albumRepository.Create(album, images);

            // Return result
            return created.Match(
                a => Request.CreateResponse(HttpStatusCode.OK, a),
                () => Request.CreateResponse(HttpStatusCode.InternalServerError));
        }

        public async Task<Pagination<Album>> Get(int skip, int take, int userID)
        {
            var page = await albumRepository.GetPage(skip, take, userID);
            return page;
        }

        public async Task<List<Album>> GetAll(int userId)
        {
            var albums = await albumRepository.GetAll(userId);
            return albums;
        }
    }
}
