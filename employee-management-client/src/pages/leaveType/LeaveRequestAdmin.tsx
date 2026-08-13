import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { leaveRequestApi } from "../../api/leaveRequestApi";
import type {
    LeaveRequest
} from "../../types/leaveRequest";
import { ApiError } from "../../api/apiClient";

export default function LeaveRequestsAdminPage() {
    const [requests, setRequests] =
        useState<LeaveRequest[]>([]);

    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(1);

    const pageSize = 10;

    const [totalCount, setTotalCount] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState<string | null>(null);

    const [error, setError] =
        useState("");

    useEffect(() => {
        loadRequests();
    }, [page, search]);

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const result =
                await leaveRequestApi.getAll({
                    page,
                    pageSize,
                    search
                });

            setRequests(result.items);
            setTotalCount(
                result.totalCount
            );
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("Unable to submit leave request.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async (
        request: LeaveRequest,
        approve: boolean
    ) => {
        const message = approve
            ? "Approve this leave request?"
            : "Reject this leave request?";

        if (!window.confirm(message)) {
            return;
        }

        try {
            setActionLoading(request.id);
            setError("");

            if (approve) {
                await leaveRequestApi.approve(
                    request.id
                );
            } else {
                await leaveRequestApi.reject(
                    request.id
                );
            }

            setRequests(current =>
                current.map(item =>
                    item.id === request.id
                        ? {
                            ...item,
                            status: approve
                                ? "Approved"
                                : "Rejected"
                        }
                        : item
                )
            );
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("Unable to submit leave request.");
            }
        } finally {
            setActionLoading(null);
        }
    };

    const totalPages =
        Math.ceil(
            totalCount / pageSize
        );

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <Link
                        to="/leave"
                        className="back-link"
                    >
                        ← Leave
                    </Link>

                    <h1>
                        Leave requests
                    </h1>

                    <p>
                        Review and manage employee
                        leave requests.
                    </p>
                </div>
            </div>

            {error && (
                <div className="page-error">
                    {error}
                </div>
            )}

            <div className="content-card">
                <div className="table-toolbar">
                    <input
                        className="search-input"
                        type="search"
                        placeholder="Search employees..."
                        value={search}
                        onChange={event => {
                            setSearch(
                                event.target.value
                            );
                            setPage(1);
                        }}
                    />

                    <span className="toolbar-count">
                        {totalCount} requests
                    </span>
                </div>

                {loading ? (
                    <div className="loading-state">
                        Loading requests...
                    </div>
                ) : requests.length === 0 ? (
                    <div className="empty-state">
                        <h3>
                            No leave requests
                        </h3>

                        <p>
                            There are currently
                            no requests matching
                            your search.
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
                                            Leave type
                                        </th>
                                        <th>
                                            Reason
                                        </th>
                                        <th>
                                            Dates
                                        </th>

                                        <th>
                                            Days
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {requests.map(
                                        request => (
                                            <tr
                                                key={
                                                    request.id
                                                }
                                            >
                                                <td>

                                                    {
                                                        request.employeeName
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        request.leaveTypeName
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        request.reason
                                                    }
                                                </td>
                                                <td>
                                                    {formatDate(
                                                        request.startDate
                                                    )}{" "}
                                                    –
                                                    {" "}
                                                    {formatDate(
                                                        request.endDate
                                                    )}
                                                </td>

                                                <td>
                                                    {
                                                        request.days
                                                    }
                                                </td>

                                                <td>
                                                    <StatusBadge
                                                        status={
                                                            request.status
                                                        }
                                                    />
                                                </td>

                                                <td>
                                                    {request.status ===
                                                        "Pending" ? (
                                                        <div className="table-actions">
                                                            <button
                                                                type="button"
                                                                className="table-action approve"
                                                                disabled={
                                                                    actionLoading ===
                                                                    request.id
                                                                }
                                                                onClick={() =>
                                                                    handleDecision(
                                                                        request,
                                                                        true
                                                                    )
                                                                }
                                                            >
                                                                {actionLoading ===
                                                                    request.id
                                                                    ? "Updating..."
                                                                    : "Approve"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="table-action danger"
                                                                disabled={
                                                                    actionLoading ===
                                                                    request.id
                                                                }
                                                                onClick={() =>
                                                                    handleDecision(
                                                                        request,
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="muted">
                                                            Reviewed
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    disabled={
                                        page ===
                                        1
                                    }
                                    onClick={() =>
                                        setPage(
                                            page -
                                            1
                                        )
                                    }
                                >
                                    Previous
                                </button>

                                <span>
                                    Page{" "}
                                    {page} of{" "}
                                    {
                                        totalPages
                                    }
                                </span>

                                <button
                                    disabled={
                                        page ===
                                        totalPages
                                    }
                                    onClick={() =>
                                        setPage(
                                            page +
                                            1
                                        )
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function StatusBadge({
    status
}: {
    status: string;
}) {
    return (
        <span
            className={`status-badge ${status.toLowerCase()}`}
        >
            {status}
        </span>
    );
}

function formatDate(
    value: string
) {
    return new Date(
        value
    ).toLocaleDateString();
}