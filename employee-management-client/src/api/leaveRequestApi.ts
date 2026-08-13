import apiClient from "./apiClient";
import type {
    LeaveRequest,
    LeaveRequestCreateRequest,
    LeaveBalance,
    PagedResult,
    PaginationQuery
} from "../types/leaveRequest";

export const leaveRequestApi = {
    getMine(query?: PaginationQuery) {
        const params = new URLSearchParams();

        if (query?.page)
            params.set("page", query.page.toString());

        if (query?.pageSize)
            params.set(
                "pageSize",
                query.pageSize.toString()
            );

        if (query?.search)
            params.set("search", query.search);

        const queryString =
            params.toString();

        return apiClient.get<
            PagedResult<LeaveRequest>
        >(
            `/api/employee/leaves${
                queryString
                    ? `?${queryString}`
                    : ""
            }`
        );
    },

    getById(id: string) {
        return apiClient.get<LeaveRequest>(
            `/api/employee/leaves/${id}`
        );
    },

    getBalances(year?: number) {
        const query =
            year !== undefined
                ? `?year=${year}`
                : "";

        return apiClient.get<LeaveBalance[]>(
            `/api/employee/leaves/my-balances${query}`
        );
    },

    create(
        data: LeaveRequestCreateRequest
    ) {
        return apiClient.post<LeaveRequest>(
            "/api/employee/leaves",
            data
        );
    },

    update(
        id: string,
        data: LeaveRequestCreateRequest
    ) {
        return apiClient.put<LeaveRequest>(
            `/api/employee/leaves/${id}`,
            data
        );
    },

    delete(id: string) {
        return apiClient.delete<void>(
            `/api/employee/leaves/${id}`
        );
    },

    getAll(query?: PaginationQuery) {
        const params = new URLSearchParams();

        if (query?.page)
            params.set("page", query.page.toString());

        if (query?.pageSize)
            params.set(
                "pageSize",
                query.pageSize.toString()
            );

        if (query?.search)
            params.set("search", query.search);

        const queryString =
            params.toString();

        return apiClient.get<
            PagedResult<LeaveRequest>
        >(
            `/api/employee/leaves/all${
                queryString
                    ? `?${queryString}`
                    : ""
            }`
        );
    },

    approve(id: string) {
        return apiClient.put<void>(
            `/api/employee/leaves/${id}/approve`
        );
    },

    reject(id: string) {
        return apiClient.put<void>(
            `/api/employee/leaves/${id}/reject`
        );
    }
};