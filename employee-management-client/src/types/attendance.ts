export interface AttendanceResponse {
    id: string;
    employeeId: string;
    employeeCode: string;
    employeeName: string;
    enteredAt: string;
    leftAt: string | null;
}

export interface AttendanceDailyResponse {
    employeeId: string;
    employeeCode: string;
    employeeName: string;
    date: string;
    firstEntry: string;
    lastExit: string | null;
    totalMinutes: number;
    isCurrentlyInside: boolean;
}

export interface AttendanceQuery {
    page?: number;
    pageSize?: number;
    search?: string;
    from?: string;
    to?: string;
}

export interface PagedResult<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
}