import {
    useCallback,
    useEffect,
    useState
} from "react";
import {
    Link,
    useSearchParams
} from "react-router-dom";

import { employeeApi } from "../../api/employeeApi";
import {
    ApiError
} from "../../api/apiClient";
import type {
    Employee
} from "../../types/employee";

const PAGE_SIZE = 10;

export default function EmployeeListPage() {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const [employees, setEmployees] =
        useState<Employee[]>([]);

    const [totalCount, setTotalCount] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const search =
        searchParams.get("search") ?? "";

    const page = Math.max(
        Number(searchParams.get("page") ?? "1"),
        1
    );

    const [searchInput, setSearchInput] =
        useState(search);

    const loadEmployees = useCallback(
        async () => {
            try {
                setLoading(true);
                setError("");

                const result =
                    await employeeApi.getAll(
                        search,
                        page,
                        PAGE_SIZE
                    );

                setEmployees(result.items);
                setTotalCount(
                    result.totalCount
                );
            } catch (error) {
                if (
                    error instanceof ApiError &&
                    error.status === 403
                ) {
                    setError(
                        "You do not have permission to view employees."
                    );
                } else {
                    setError(
                        "Unable to load employees."
                    );
                }
            } finally {
                setLoading(false);
            }
        },
        [search, page]
    );

    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    const handleSearch = (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        const params = new URLSearchParams();

        if (searchInput.trim()) {
            params.set(
                "search",
                searchInput.trim()
            );
        }

        params.set("page", "1");

        setSearchParams(params);
    };

    const totalPages = Math.ceil(
        totalCount / PAGE_SIZE
    );

    const changePage = (nextPage: number) => {
        const params = new URLSearchParams(
            searchParams
        );

        params.set(
            "page",
            nextPage.toString()
        );

        setSearchParams(params);
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Employees</h1>

                    <p>
                        Manage employees,
                        accounts and roles.
                    </p>
                </div>

                <Link
                    to="/employees/new"
                    className="primary-button"
                >
                    Add employee
                </Link>
            </div>

            <div className="content-card">
                <form
                    className="toolbar"
                    onSubmit={handleSearch}
                >
                    <input
                        className="search-input"
                        value={searchInput}
                        onChange={event =>
                            setSearchInput(
                                event.target.value
                            )
                        }
                        placeholder="Search employees..."
                    />

                    <button
                        type="submit"
                        className="secondary-button"
                    >
                        Search
                    </button>
                </form>

                {error && (
                    <div className="page-error">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="loading-state">
                        Loading employees...
                    </div>
                ) : employees.length === 0 ? (
                    <div className="empty-state">
                        <h3>
                            No employees found
                        </h3>

                        <p>
                            Try changing your
                            search criteria.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Employee
                                        </th>

                                        <th>
                                            Employee ID
                                        </th>

                                        <th>
                                            Email
                                        </th>
                                        <th>
                                            Department
                                        </th>
                                        <th>
                                            Position
                                        </th>
                                        <th>
                                            Roles
                                        </th>

                                        <th>
                                            Joined
                                        </th>

                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {employees.map(
                                        employee => (
                                            <tr
                                                key={
                                                    employee.id
                                                }
                                            >
                                                <td>
                                                    <Link
                                                        to={`/employees/${employee.id}`}
                                                        className="employee-name"
                                                    >
                                                        {
                                                            employee.firstName
                                                        }{" "}
                                                        {
                                                            employee.lastName
                                                        }
                                                    </Link>
                                                </td>

                                                <td>
                                                    {
                                                        employee.employeeId
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        employee.email
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        employee.department
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        employee.position
                                                    }
                                                </td>
                                                <td>
                                                    <div className="role-list">
                                                        {employee.roles.map(
                                                            role => (
                                                                <span
                                                                    key={
                                                                        role
                                                                    }
                                                                    className="role-badge"
                                                                >
                                                                    {
                                                                        role
                                                                    }
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </td>

                                                <td>
                                                    {new Date(
                                                        employee.joinedAt
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td>
                                                    <Link
                                                        to={`/employees/${employee.id}`}
                                                        className="table-action"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="pagination">
                            <span>
                                {totalCount} employee
                                {totalCount === 1
                                    ? ""
                                    : "s"}
                            </span>

                            <div className="pagination-controls">
                                <button
                                    type="button"
                                    disabled={
                                        page <= 1
                                    }
                                    onClick={() =>
                                        changePage(
                                            page - 1
                                        )
                                    }
                                    className="pagination-button"
                                >
                                    Previous
                                </button>

                                <span>
                                    Page {page} of{" "}
                                    {Math.max(
                                        totalPages,
                                        1
                                    )}
                                </span>

                                <button
                                    type="button"
                                    disabled={
                                        page >=
                                        totalPages
                                    }
                                    onClick={() =>
                                        changePage(
                                            page + 1
                                        )
                                    }
                                    className="pagination-button"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}