export type LeaveStatus =
    | "Pending"
    | "Approved"
    | "Rejected";

export interface LeaveRequest {
    id: string;
    leaveTypeId: string;
    leaveTypeName: string;
    startDate: string;
    employeeCode:string;
    employeeName:string;
    employeEmail:string;
    endDate: string;
    days: number;
    status: LeaveStatus;
    createdAt: string;
    reviewedAt?: string | null;
    reason:string | undefined;
    reviewedBy?: string | null;
}

export interface LeaveRequestCreateRequest {
    leaveTypeId: string;
    startDate: string;
    reason:string | undefined;
    endDate: string;
}

export interface LeaveBalance {
    leaveTypeId: string;
    leaveTypeName: string;
    annualLimit: number;
    consumedDays: number;
    pendingDays: number;
    remainingDays: number;
}

export interface PaginationQuery {
    page?: number;
    pageSize?: number;
    search?: string;
}

export interface PagedResult<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
}