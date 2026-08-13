export interface LeaveType {
    id: string;
    name: string;
    annualLimit: number;
    isActive: boolean;
}

export interface LeaveTypeCreateRequest {
    name: string;
    annualLimit: number;
}

export interface LeaveTypeUpdateRequest {
    name: string;
    annualLimit: number;
}