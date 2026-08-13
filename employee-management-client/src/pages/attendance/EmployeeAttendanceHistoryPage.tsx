import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { employeeAttendanceApi } from "../../api/attendanceApi";
import type {
    AttendanceResponse,
    PagedResult
} from "../../types/attendance";

export default function EmployeeAttendanceHistoryPage() {
    const [result, setResult] =
        useState<PagedResult<AttendanceResponse> | null>(
            null
        );

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        loadHistory();
    }, [page]);

    const loadHistory = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await employeeAttendanceApi.history({
                    page,
                    pageSize
                });

            setResult(data);
        } catch {
            setError(
                "Unable to load attendance history."
            );
        } finally {
            setLoading(false);
        }
    };

    const totalPages = result
        ? Math.ceil(
              result.totalCount / result.pageSize
          )
        : 0;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <Link
                        to="/attendance"
                        className="back-link"
                    >
                        ← Attendance
                    </Link>

                    <h1>
                        Attendance history
                    </h1>

                    <p>
                        Review your previous
                        attendance records.
                    </p>
                </div>
            </div>

            {error && (
                <div className="page-error">
                    {error}
                </div>
            )}

            <div className="content-card">
                {loading ? (
                    <div className="loading-state">
                        Loading history...
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Check in</th>
                                        <th>Check out</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {result?.items.length ? (
                                        result.items.map(
                                            record => (
                                                <tr
                                                    key={
                                                        record.id
                                                    }
                                                >
                                                    <td>
                                                        {formatDate(
                                                            record.enteredAt
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatTime(
                                                            record.enteredAt
                                                        )}
                                                    </td>

                                                    <td>
                                                        {record.leftAt
                                                            ? formatTime(
                                                                  record.leftAt
                                                              )
                                                            : (
                                                                <span className="status-badge active">
                                                                    Currently inside
                                                                </span>
                                                            )}
                                                    </td>

                                                    <td>
                                                        {getDuration(
                                                            record.enteredAt,
                                                            record.leftAt
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                            >
                                                <div className="empty-state">
                                                    <h3>
                                                        No attendance records
                                                    </h3>

                                                    <p>
                                                        Your attendance
                                                        history will
                                                        appear here.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPrevious={() =>
                                setPage(
                                    current =>
                                        current - 1
                                )
                            }
                            onNext={() =>
                                setPage(
                                    current =>
                                        current + 1
                                )
                            }
                        />
                    </>
                )}
            </div>
        </div>
    );
}

function Pagination({
    page,
    totalPages,
    onPrevious,
    onNext
}: {
    page: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
}) {
    return (
        <div className="pagination">
            <span>
                Page {page} of {totalPages || 1}
            </span>

            <div className="pagination-controls">
                <button
                    className="pagination-button"
                    disabled={page <= 1}
                    onClick={onPrevious}
                >
                    Previous
                </button>

                <button
                    className="pagination-button"
                    disabled={
                        page >= totalPages
                    }
                    onClick={onNext}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString(
        "en-BD",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}

function formatTime(value: string) {
    return new Date(value).toLocaleTimeString(
        "en-BD",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}

function getDuration(
    enteredAt: string,
    leftAt: string | null
) {
    if (!leftAt) {
        return "—";
    }

    const minutes = Math.floor(
        (new Date(leftAt).getTime() -
            new Date(enteredAt).getTime()) /
            60000
    );

    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (hours === 0) {
        return `${remaining}m`;
    }

    return `${hours}h ${remaining}m`;
}