//-----------------------------------------------------------------------
// <copyright file="IRepository.cs" company="Inuplan">
//    Original work Copyright (c) Inuplan
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy
//    of this software and associated documentation files (the "Software"), to deal
//    in the Software without restriction, including without limitation the rights
//    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//    copies of the Software, and to permit persons to whom the Software is
//    furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in
//    all copies or substantial portions of the Software.
// </copyright>
//-----------------------------------------------------------------------

namespace Inuplan.Common.Repositories
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Optional;

    /// <summary>
    /// A generic repository interface, with standard <code>CRUD</code> operations defined
    /// </summary>
    /// <typeparam name="K">The type of key</typeparam>
    /// <typeparam name="T">The type of entity</typeparam>
    public interface IRepository<K, T> : IDisposable
    {
        /// <summary>
        /// Create an entity in the repository.
        /// </summary>
        /// <param name="entity">The entity to create</param>
        /// <returns>A task of the created entity or <see cref="Option.None"/></returns>
        Task<Option<T>> Create(T entity);

        /// <summary>
        /// Retrieves an entity with the key K
        /// </summary>
        /// <param name="key">The key K</param>
        /// <returns>A task of an entity or <see cref="Option.None"/></returns>
        Task<Option<T>> Get(K key);

        /// <summary>
        /// Retrieves an entity by the given id
        /// </summary>
        /// <param name="id">The id of the entity</param>
        /// <returns>A task of an entity or <see cref="Option.None"/></returns>
        Task<Option<T>> GetByID(int id);

        /// <summary>
        /// Paging function, which skips a number of entities, then <br />
        /// takes a number of entities.
        /// </summary>
        /// <param name="skip">The number of entities to skip</param>
        /// <param name="take">The number of entities to retrieve</param>
        /// <returns>A list of entities</returns>
        Task<List<T>> Get(int skip, int take);

        /// <summary>
        /// Retrieves every entity in the repository
        /// </summary>
        /// <returns>A list of entities</returns>
        Task<List<T>> GetAll();

        /// <summary>
        /// Update an entity T with the key K
        /// </summary>
        /// <param name="key">The key k</param>
        /// <param name="entity">The updated entity T</param>
        /// <returns>True if successful otherwise false</returns>
        Task<bool> Update(K key, T entity);

        /// <summary>
        /// Deletes an entity <see cref="T"/> with the key K
        /// </summary>
        /// <param name="key">The key K</param>
        /// <returns>True if successful otherwise false</returns>
        Task<bool> Delete(K key);

        /// <summary>
        /// Deletes an entity <see cref="T"/>
        /// </summary>
        /// <param name="entity">The entity <see cref="T"/></param>
        /// <returns>True if successful otherwise false</returns>
        Task<bool> Delete(T entity);
    }
}
