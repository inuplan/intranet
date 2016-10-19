// Copyright © 2015 Inuplan
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

namespace Inuplan.WebAPI.Controllers.Forum
{
    using Autofac.Extras.Attributed;
    using Common.DTOs.Forum;
    using Common.Enums;
    using Common.Logger;
    using Common.Models;
    using Common.Models.Forum;
    using Common.Repositories;
    using Common.Tools;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;

    [EnableCors(origins: Constants.Origin, headers: "*", methods: "*", SupportsCredentials = true)]
    public class ForumTitleController : DefaultController
    {
        private readonly IScalarRepository<int, ThreadPostTitle> threadTitleRepository;
        private readonly IVectorRepository<int, Comment> forumCommentRepository;
        private readonly ILogger<ForumTitleController> logger;

        public ForumTitleController(
            [WithKey(ServiceKeys.UserDatabase)] IScalarRepository<string, User> userDatabaseRepository,
            [WithKey(ServiceKeys.ThreadPostTitleRepository)] IScalarRepository<int, ThreadPostTitle> threadTitleRepository,
            [WithKey(ServiceKeys.ForumCommentsRepository)] IVectorRepository<int, Comment> forumCommentRepository,
            ILogger<ForumTitleController> logger
            )
            : base(userDatabaseRepository)
        {
            this.threadTitleRepository = threadTitleRepository;
            this.forumCommentRepository = forumCommentRepository;
            this.logger = logger;
        }

        [HttpGet]
        // localhost:9000/api/forumtitle?skip=0&take=10&sortBy=LastModified&orderBy=Asc
        public async Task<Pagination<ThreadPostTitleDTO>> Get(int skip, int take, ForumSortBy sortBy = ForumSortBy.CreatedOn, ForumOrderBy orderBy = ForumOrderBy.Desc)
        {
            try
            {
                logger.Debug("Class: ForumTitleRepository, Method: Get, BEGIN");
                var titles = await threadTitleRepository.GetPage(skip, take, () => sortBy.ToString(), () => orderBy.ToString());

                var titleDtos = titles.CurrentItems.Select(t =>
                {
                    var commentCount = forumCommentRepository.Count(t.ThreadID);

                    Comment latest = null;
                    if (t.LatestComment.HasValue)
                    {
                        latest = forumCommentRepository.GetSingleByID(t.LatestComment.Value).Result.ValueOr(alternative: null);
                    }

                    return Converters.ToThreadPostTitleDTO(t, latest, commentCount.Result);
                });

                logger.Debug("Class: ForumTitleRepository, Method: Get, END");
                return new Pagination<ThreadPostTitleDTO>
                {
                    CurrentItems = titleDtos.ToList(),
                    CurrentPage = titles.CurrentPage,
                    TotalPages = titles.TotalPages
                };
            }
            catch (System.Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }
    }
}
