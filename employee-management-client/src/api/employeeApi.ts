import apiClient from "./apiClient";
import type {
    Employee,
    EmployeeCreateRequest,
    EmployeeUpdateRequest,
    PagedResult,
    UpdateRolesRequest
} from "../types/employee";

export const employeeApi = {
    getAll(
        search: string,
        page: number,
        pageSize: number
    ) {
        const params = new URLSearchParams();

        params.set("page", page.toString());
        params.set("pageSize", pageSize.toString());

        if (search.trim()) {
            params.set("search", search.trim());
        }

        return apiClient.get<PagedResult<Employee>>(
            `/api/admin/employees?${params.toString()}`
        );
    },

    getById(id: string) {
        return apiClient.get<Employee>(
            `/api/admin/employees/${id}`
        );
    },

    create(
        data: EmployeeCreateRequest
    ) {
        return apiClient.post<Employee>(
            "/api/admin/employees",
            data
        );
    },

    update(
        id: string,
        data: EmployeeUpdateRequest
    ) {
        return apiClient.put<Employee>(
            `/api/admin/employees/${id}`,
            data
        );
    },

    disable(id: string) {
        return apiClient.patch<void>(
            `/api/admin/employees/${id}/disable`
        );
    },

    enable(id: string) {
        return apiClient.patch<void>(
            `/api/admin/employees/${id}/enable`
        );
    },

    updateRoles(
        id: string,
        roles: string[]
    ) {
        return apiClient.put<void>(
            `/api/admin/employees/${id}/roles`,
            {
                roles
            } satisfies UpdateRolesRequest
        );
    }
};