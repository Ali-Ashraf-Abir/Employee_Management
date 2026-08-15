import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";
import { leaveRequestApi } from "../../api/leaveRequestApi";
import type { LeaveRequest } from "../../types/leaveRequest";
import { ApiError } from "../../api/apiClient";

export default function AdminLeaveRequestDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [request, setRequest] =
        useState<LeaveRequest | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [processing, setProcessing] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (id) {
            loadRequest(id);
        }
    }, [id]);

    const loadRequest = async (
        requestId: string
    ) => {
        try {
            setLoading(true);
            setError("");

            const result =
                await leaveRequestApi.getByIdForAdmin(
                    requestId
                );

            setRequest(result);
        } catch (error) {
            if (
                error instanceof ApiError &&
                error.status === 404
            ) {
                setError(
                    "Leave request not found."
                );
            } else {
                setError(
                    "Unable to load leave request."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!id || !request) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to approve this leave request?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setProcessing(true);
            setError("");

            await leaveRequestApi.approve(id);

            setRequest(previous =>
                previous
                    ? {
                        ...previous,
                        status: "Approved"
                    }
                    : null
            );
        } catch {
            setError(
                "Unable to approve leave request."
            );
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!id || !request) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to reject this leave request?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setProcessing(true);
            setError("");

            await leaveRequestApi.reject(id);

            setRequest(previous =>
                previous
                    ? {
                        ...previous,
                        status: "Rejected"
                    }
                    : null
            );
        } catch {
            setError(
                "Unable to reject leave request."
            );
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                Loading request...
            </div>
        );
    }

    if (!request) {
        return (
            <div className="page">
                <div className="page-error">
                    {error ||
                        "Leave request not found."}
                </div>
            </div>
        );
    }

    const isPending =
        request.status === "Pending";

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <Link
                        to="/leave"
                        className="back-link"
                    >
                        ← Leave requests
                    </Link>

                    <h1>
                        Leave request
                    </h1>

                    <p>
                        Review the employee's
                        leave request.
                    </p>
                </div>

                {isPending && (
                    <div className="page-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            disabled={processing}
                            onClick={
                                handleReject
                            }
                        >
                            Reject
                        </button>

                        <button
                            type="button"
                            className="primary-button"
                            disabled={processing}
                            onClick={
                                handleApprove
                            }
                        >
                            {processing
                                ? "Processing..."
                                : "Approve"}
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="page-error">
                    {error}
                </div>
            )}

            <div className="content-card">
                <div className="request-status-header">
                    <div>
                        <span className="detail-label">
                            Leave type
                        </span>

                        <h2>
                            {
                                request.leaveTypeName
                            }
                        </h2>
                    </div>

                    <span
                        className={`status-badge ${request.status.toLowerCase()}`}
                    >
                        {request.status}
                    </span>
                </div>

                <div className="details-grid">
                    <Detail
                        label="Start date"
                        value={formatDate(
                            request.startDate
                        )}
                    />

                    <Detail
                        label="End date"
                        value={formatDate(
                            request.endDate
                        )}
                    />

                    <Detail
                        label="Duration"
                        value={`${request.days} ${request.days === 1
                                ? "day"
                                : "days"
                            }`}
                    />
                    <Detail
                        label="Reason"
                        value={request.reason ? request.reason : ''}
                    />
                    <Detail
                        label="Submitted"
                        value={formatDateTime(
                            request.createdAt
                        )}
                    />

                    {request.reviewedAt && (
                        <Detail
                            label="Reviewed"
                            value={formatDateTime(
                                request.reviewedAt
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function Detail({
    label,
    value
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="detail-item">
            <span className="detail-label">
                {label}
            </span>

            <strong>{value}</strong>
        </div>
    );
}

function formatDate(value: string) {
    return new Date(
        value
    ).toLocaleDateString();
}

function formatDateTime(value: string) {
    return new Date(
        value
    ).toLocaleString();
}