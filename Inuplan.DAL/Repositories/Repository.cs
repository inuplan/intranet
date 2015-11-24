//-----------------------------------------------------------------------
// <copyright file="Repository.cs" company="Inuplan">
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

namespace Inuplan.DAL.Repositories
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Inuplan.Common.Models;
    using Inuplan.Common.Repositories;
    using Optional;

    /// <summary>
    /// A generic repository with T entities that have a key K.
    /// </summary>
    public class Repository<K, T> : IRepository<K, T> where T : class
    {
        /// <summary>
        /// Determines if this instance has been disposed
        /// </summary>
        private bool disposed;
                
        /// <summary>
        /// Initializes a new instance of the <see cref="Repository"/> class.
        /// </summary>
        public Repository()
        {
        }

        /// <summary>
        /// Creates a post entity in the repository
        /// </summary>
        /// <param name="entity">The post entity</param>
        /// <returns>>A task of the created entity or <see cref="Option.None"/></returns>
        public async Task<Option<T>> Create(T entity)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Retrieves an entity with the given key
        /// </summary>
        /// <param name="key">The key</param>
        /// <returns>An entity or <see cref="Option.None"/></returns>
        public async Task<Option<T>> Get(K key)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Paging function, which skips a number of entities, then <br />
        /// takes a number of entities.
        /// </summary>
        /// <param name="skip">The number of entities to skip</param>
        /// <param name="take">The number of entities to retrieve</param>
        /// <returns>A list of entities</returns>
        public async Task<List<T>> Get(int skip, int take)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Retrieves a list of T's defined by the predicate.
        /// </summary>
        /// <param name="predicate">The SQL predicate containing the WHERE clause</param>
        /// <returns>A list of T's</returns>
        public async Task<List<T>> Get(string predicate)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Retrieves every entity in the repository
        /// </summary>
        /// <returns>A list of entities</returns>
        public async Task<List<T>> GetAll()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Update an entity with the given key
        /// </summary>
        /// <param name="key">The key</param>
        /// <param name="entity">The updated entity</param>
        /// <returns>True if successful otherwise false</returns>
        public async Task<bool> Update(K key, T entity)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Deletes an entity with the given key
        /// </summary>
        /// <param name="key">The key</param>
        /// <returns>True if successful otherwise false</returns>
        public async Task<bool> Delete(K key)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Deletes an entity
        /// </summary>
        /// <param name="entity">The entity</param>
        /// <returns>True if successful otherwise false</returns>
        public async Task<bool> Delete(T entity)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Disposes managed resources
        /// </summary>
        public void Dispose()
        {
            this.Dispose(true);
        }

        /// <summary>
        /// Disposes managed resources, using the dispose pattern
        /// </summary>
        /// <param name="disposing">True if disposing</param>
        protected virtual void Dispose(bool disposing)
        {
            if (this.disposed)
            {
                return;
            }

            if (disposing)
            {
                // Dispose resources here...
            }

            this.disposed = true;
        }
    }
}
