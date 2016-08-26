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

namespace Inuplan.Common.Repositories
{
    using Models;
    using Optional;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IVectorRepository<K, E>
    {
        /// <summary>
        /// Create an entity in the repository.
        /// </summary>
        /// <param name="entity">The entity to create</param>
        /// <returns>A task of the created entity or <see cref="Option.None"/></returns>
        Task<Option<E>> CreateSingle(E entity, Func<E, Task> onCreate);

        /// <summary>
        /// Retrieves an entity with the key K
        /// </summary>
        /// <param name="key">The key K</param>
        /// <returns>An object of <see cref="S"/></returns>
        Task<List<E>> Get(K key);

        /// <summary>
        /// Retrieves a snippet collection of entities that are ordered by some criteria.
        /// </summary>
        /// <param name="skip">The number of items to skip</param>
        /// <param name="take">The number of items to take</param>
        /// <param name="identifiers">Extra identifiers necessary to select the entities</param>
        /// <returns></returns>
        Task<Pagination<ImageComment>> GetPage(int id, int skip, int take);

        /// <summary>
        /// Retrieves an entity by the given id
        /// </summary>
        /// <param name="id">The id of the entity</param>
        /// <returns>A task of an entity or <see cref="Option.None"/></returns>
        Task<Option<E>> GetSingleByID(int id);

        /// <summary>
        /// Update an entity T with the key K
        /// </summary>
        /// <param name="key">The key k</param>
        /// <param name="entity">The updated entity T</param>
        /// <returns>True if successful otherwise false</returns>
        Task<bool> UpdateSingle(K key, E entity, params object[] identifiers);

        /// <summary>
        /// Deletes an entity <see cref="E"/> with the key K
        /// </summary>
        /// <param name="key">The key K</param>
        /// <returns>True if successful otherwise false</returns>
        Task<bool> DeleteSingle(K key, Func<K, Task> onDelete);

        /// <summary>
        /// Deletes all entities related to the key K.
        /// </summary>
        /// <param name="key">The key</param>
        /// <returns>A boolean value indicating success or failure</returns>
        Task<bool> Delete(K key, Func<K, Task> onDelete);

        /// <summary>
        /// Returns the count of items with the key <see cref="K"/>
        /// </summary>
        /// <param name="key">The key identifier</param>
        /// <returns>The number of items for <see cref="K"/></returns>
        Task<int> Count(K key);
    }
}
