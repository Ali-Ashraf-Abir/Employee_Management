using AutoMapper;
using EmployeeManagement.Contracts;
using EmployeeManagement.Models;

namespace EmployeeManagement.Core.Mapping;

public class EmployeeProfile : Profile
{
    public EmployeeProfile()
    {
        CreateMap<EmployeeContract, Employee>()
            .ForMember(
                x => x.Id,
                opt => opt.Ignore())
            .ForMember(
                x => x.UserId,
                opt => opt.Ignore())
            .ForMember(
                x => x.JoinedAt,
                opt => opt.Ignore())
            .ForMember(
                x => x.User,
                opt => opt.Ignore());
        CreateMap<EmployeeUpdateContract, Employee>()
            .ForMember(
                x => x.Id,
                opt => opt.Ignore())
            .ForMember(
                x => x.UserId,
                opt => opt.Ignore())
            .ForMember(
                x => x.JoinedAt,
                opt => opt.Ignore())
            .ForMember(
                x => x.User,
                opt => opt.Ignore());
        CreateMap<Employee, EmployeeContract>()
            .ForMember(
                x => x.Password,
                opt => opt.Ignore())
            .ForMember(
                x => x.Email,
                opt => opt.MapFrom(x => x.User.Email));
    }
}