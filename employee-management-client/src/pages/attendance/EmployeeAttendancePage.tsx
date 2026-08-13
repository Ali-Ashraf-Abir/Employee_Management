import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { AttendanceResponse } from "../../types/attendance";
import { employeeAttendanceApi } from "../../api/attendanceApi";

export default function EmployeeAttendancePage() {
    const [current, setCurrent] =
        useState<AttendanceResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        loadCurrentStatus();
    }, []);

    const loadCurrentStatus = async () => {
        try {
            setLoading(true);
            setError("");

            const result =
                await employeeAttendanceApi.history({
                    page: 1,
                    pageSize: 1
                });

            const latest = result.items[0];

            if (latest && latest.leftAt === null) {
                setCurrent(latest);
            } else {
                setCurrent(null);
            }
        } catch {
            setError(
                "Unable to load attendance status."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEnter = async () => {
        try {
            setActionLoading(true);
            setError("");

            const result =
                await employeeAttendanceApi.enter();

            setCurrent(result);
        } catch {
            setError(
                "Unable to check in. Please try again."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeave = async () => {
        try {
            setActionLoading(true);
            setError("");

            await employeeAttendanceApi.leave();

            setCurrent(null);
        } catch {
            setError(
                "Unable to check out. Please try again."
            );
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                Loading attendance...
            </div>
        );
    }

    return (
        <div className="page attendance-page">
            <div className="page-header">
                <div>
                    <h1>Attendance</h1>
                    <p>
                        Manage your attendance and
                        view your attendance history.
                    </p>
                </div>

                <Link
                    to="/attendance/history"
                    className="secondary-button"
                >
                    View history
                </Link>
            </div>

            {error && (
                <div className="page-error">
                    {error}
                </div>
            )}

            <div className="attendance-status-card">
                <div>
                    <span className="attendance-label">
                        Current status
                    </span>

                    <h2>
                        {current
                            ? "Currently checked in"
                            : "Currently checked out"}
                    </h2>

                    <p>
                        {current
                            ? `Checked in at ${formatDateTime(
                                  current.enteredAt
                              )}`
                            : "You are not currently checked in."}
                    </p>
                </div>

                <div className="attendance-action">
                    {current ? (
                        <button
                            className="danger-button"
                            disabled={actionLoading}
                            onClick={handleLeave}
                        >
                            {actionLoading
                                ? "Checking out..."
                                : "Check out"}
                        </button>
                    ) : (
                        <button
                            className="primary-button"
                            disabled={actionLoading}
                            onClick={handleEnter}
                        >
                            {actionLoading
                                ? "Checking in..."
                                : "Check in"}
                        </button>
                    )}
                </div>
            </div>

            {current && (
                <div className="attendance-info-grid">
                    <div className="dashboard-card">
                        <span className="dashboard-card-label">
                            Check-in time
                        </span>

                        <strong>
                            {formatTime(
                                current.enteredAt
                            )}
                        </strong>

                        <span className="dashboard-card-description">
                            Today
                        </span>
                    </div>

                    <div className="dashboard-card">
                        <span className="dashboard-card-label">
                            Status
                        </span>

                        <strong>
                            Inside
                        </strong>

                        <span className="dashboard-card-description">
                            Active attendance record
                        </span>
                    </div>
                </div>
            )}
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

function formatTime(value: string) {
    return new Date(value).toLocaleTimeString(
        "en-BD",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}