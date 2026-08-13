import apiClient from "./apiClient";
import type {
    AttendanceQuery,
    AttendanceResponse,
    AttendanceDailyResponse,
    PagedResult
} from "../types/attendance";

function buildQuery(query: AttendanceQuery) {
    const params = new URLSearchParams();

    if (query.page !== undefined) {
        params.set("page", query.page.toString());
    }

    if (query.pageSize !== undefined) {
        params.set(
            "pageSize",
            query.pageSize.toString()
        );
    }

    if (query.search) {
        params.set("search", query.search);
    }

    if (query.from) {
        params.set("from", query.from);
    }

    if (query.to) {
        params.set("to", query.to);
    }

    const queryString = params.toString();

    return queryString
        ? `?${queryString}`
        : "";
}

export const employeeAttendanceApi = {
    enter() {
        return apiClient.post<AttendanceResponse>(
            "/api/employee/attendance/enter"
        );
    },

    leave() {
        return apiClient.post<AttendanceResponse>(
            "/api/employee/attendance/leave"
        );
    },

    history(query: AttendanceQuery = {}) {
        return apiClient.get<
            PagedResult<AttendanceResponse>
        >(
            `/api/employee/attendance/history${buildQuery(query)}`
        );
    }
};

export const adminAttendanceApi = {
    history(query: AttendanceQuery = {}) {
        return apiClient.get<
            PagedResult<AttendanceResponse>
        >(
            `/api/admin/attendance/history${buildQuery(query)}`
        );
    },

    report(query: AttendanceQuery = {}) {
        return apiClient.get<
            PagedResult<AttendanceDailyResponse>
        >(
            `/api/admin/attendance/report${buildQuery(query)}`
        );
    }
};