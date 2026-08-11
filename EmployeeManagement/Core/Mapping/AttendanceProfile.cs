using AutoMapper;
using EmployeeManagement.Contracts;
using EmployeeManagement.Models;

namespace EmployeeManagement.Core.Mapping;

public class AttendanceProfile : Profile
{
    public AttendanceProfile()
    {
        CreateMap<AttendanceRecord, AttendanceResponse>()
            .ForMember(
                dest => dest.EmployeeCode,
                opt => opt.MapFrom(src => src.Employee.EmployeeId))
            .ForMember(
                dest => dest.EmployeeName,
                opt => opt.MapFrom(src => src.Employee.FirstName + " " + src.Employee.LastName));

        CreateMap<AttendanceDailyData, AttendanceDailyResponse>();
    }
}