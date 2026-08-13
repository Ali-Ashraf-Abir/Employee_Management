import {
    useEffect,
    useState,
    type FormEvent
} from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
import { leaveRequestApi } from "../../api/leaveRequestApi";
import { leaveTypeApi } from "../../api/leaveTypeApi";
import type { LeaveType } from "../../types/leaveType";
import { ApiError } from "../../api/apiClient";

export default function CreateLeaveRequestPage() {
    const navigate = useNavigate();

    const [leaveTypes, setLeaveTypes] =
        useState<LeaveType[]>([]);

    const [leaveTypeId, setLeaveTypeId] =
        useState("");

    const [startDate, setStartDate] =
        useState("");

    const [endDate, setEndDate] =
        useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        loadLeaveTypes();
    }, []);

    const loadLeaveTypes = async () => {
        try {
            const result =
                await leaveTypeApi.getAll();

            setLeaveTypes(
                result.filter(
                    x => x.isActive
                )
            );
        } catch {
            setError(
                "Unable to load leave types."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!leaveTypeId) {
            setError(
                "Please select a leave type."
            );
            return;
        }

        if (!startDate || !endDate) {
            setError(
                "Please select both dates."
            );
            return;
        }

        if (endDate < startDate) {
            setError(
                "End date cannot be before start date."
            );
            return;
        }

        if (
            new Date(startDate).getFullYear() !==
            new Date(endDate).getFullYear()
        ) {
            setError(
                "A leave request must be within the same calendar year."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");

            await leaveRequestApi.create({
                leaveTypeId,
                startDate,
                endDate,
                reason: reason.trim() || undefined
            });

            navigate("/leave");
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("Unable to submit leave request.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                Loading leave types...
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
                        Request leave
                    </h1>

                    <p>
                        Submit a new leave request
                        for approval.
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
                        <label htmlFor="leave-type">
                            Leave type
                            <span className="required">
                                {" "}*
                            </span>
                        </label>

                        <select
                            id="leave-type"
                            className="input"
                            value={leaveTypeId}
                            onChange={event =>
                                setLeaveTypeId(
                                    event.target
                                        .value
                                )
                            }
                            required
                        >
                            <option value="">
                                Select leave type
                            </option>

                            {leaveTypes.map(
                                leaveType => (
                                    <option
                                        key={
                                            leaveType.id
                                        }
                                        value={
                                            leaveType.id
                                        }
                                    >
                                        {
                                            leaveType.name
                                        }{" "}
                                        —{" "}
                                        {
                                            leaveType.annualLimit
                                        }{" "}
                                        days/year
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div />
                    <div className="form-field full-width">
                        <label htmlFor="reason">
                            Reason
                        </label>

                        <textarea
                            id="reason"
                            className="input"
                            value={reason}
                            onChange={event =>
                                setReason(event.target.value)
                            }
                            placeholder="Provide a reason for your leave request..."
                            rows={5}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="start-date">
                            Start date
                            <span className="required">
                                {" "}*
                            </span>
                        </label>

                        <input
                            id="start-date"
                            className="input"
                            type="date"
                            value={startDate}
                            onChange={event =>
                                setStartDate(
                                    event.target
                                        .value
                                )
                            }
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="end-date">
                            End date
                            <span className="required">
                                {" "}*
                            </span>
                        </label>

                        <input
                            id="end-date"
                            className="input"
                            type="date"
                            value={endDate}
                            onChange={event =>
                                setEndDate(
                                    event.target
                                        .value
                                )
                            }
                            min={startDate}
                            required
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <Link
                        to="/leave"
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
                            ? "Submitting..."
                            : "Submit request"}
                    </button>
                </div>
            </form>
        </div>
    );
}

