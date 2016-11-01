namespace Inuplan.WebAPI.Controllers.Images
{
    using Autofac.Extras.Attributed;
    using Common.DTOs;
    using Common.Enums;
    using Common.Models;
    using Common.Repositories;
    using Common.Tools;
    using Extensions;
    using Optional.Unsafe;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;

    [EnableCors(origins: Constants.Origin, headers: "", methods: "*", SupportsCredentials = true)]
    public class UserAlbumController : DefaultController
    {
        private readonly IScalarRepository<int, Album> albumRepository;

        public UserAlbumController(
             [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
             IScalarRepository<int, Album> albumRepository)
            : base(userDatabaseRepository)
        {
            this.albumRepository = albumRepository;
        }

        public async Task<Album> Get(int albumId)
        {
            var album = await albumRepository.Get(albumId);
            return album.Match(
                a => a,
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
            var username = Request.GetUser().Map(u => u.Username).ValueOr("Anonymous");
            var album = await albumRepository.Get(albumId);
            var isOwner = album
                .Map(a => a.Owner.Username.Equals(username, StringComparison.OrdinalIgnoreCase))
                .ValueOr(false);

            if (!isOwner && !RequestContext.Principal.IsInRole("Admin"))
            {
                Request.CreateResponse(HttpStatusCode.Forbidden);
            }

            var deleted = await albumRepository.Delete(albumId, _ => Task.FromResult(0));
            return deleted ?
                Request.CreateResponse(HttpStatusCode.NoContent) :
                Request.CreateResponse(HttpStatusCode.InternalServerError);
        }

        public async Task<HttpResponseMessage> Post(Album album, List<int> imageIds)
        {
            // Set owner to current  user
            var owner = Request.GetUser().ValueOrFailure();
            album.Owner = owner;

            // Convert ids to shallow images
            var images = imageIds
                .Where(imgID => imgID > 0)
                .Select(imgID => new Image
                {
                    ID = imgID
                });

            // Create album
            var created = await albumRepository.Create(album, _ => Task.FromResult(true), images);

            // Return result
            return created.Match(
                a => Request.CreateResponse(HttpStatusCode.OK, a),
                () => Request.CreateResponse(HttpStatusCode.InternalServerError));
        }

        public async Task<Pagination<Album>> Get(int skip, int take, int userID)
        {
            var page = await albumRepository.GetPage(skip, take, sortBy: null, orderBy: null, identifiers: userID);
            return page;
        }

        public async Task<List<Album>> GetAll(int userId)
        {
            var albums = await albumRepository.GetAll(userId);
            return albums;
        }
    }
}
