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

namespace Inuplan.Tests.IntegrationTests.RepositoryTests
{
    using Common.Models;
    using DAL.Repositories;
    using System;
    using System.Configuration;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Transactions;
    using Xunit;

    /// <summary>
    /// Integration tests of the <see cref="ImageCommentRepository"/> class.
    /// State the database must contain:
    /// - <see cref="User"/> with ID of 1009.
    /// - <see cref="Comment"/> with ID of 1014
    /// - <see cref="Image"/> with ID of 6006
    /// Note:
    /// To persist the queries call <seealso cref="TransactionScope.Complete"/>
    /// </summary>
    public class ImageComments
    {
        /// <summary>
        /// Tests retrieval of comment
        /// </summary>
        /// <param name="imageId">The ID of the image</param>
        [Theory]
        [InlineData(6006)]
        public void GetComment(int imageId)
        {
            ScopeAsync(async (c, t) =>
            {
                var commentRepo = new ImageCommentRepository(c);
                var result = await commentRepo.Get(imageId);
                Assert.True(result.Any());
            });
        }

        /// <summary>
        /// Tests retrieval by comment id
        /// </summary>
        /// <param name="commentId">The comment id</param>
        [Theory]
        [InlineData(1014)]
        public void GetCommentByID(int commentId)
        {
            ScopeAsync(async (c, t) =>
            {
                var commentRepo = new ImageCommentRepository(c);
                var result = await commentRepo.GetSingleByID(commentId);
                Assert.True(result.HasValue);
            });
        }

        /// <summary>
        /// Tests retrieval of paginated comments
        /// </summary>
        /// <param name="imageId">The image id</param>
        /// <param name="skip">The number of items to skip</param>
        /// <param name="take">The number of items to retrieve</param>
        [Theory]
        [InlineData(6006, 0, 10)]
        public void GetPageOfComments(int imageId, int skip, int take)
        {
            ScopeAsync(async (c, t) =>
            {
                var commentRepo = new ImageCommentRepository(c);
                var result = await commentRepo.GetPage(skip, take, imageId);
                Assert.True(result.CurrentItems.Any());
            });
        }

        /// <summary>
        /// Tests creation of comment
        /// </summary>
        /// <param name="remark">The comment remark</param>
        /// <param name="userId">The user ID</param>
        /// <param name="imageId">The image ID</param>
        [Theory]
        [InlineData("Hello", 1009, 6006)]
        [InlineData("World", 1009, 6006)]
        public void CreateComment(string remark, int userId, int imageId)
        {
            ScopeAsync(async (c, t) =>
            {
                // Arrange
                var commentRepo = new ImageCommentRepository(c);
                var comment = new Comment
                {
                    Author = new User { ID = userId },
                    PostedOn = DateTime.Now,
                    Text = remark,
                };

                // Act
                Action<Comment> onCreate = com => { };
                var result = await commentRepo.CreateSingle(comment, onCreate, imageId);

                // Assert
                Assert.True(result.HasValue);
            });
        }

        /// <summary>
        /// Tests deletion of comment
        /// </summary>
        /// <param name="commentId">The comment to delete</param>
        [Theory]
        [InlineData(1014)]
        public void DeleteComment(int commentId)
        {
            ScopeAsync(async (c, t) =>
            {
                // Arrange
                var commentRepo = new ImageCommentRepository(c);

                // Act
                Action<int> onDelete = (id) => { };
                var result = await commentRepo.DeleteSingle(commentId, onDelete);

                // Assert
                Assert.True(result);
            });
        }

        /// <summary>
        /// Tests updating a comment
        /// </summary>
        /// <param name="commentId">The comment id to update</param>
        /// <param name="updatedRemark">The updated remark</param>
        [Theory]
        [InlineData(1014, "Editted: Comment")]
        public void UpdateComment(int commentId, string updatedRemark)
        {
            ScopeAsync(async (c, t) =>
            {
                // Arrange
                var commentRepo = new ImageCommentRepository(c);
                var updated = new Comment
                {
                    PostedOn = DateTime.Now,
                    Text = updatedRemark
                };

                // Act
                var result = await commentRepo.UpdateSingle(commentId, updated);

                // Assert
                Assert.True(result);
            });
        }

        /// <summary>
        /// Helper method for calling the database within a transaction
        /// </summary>
        /// <param name="work">The work to be done with the database</param>
        private async void ScopeAsync(Func<IDbConnection, TransactionScope, Task> work)
        {
            var connectionString = ConfigurationManager.AppSettings["localConnection"];
            using (IDbConnection connection = new SqlConnection(connectionString))
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                await work.Invoke(connection, transaction);
            }
        }
    }
}
