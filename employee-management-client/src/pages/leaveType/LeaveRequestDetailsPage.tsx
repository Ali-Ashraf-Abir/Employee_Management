import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";
import { leaveRequestApi } from "../../api/leaveRequestApi";
import type {
    LeaveRequest
} from "../../types/leaveRequest";
import { ApiError } from "../../api/apiClient";

export default function LeaveRequestDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [request, setRequest] =
        useState<LeaveRequest | null>(
            null
        );

    const [loading, setLoading] =
        useState(true);

    const [deleting, setDeleting] =
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

            const result =
                await leaveRequestApi.getById(
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

    const handleDelete = async () => {
        if (!id || !request) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this leave request?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await leaveRequestApi.delete(id);

            navigate("/leave");
        } catch {
            setError(
                "Unable to delete leave request."
            );
            setDeleting(false);
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

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <Link
                        to="/leave"
                        className="back-link"
                    >
                        ← My leave
                    </Link>

                    <h1>
                        Leave request
                    </h1>

                    <p>
                        View the details of your
                        leave request.
                    </p>
                </div>

                {request.status ===
                    "Pending" && (
                    <div className="page-actions">
                        <Link
                            to={`/leave/requests/${request.id}/edit`}
                            className="secondary-button"
                        >
                            Edit
                        </Link>

                        <button
                            type="button"
                            className="danger-button"
                            disabled={deleting}
                            onClick={
                                handleDelete
                            }
                        >
                            {deleting
                                ? "Deleting..."
                                : "Delete"}
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
                        value={`${request.days} ${
                            request.days === 1
                                ? "day"
                                : "days"
                        }`}
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

function formatDate(
    value: string
) {
    return new Date(
        value
    ).toLocaleDateString();
}

function formatDateTime(
    value: string
) {
    return new Date(
        value
    ).toLocaleString();
}