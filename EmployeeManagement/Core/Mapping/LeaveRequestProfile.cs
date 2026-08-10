using AutoMapper;
using EmployeeManagement.Contracts;
using EmployeeManagement.Models;

namespace EmployeeManagement.Core.Mapping;

public class LeaveRequestProfile : Profile
{
    public LeaveRequestProfile()
    {
        CreateMap<LeaveRequestContract, LeaveRequest>()
            .ForMember(
                x => x.Id,
                opt => opt.Ignore())
            .ForMember(
                x => x.EmployeeId,
                opt => opt.Ignore())
            .ForMember(
                x => x.Days,
                opt => opt.Ignore())
            .ForMember(
                x => x.Status,
                opt => opt.Ignore())
            .ForMember(
                x => x.CreatedAt,
                opt => opt.Ignore())
            .ForMember(
                x => x.ReviewedAt,
                opt => opt.Ignore())
            .ForMember(
                x => x.ReviewedBy,
                opt => opt.Ignore())
            .ForMember(
                x => x.Employee,
                opt => opt.Ignore())
            .ForMember(
                x => x.LeaveType,
                opt => opt.Ignore());

        CreateMap<LeaveRequest, LeaveRequestResponse>()
            .ForMember(
                x => x.LeaveTypeName,
                opt => opt.MapFrom(
                    x => x.LeaveType.Name));
    }
}