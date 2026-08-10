using System.Linq.Expressions;

namespace EmployeeManagement.Core.Repositories.Interfaces;

public interface IBaseRepository<TEntity>
    where TEntity : class
{
    Task<TEntity?> GetByIdAsync(Guid id);

    Task<List<TEntity>> GetAllAsync();

    Task<List<TEntity>> FindAsync(
        Expression<Func<TEntity, bool>> predicate);

    Task<TEntity?> FirstOrDefaultAsync(
        Expression<Func<TEntity, bool>> predicate);

    Task<bool> ExistsAsync(
        Expression<Func<TEntity, bool>> predicate);

    Task<int> CountAsync(
        Expression<Func<TEntity, bool>>? predicate = null);

    Task AddAsync(TEntity entity);

    Task AddRangeAsync(IEnumerable<TEntity> entities);

    Task SaveChangesAsync();
    void Update(TEntity entity);

    void UpdateRange(IEnumerable<TEntity> entities);

    void Delete(TEntity entity);

    void DeleteRange(IEnumerable<TEntity> entities);
}