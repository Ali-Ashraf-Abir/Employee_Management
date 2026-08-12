using AutoMapper;
using EmployeeManagement.Contracts;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Models.Interfaces;
using EmployeeManagement.Repositories;
using EmployeeManagement.Services.Interfaces;

namespace EmployeeManagement.Services;

public class LeaveTypeService : ILeaveTypeService
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;

    public LeaveTypeService(
        ApplicationDbContext db,
        IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<IEnumerable<LeaveTypeContract>> GetAllAsync()
    {
        using IRepositoryFactory factory = new RepositoryFactory(_db);
        var leaveTypeRepository = factory.CreateLeaveTypeRepository();
        var leaveTypes = await leaveTypeRepository.GetAllAsync();

        return leaveTypes.Select(leaveType =>
            LeaveTypeContract.ToContract(leaveType, _mapper));
    }

    public async Task<LeaveTypeContract?> GetByIdAsync(Guid id)
    {
        var leaveTypeRepository = new LeaveTypeRepository(_db);
        var leaveType = await leaveTypeRepository.GetByIdAsync(id);

        if (leaveType == null)
            return null;

        return LeaveTypeContract.ToContract(leaveType, _mapper);
    }

    public async Task<LeaveTypeContract> CreateAsync(LeaveTypeContract contract)
    {
        var leaveTypeRepository = new LeaveTypeRepository(_db);

        var exists = await leaveTypeRepository.ExistsByNameAsync(contract.Name);

        if (exists)
            throw new Exception(
                "A leave type with this name already exists.");

        var leaveType = contract.ToModel(_mapper);

        leaveType.Id = Guid.NewGuid();
        leaveType.IsActive = true;

        await leaveTypeRepository.AddAsync(leaveType);
        await leaveTypeRepository.SaveChangesAsync();

        return LeaveTypeContract.ToContract(leaveType, _mapper);
    }

    public async Task<LeaveTypeContract?> UpdateAsync(Guid id,LeaveTypeUpdateContract contract)
    {
        var leaveTypeRepository = new LeaveTypeRepository(_db);
        var leaveType =
            await leaveTypeRepository.GetByIdAsync(id);

        if (leaveType == null)
            return null;

        var duplicate =
            await leaveTypeRepository.ExistsByNameAsync(
                contract.Name);

        if (duplicate &&
            !string.Equals(
                leaveType.Name,
                contract.Name,
                StringComparison.OrdinalIgnoreCase))
        {
            throw new Exception(
                "A leave type with this name already exists.");
        }

        _mapper.Map(contract, leaveType);

        leaveTypeRepository.Update(leaveType);
        await leaveTypeRepository.SaveChangesAsync();

        return LeaveTypeContract.ToContract(
            leaveType,
            _mapper);
    }

    public async Task<bool> DisableAsync(Guid id)
    {
        var leaveTypeRepository = new LeaveTypeRepository(_db);
        var leaveType = await leaveTypeRepository.GetByIdAsync(id);

        if (leaveType == null)
            return false;

        leaveType.IsActive = false;

        leaveTypeRepository.Update(leaveType);
        await leaveTypeRepository.SaveChangesAsync();

        return true;
    }

    public async Task<bool> EnableAsync(Guid id)
    {
        var leaveTypeRepository = new LeaveTypeRepository(_db);
        var leaveType = await leaveTypeRepository.GetByIdAsync(id);

        if (leaveType == null)
            return false;

        leaveType.IsActive = true;

        leaveTypeRepository.Update(leaveType);
        await leaveTypeRepository.SaveChangesAsync();

        return true;
    }
}