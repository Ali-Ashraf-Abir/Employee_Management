using AutoMapper;
using EmployeeManagement.Contracts;
using EmployeeManagement.Models;

namespace EmployeeManagement.Core.Mapping
{
    public class LeaveMapper : Profile
    {
        public LeaveMapper()
        {
            CreateMap<LeaveTypeContract, LeaveType>()
                .ForMember(
                    x => x.Id,
                    opt => opt.Ignore())
                .ForMember(
                    x => x.IsActive,
                    opt => opt.Ignore())
                .ForMember(
                    x => x.LeaveRequests,
                    opt => opt.Ignore());

            CreateMap<LeaveTypeUpdateContract, LeaveType>()
                .ForMember(
                    x => x.Id,
                    opt => opt.Ignore())
                .ForMember(
                    x => x.IsActive,
                    opt => opt.Ignore())
                .ForMember(
                    x => x.LeaveRequests,
                    opt => opt.Ignore());

            CreateMap<LeaveType, LeaveTypeContract>();
        }
    }
}
