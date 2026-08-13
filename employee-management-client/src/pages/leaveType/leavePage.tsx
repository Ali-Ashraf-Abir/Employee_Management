import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { leaveRequestApi } from "../../api/leaveRequestApi";
import type {
    LeaveRequest,
    LeaveBalance
} from "../../types/leaveRequest";

export default function LeavePage() {
    const [requests, setRequests] =
        useState<LeaveRequest[]>([]);

    const [balances, setBalances] =
        useState<LeaveBalance[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [page, setPage] =
        useState(1);

    const pageSize = 10;

    const [totalCount, setTotalCount] =
        useState(0);

    useEffect(() => {
        loadData();
    }, [page]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [requestsResult, balancesResult] =
                await Promise.all([
                    leaveRequestApi.getMine({
                        page,
                        pageSize
                    }),
                    leaveRequestApi.getBalances()
                ]);

            setRequests(
                requestsResult.items
            );

            setTotalCount(
                requestsResult.totalCount
            );

            setBalances(balancesResult);
        } catch {
            setError(
                "Unable to load your leave information."
            );
        } finally {
            setLoading(false);
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
                    <h1>
                        My leave
                    </h1>

                    <p>
                        View your leave balance and
                        leave requests.
                    </p>
                </div>

                <Link
                    to="/leave/new"
                    className="primary-button"
                >
                    Request leave
                </Link>
            </div>

            {error && (
                <div className="page-error">
                    {error}
                </div>
            )}

            <section className="leave-balance-grid">
                {balances.map(balance => (
                    <div
                        className="leave-balance-card"
                        key={
                            balance.leaveTypeId
                        }
                    >
                        <div className="leave-balance-header">
                            <span>
                                {
                                    balance.leaveTypeName
                                }
                            </span>

                            <span className="balance-label">
                                {
                                    balance.annualLimit
                                }{" "}
                                days/year
                            </span>
                        </div>

                        <strong>
                            {
                                balance.remainingDays
                            }
                        </strong>

                        <span className="balance-remaining">
                            days remaining
                        </span>

                        <div className="balance-meta">
                            <span>
                                Used{" "}
                                {
                                    balance.consumedDays
                                }
                            </span>

                            <span>
                                Pending{" "}
                                {
                                    balance.pendingDays
                                }
                            </span>
                        </div>
                    </div>
                ))}
            </section>

            <section className="content-card">
                <div className="section-header">
                    <div>
                        <h2>
                            Leave requests
                        </h2>

                        <p>
                            Your recent leave
                            requests and their
                            current status.
                        </p>
                    </div>
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
                            You haven't submitted
                            a leave request yet.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
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
                                                    <Link
                                                        to={`/leave/requests/${request.id}`}
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

                        {totalPages > 1 && (
                            <Pagination
                                page={page}
                                totalPages={
                                    totalPages
                                }
                                onPageChange={
                                    setPage
                                }
                            />
                        )}
                    </>
                )}
            </section>
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

function Pagination({
    page,
    totalPages,
    onPageChange
}: {
    page: number;
    totalPages: number;
    onPageChange: (
        page: number
    ) => void;
}) {
    return (
        <div className="pagination">
            <button
                disabled={page === 1}
                onClick={() =>
                    onPageChange(page - 1)
                }
            >
                Previous
            </button>

            <span>
                Page {page} of{" "}
                {totalPages}
            </span>

            <button
                disabled={
                    page === totalPages
                }
                onClick={() =>
                    onPageChange(page + 1)
                }
            >
                Next
            </button>
        </div>
    );
}

function formatDate(
    value: string
) {
    return new Date(
        value
    ).toLocaleDateString();
}