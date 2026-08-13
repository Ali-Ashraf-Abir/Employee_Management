import {
    useEffect,
    useState,
    type FormEvent
} from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";
import { leaveTypeApi } from "../../api/leaveTypeApi";
import { ApiError } from "../../api/apiClient";

export default function EditLeaveTypePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");

    const [annualLimit, setAnnualLimit] =
        useState("");

    const [isActive, setIsActive] =
        useState(true);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (!id) {
            setError(
                "Invalid leave type ID."
            );
            setLoading(false);
            return;
        }

        loadLeaveType(id);
    }, [id]);

    const loadLeaveType = async (
        leaveTypeId: string
    ) => {
        try {
            setLoading(true);
            setError("");

            const result =
                await leaveTypeApi.getById(
                    leaveTypeId
                );

            setName(result.name);

            setAnnualLimit(
                result.annualLimit.toString()
            );

            setIsActive(result.isActive);
        } catch (error) {
            if (
                error instanceof ApiError &&
                error.status === 404
            ) {
                setError(
                    "Leave type not found."
                );
            } else {
                setError(
                    "Unable to load leave type."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!id) {
            return;
        }

        const trimmedName =
            name.trim();

        if (!trimmedName) {
            setError(
                "Leave type name is required."
            );
            return;
        }

        const limit =
            Number(annualLimit);

        if (
            !Number.isInteger(limit) ||
            limit < 0
        ) {
            setError(
                "Annual limit must be a valid non-negative number."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");

            await leaveTypeApi.update(
                id,
                {
                    name: trimmedName,
                    annualLimit: limit
                }
            );

            navigate("/leave/types");
        } catch (error) {
            if (error instanceof ApiError) {
                setError(
                    getApiErrorMessage(error)
                );
            } else {
                setError(
                    "Unable to update leave type."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async () => {
        if (!id) {
            return;
        }

        try {
            setSaving(true);
            setError("");

            if (isActive) {
                await leaveTypeApi.disable(id);
            } else {
                await leaveTypeApi.enable(id);
            }

            setIsActive(current => !current);
        } catch {
            setError(
                "Unable to update leave type status."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                Loading leave type...
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <Link
                        to="/leave/types"
                        className="back-link"
                    >
                        ← Leave types
                    </Link>

                    <h1>
                        Edit leave type
                    </h1>

                    <p>
                        Update the leave type
                        configuration.
                    </p>
                </div>
            </div>

            <form
                className="content-card form-card"
                onSubmit={handleSubmit}
            >
                {error && (
                    <div className="page-error">
                        {error}
                    </div>
                )}

                <div className="form-grid">
                    <div className="form-field">
                        <label htmlFor="leave-type-name">
                            Name
                            <span className="required">
                                {" "}*
                            </span>
                        </label>

                        <input
                            id="leave-type-name"
                            className="input"
                            type="text"
                            value={name}
                            onChange={event =>
                                setName(
                                    event.target
                                        .value
                                )
                            }
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="annual-limit">
                            Annual limit
                            <span className="required">
                                {" "}*
                            </span>
                        </label>

                        <input
                            id="annual-limit"
                            className="input"
                            type="number"
                            min="0"
                            step="1"
                            value={annualLimit}
                            onChange={event =>
                                setAnnualLimit(
                                    event.target
                                        .value
                                )
                            }
                            required
                        />

                        <span className="field-hint">
                            Maximum number of days an
                            employee can use per year.
                        </span>
                    </div>
                </div>

                <div className="leave-type-status">
                    <div>
                        <span className="form-label">
                            Status
                        </span>

                        <span
                            className={
                                isActive
                                    ? "status-badge active"
                                    : "status-badge disabled"
                            }
                        >
                            {isActive
                                ? "Active"
                                : "Disabled"}
                        </span>
                    </div>

                    <button
                        type="button"
                        className={
                            isActive
                                ? "table-action danger"
                                : "table-action"
                        }
                        disabled={saving}
                        onClick={handleToggle}
                    >
                        {saving
                            ? "Updating..."
                            : isActive
                                ? "Disable leave type"
                                : "Enable leave type"}
                    </button>
                </div>

                <div className="form-actions">
                    <Link
                        to="/leave/types"
                        className="secondary-button"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function getApiErrorMessage(
    error: ApiError
) {
    if (
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
    ) {
        return String(
            error.data.message
        );
    }

    if (error.status === 409) {
        return "A leave type with this name already exists.";
    }

    return "Unable to update leave type.";
}