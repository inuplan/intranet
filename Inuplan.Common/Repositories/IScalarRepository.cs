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
    using Models;

    /// <summary>
    /// A generic repository interface, with standard <code>CRUD</code> operations defined.
    /// This repository operates on a single entity value.
    /// </summary>
    /// <typeparam name="K">The type of key</typeparam>
    /// <typeparam name="E">The type of entity</typeparam>
    public interface IScalarRepository<K, E> : IDisposable
    {
        /// <summary>
        /// Create an entity in the repository.
        /// </summary>
        /// <param name="entity">The entity to create</param>
        /// <returns>A task of the created entity or <see cref="Option.None"/></returns>
        Task<Option<E>> Create(E entity, Action<E> onCreate, params object[] identifiers);

        /// <summary>
        /// Retrieves an entity with the key K
        /// </summary>
        /// <param name="key">The key K</param>
        /// <returns>An object of <see cref="S"/></returns>
        Task<Option<E>> Get(K key);

        /// <summary>
        /// Retrieves an entity by the given id
        /// </summary>
        /// <param name="id">The id of the entity</param>
        /// <returns>A task of an entity or <see cref="Option.None"/></returns>
        Task<Option<E>> GetByID(int id);

        /// <summary>
        /// Paging function, which skips a number of entities, then <br />
        /// takes a number of entities.
        /// </summary>
        /// <param name="skip">The number of entities to skip</param>
        /// <param name="take">The number of entities to retrieve</param>
        /// <returns>A list of entities</returns>
        Task<Pagination<E>> GetPage(int skip, int take, params object[] identifiers);

        /// <summary>
        /// Retrieves every entity in the repository
        /// </summary>
        /// <returns>A list of entities</returns>
        Task<List<E>> GetAll(params object[] identifiers);

        /// <summary>
        /// Update an entity T with the key K
        /// </summary>
        /// <param name="key">The key k</param>
        /// <param name="entity">The updated entity T</param>
        /// <returns>True if successful otherwise false</returns>
        Task<bool> Update(K key, E entity);

        /// <summary>
        /// Deletes an entity <see cref="E"/> with the key K
        /// </summary>
        /// <param name="key">The key K</param>
        /// <returns>True if successful otherwise false</returns>
        Task<bool> Delete(K key, Action<K> onDelete);
    }
}
