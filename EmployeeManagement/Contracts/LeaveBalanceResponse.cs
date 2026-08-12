namespace EmployeeManagement.Contracts
{
    public class LeaveBalanceResponse
    {
        public Guid LeaveTypeId { get; set; }
        public string LeaveTypeName { get; set; } = string.Empty;

        public int AnnualLimit { get; set; }
        public int ConsumedDays { get; set; }
        public int PendingDays { get; set; }
        public int RemainingDays { get; set; }
    }
}
