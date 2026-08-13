import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminAttendanceApi } from "../../api/attendanceApi";
import type {
    AttendanceResponse,
    PagedResult
} from "../../types/attendance";

export default function AdminAttendancePage() {
    const [result, setResult] =
        useState<PagedResult<AttendanceResponse> | null>(
            null
        );

    const [search, setSearch] =
        useState("");

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
        loadAttendance();
    }, [page]);

    const loadAttendance = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await adminAttendanceApi.history({
                    page,
                    pageSize,
                    search: search || undefined,
                    from: from || undefined,
                    to: to || undefined
                });

            setResult(data);
        } catch {
            setError(
                "Unable to load attendance records."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setPage(1);
        loadAttendance();
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
                    <h1>
                        Attendance
                    </h1>

                    <p>
                        View and manage employee
                        attendance records.
                    </p>
                </div>

                <Link
                    to="/admin/attendance/report"
                    className="secondary-button"
                >
                    Daily report
                </Link>
            </div>

            {error && (
                <div className="page-error">
                    {error}
                </div>
            )}

            <div className="content-card">
                <form
                    className="attendance-toolbar"
                    onSubmit={handleSearch}
                >
                    <input
                        className="search-input"
                        placeholder="Search employee..."
                        value={search}
                        onChange={event =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

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
                        className="primary-button"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

                {loading ? (
                    <div className="loading-state">
                        Loading attendance...
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
                                            Check in
                                        </th>
                                        <th>
                                            Check out
                                        </th>
                                        <th>
                                            Duration
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
                                                    key={
                                                        record.id
                                                    }
                                                >
                                                    <td>
                                                        <strong>
                                                            {
                                                                record.employeeName
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {
                                                            record.employeeCode
                                                        }
                                                    </td>

                                                    <td>
                                                        {formatDateTime(
                                                            record.enteredAt
                                                        )}
                                                    </td>

                                                    <td>
                                                        {record.leftAt
                                                            ? formatDateTime(
                                                                  record.leftAt
                                                              )
                                                            : "—"}
                                                    </td>

                                                    <td>
                                                        {getDuration(
                                                            record.enteredAt,
                                                            record.leftAt
                                                        )}
                                                    </td>

                                                    <td>
                                                        {record.leftAt ? (
                                                            <span className="status-badge">
                                                                Completed
                                                            </span>
                                                        ) : (
                                                            <span className="status-badge active">
                                                                Inside
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
                                                        No records found
                                                    </h3>

                                                    <p>
                                                        Try changing
                                                        your search
                                                        or date filters.
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
                                records
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

function formatDateTime(value: string) {
    return new Date(value).toLocaleString(
        "en-BD",
        {
            dateStyle: "medium",
            timeStyle: "short"
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

    return hours > 0
        ? `${hours}h ${remaining}m`
        : `${remaining}m`;
}