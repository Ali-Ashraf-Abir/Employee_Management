import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { leaveTypeApi } from "../../api/leaveTypeApi";
import type { LeaveType } from "../../types/leaveType";

export default function LeaveTypesPage() {
    const [leaveTypes, setLeaveTypes] =
        useState<LeaveType[]>([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState<string | null>(null);

    useEffect(() => {
        loadLeaveTypes();
    }, []);

    const loadLeaveTypes = async () => {
        try {
            setLoading(true);
            setError("");

            const result =
                await leaveTypeApi.getAll();

            setLeaveTypes(result);
        } catch {
            setError(
                "Unable to load leave types."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (
        leaveType: LeaveType
    ) => {
        try {
            setActionLoading(leaveType.id);
            setError("");

            if (leaveType.isActive) {
                await leaveTypeApi.disable(
                    leaveType.id
                );
            } else {
                await leaveTypeApi.enable(
                    leaveType.id
                );
            }

            setLeaveTypes(current =>
                current.map(item =>
                    item.id === leaveType.id
                        ? {
                              ...item,
                              isActive:
                                  !item.isActive
                          }
                        : item
                )
            );
        } catch {
            setError(
                "Unable to update leave type status."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const filteredLeaveTypes =
        leaveTypes.filter(leaveType =>
            leaveType.name
                .toLowerCase()
                .includes(
                    search
                        .trim()
                        .toLowerCase()
                )
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
                        Leave types
                    </h1>

                    <p>
                        Manage the types of leave
                        available to employees.
                    </p>
                </div>

                <Link
                    to="/leave/types/new"
                    className="primary-button"
                >
                    Add leave type
                </Link>
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
                        placeholder="Search leave types..."
                        value={search}
                        onChange={event =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                    <span className="toolbar-count">
                        {filteredLeaveTypes.length}{" "}
                        {filteredLeaveTypes.length ===
                        1
                            ? "leave type"
                            : "leave types"}
                    </span>
                </div>

                {loading ? (
                    <div className="loading-state">
                        Loading leave types...
                    </div>
                ) : filteredLeaveTypes.length ===
                  0 ? (
                    <div className="empty-state">
                        <h3>
                            No leave types found
                        </h3>

                        <p>
                            {search
                                ? "Try a different search."
                                : "Create your first leave type to get started."}
                        </p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Annual limit
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
                                {filteredLeaveTypes.map(
                                    leaveType => (
                                        <tr
                                            key={
                                                leaveType.id
                                            }
                                        >
                                            <td>
                                                <strong>
                                                    {
                                                        leaveType.name
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    leaveType.annualLimit
                                                }{" "}
                                                days
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        leaveType.isActive
                                                            ? "status-badge active"
                                                            : "status-badge disabled"
                                                    }
                                                >
                                                    {leaveType.isActive
                                                        ? "Active"
                                                        : "Disabled"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="table-actions">
                                                    <Link
                                                        to={`/leave/types/${leaveType.id}/edit`}
                                                        className="table-action"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className={
                                                            leaveType.isActive
                                                                ? "table-action danger"
                                                                : "table-action"
                                                        }
                                                        disabled={
                                                            actionLoading ===
                                                            leaveType.id
                                                        }
                                                        onClick={() =>
                                                            handleToggle(
                                                                leaveType
                                                            )
                                                        }
                                                    >
                                                        {actionLoading ===
                                                        leaveType.id
                                                            ? "Updating..."
                                                            : leaveType.isActive
                                                                ? "Disable"
                                                                : "Enable"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}