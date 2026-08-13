import apiClient from "./apiClient";
import type {
    LeaveType,
    LeaveTypeCreateRequest,
    LeaveTypeUpdateRequest
} from "../types/leaveType";

export const leaveTypeApi = {
    getAll() {
        return apiClient.get<LeaveType[]>(
            "/api/admin/leave-types"
        );
    },

    getById(id: string) {
        return apiClient.get<LeaveType>(
            `/api/admin/leave-types/${id}`
        );
    },

    create(data: LeaveTypeCreateRequest) {
        return apiClient.post<LeaveType>(
            "/api/admin/leave-types",
            data
        );
    },

    update(
        id: string,
        data: LeaveTypeUpdateRequest
    ) {
        return apiClient.put<LeaveType>(
            `/api/admin/leave-types/${id}`,
            data
        );
    },

    disable(id: string) {
        return apiClient.patch<void>(
            `/api/admin/leave-types/${id}/disable`
        );
    },

    enable(id: string) {
        return apiClient.patch<void>(
            `/api/admin/leave-types/${id}/enable`
        );
    }
};