export interface Employee {
    id: string;
    employeeId: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    joinedAt: string;
    roles: string[];
    position:string;
    department:string;
    isDisabled:boolean;
}

export interface EmployeeCreateRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    department: string;
    position: string;
}

export interface EmployeeUpdateRequest {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    position: string;
}

export interface UpdateRolesRequest {
    roles: string[];
}

export interface PaginationQuery {
    search?: string;
    page: number;
    pageSize: number;
}

export interface PagedResult<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
}