import {
    useState,
    type FormEvent
} from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
import { leaveTypeApi } from "../../api/leaveTypeApi";
import { ApiError } from "../../api/apiClient";

export default function CreateLeaveTypePage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");

    const [annualLimit, setAnnualLimit] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const trimmedName = name.trim();

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
            setLoading(true);
            setError("");

            await leaveTypeApi.create({
                name: trimmedName,
                annualLimit: limit
            });

            navigate("/leave/types");
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
                        Add leave type
                    </h1>

                    <p>
                        Create a new type of leave
                        for employees.
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
                            placeholder="e.g. Annual Leave"
                            value={name}
                            onChange={event =>
                                setName(
                                    event.target
                                        .value
                                )
                            }
                            maxLength={100}
                            required
                            autoFocus
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
                            placeholder="e.g. 20"
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
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create leave type"}
                    </button>
                </div>
            </form>
        </div>
    );
}

