import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminAttendanceApi } from "../../api/attendanceApi";
import type {
    AttendanceDailyResponse,
    PagedResult
} from "../../types/attendance";

export default function AttendanceReportPage() {
    const [result, setResult] =
        useState<PagedResult<AttendanceDailyResponse> | null>(
            null
        );

    const [from, setFrom] =
        useState("");

    const [to, setTo] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const pageSize = 15;

    useEffect(() => {
        loadReport();
    }, [page]);

    const loadReport = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await adminAttendanceApi.report({
                    page,
                    pageSize,
                    from: from || undefined,
                    to: to || undefined
                });

            setResult(data);
        } catch {
            setError(
                "Unable to load attendance report."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setPage(1);
        loadReport();
    };

    const totalPages = result
        ? Math.ceil(
              result.totalCount /
                  result.pageSize
          )
        : 0;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <Link
                        to="/admin/attendance"
                        className="back-link"
                    >
                        ← Attendance
                    </Link>

                    <h1>
                        Daily attendance report
                    </h1>

                    <p>
                        Review employee attendance
                        by day.
                    </p>
                </div>
            </div>

            {error && (
                <div className="page-error">
                    {error}
                </div>
            )}

            <div className="content-card">
                <form
                    className="attendance-toolbar"
                    onSubmit={handleSubmit}
                >
                    <div className="date-filter">
                        <label>
                            From
                        </label>

                        <input
                            type="date"
                            value={from}
                            onChange={event =>
                                setFrom(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <div className="date-filter">
                        <label>
                            To
                        </label>

                        <input
                            type="date"
                            value={to}
                            onChange={event =>
                                setTo(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-button"
                    >
                        Generate report
                    </button>
                </form>

                {loading ? (
                    <div className="loading-state">
                        Loading report...
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
                                            Date
                                        </th>
                                        <th>
                                            First entry
                                        </th>
                                        <th>
                                            Last exit
                                        </th>
                                        <th>
                                            Hours
                                        </th>
                                        <th>
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {result?.items.length ? (
                                        result.items.map(
                                            record => (
                                                <tr
                                                    key={`${record.employeeId}-${record.date}`}
                                                >
                                                    <td>
                                                        <strong>
                                                            {
                                                                record.employeeName
                                                            }
                                                        </strong>

                                                        <div className="table-secondary">
                                                            {
                                                                record.employeeCode
                                                            }
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            record.date
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatTime(
                                                            record.firstEntry
                                                        )}
                                                    </td>

                                                    <td>
                                                        {record.lastExit
                                                            ? formatTime(
                                                                  record.lastExit
                                                              )
                                                            : "—"}
                                                    </td>

                                                    <td>
                                                        {formatMinutes(
                                                            record.totalMinutes
                                                        )}
                                                    </td>

                                                    <td>
                                                        {record.isCurrentlyInside ? (
                                                            <span className="status-badge active">
                                                                Inside
                                                            </span>
                                                        ) : (
                                                            <span className="status-badge">
                                                                Completed
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                            >
                                                <div className="empty-state">
                                                    <h3>
                                                        No report data
                                                    </h3>

                                                    <p>
                                                        No attendance
                                                        records match
                                                        the selected
                                                        dates.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="pagination">
                            <span>
                                {result?.totalCount ?? 0}{" "}
                                employees
                            </span>

                            <div className="pagination-controls">
                                <button
                                    className="pagination-button"
                                    disabled={
                                        page <= 1
                                    }
                                    onClick={() =>
                                        setPage(
                                            current =>
                                                current -
                                                1
                                        )
                                    }
                                >
                                    Previous
                                </button>

                                <span>
                                    {page} /{" "}
                                    {totalPages ||
                                        1}
                                </span>

                                <button
                                    className="pagination-button"
                                    disabled={
                                        page >=
                                        totalPages
                                    }
                                    onClick={() =>
                                        setPage(
                                            current =>
                                                current +
                                                1
                                        )
                                    }
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

function formatMinutes(minutes: number) {
    const hours = Math.floor(
        minutes / 60
    );

    const remaining = minutes % 60;

    if (hours === 0) {
        return `${remaining}m`;
    }

    return `${hours}h ${remaining}m`;
}