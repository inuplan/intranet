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
    using Optional;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    /// <summary>
    /// A repository which naturally contains multiple entities.
    /// </summary>
    /// <typeparam name="K">The key for the collection <seealso cref="T"/></typeparam>
    /// <typeparam name="T">The enumerable entities of <seealso cref="E"/></typeparam>
    /// <typeparam name="E">The scalar entity</typeparam>
    public interface IVectorRepository<K, T, E> : IDisposable
        where T : IEnumerable<E>
    {
        /// <summary>
        /// Creates a scalar entity
        /// </summary>
        /// <param name="key">The key</param>
        /// <param name="entity">The single entity</param>
        /// <returns>The created entity</returns>
        Task<Option<E>> CreateSingle(K key, E entity);

        /// <summary>
        /// Retrieves the collection of entities
        /// </summary>
        /// <param name="key">The key</param>
        /// <returns>An enumerable collection of type <seealso cref="E"/></returns>
        Task<T> Get(K key);

        /// <summary>
        /// Retrieves a grouped collection of <seealso cref="T"/>,
        /// which are grouped by their key <seealso cref="K"/>.
        /// </summary>
        /// <returns>A collection of grouped <seealso cref="T"/></returns>
        Task<IEnumerable<IGrouping<K, T>>> GetAll();

        /// <summary>
        /// Updates a scalar entity <seealso cref="E"/>.
        /// </summary>
        /// <param name="entity">The single entity to update</param>
        /// <returns>True if updated otherwise false</returns>
        Task<bool> UpdateSingle(E entity);

        /// <summary>
        /// Deletes a collection of entities with the key <seealso cref="K"/>
        /// </summary>
        /// <param name="key">The key</param>
        /// <returns>True if deleted otherwise false</returns>
        Task<bool> Delete(K key);

        /// <summary>
        /// Deletes a single entity
        /// </summary>
        /// <param name="entity">The single entity to update</param>
        /// <returns>True if deleted otherwise false</returns>
        Task<bool> DeleteSingle(E entity);
    }
}
