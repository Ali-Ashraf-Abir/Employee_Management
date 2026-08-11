using EmployeeManagement.Core.Repositories.Interfaces;
using EmployeeManagement.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace EmployeeManagement.Core.Repositories;

public class BaseRepository<TEntity> : IBaseRepository<TEntity>
    where TEntity : class
{
    protected readonly ApplicationDbContext _db;
    protected readonly DbSet<TEntity> _collection;

    public BaseRepository(ApplicationDbContext db)
    {
        _db = db;
        _collection = db.Set<TEntity>();
    }

    public async Task<TEntity?> GetByIdAsync(Guid id)
    {
        return await _collection.FindAsync(id);
    }

    public async Task<List<TEntity>> GetAllAsync()
    {
        return await _collection
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<TEntity>> FindAsync(
        Expression<Func<TEntity, bool>> predicate)
    {
        return await _collection
            .AsNoTracking()
            .Where(predicate)
            .ToListAsync();
    }

    public async Task<TEntity?> FirstOrDefaultAsync(
        Expression<Func<TEntity, bool>> predicate)
    {
        return await _collection
            .AsNoTracking()
            .FirstOrDefaultAsync(predicate);
    }

    public async Task<bool> ExistsAsync(
        Expression<Func<TEntity, bool>> predicate)
    {
        return await _collection
            .AnyAsync(predicate);
    }

    public async Task<int> CountAsync(
        Expression<Func<TEntity, bool>>? predicate = null)
    {
        if (predicate == null)
            return await _collection.CountAsync();

        return await _collection.CountAsync(predicate);
    }

    public async Task AddAsync(TEntity entity)
    {
        await _collection.AddAsync(entity);
    }

    public async Task AddRangeAsync(
        IEnumerable<TEntity> entities)
    {
        await _collection.AddRangeAsync(entities);
    }

    public void Update(TEntity entity)
    {
        _collection.Update(entity);
    }

    public void UpdateRange(
        IEnumerable<TEntity> entities)
    {
        _collection.UpdateRange(entities);
    }

    public void Delete(TEntity entity)
    {
        _collection.Remove(entity);
    }

    public void DeleteRange(
        IEnumerable<TEntity> entities)
    {
        _collection.RemoveRange(entities);
    }
    public IQueryable<TEntity> Query()
    {
        return _collection;
    }
    public async Task<PagedData<TEntity>> PaginateAsync(IQueryable<TEntity> query, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedData<TEntity>
        {
            Items = items,
            TotalCount = totalCount
        };
    }
    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }
}