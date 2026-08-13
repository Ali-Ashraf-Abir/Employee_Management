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
import { leaveRequestApi } from "../../api/leaveRequestApi";
import { leaveTypeApi } from "../../api/leaveTypeApi";
import type { LeaveType } from "../../types/leaveType";
import { ApiError } from "../../api/apiClient";

export default function EditLeaveRequestPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reason, setReason] = useState("");
    const [leaveTypes, setLeaveTypes] =
        useState<LeaveType[]>([]);

    const [leaveTypeId, setLeaveTypeId] =
        useState("");

    const [startDate, setStartDate] =
        useState("");

    const [endDate, setEndDate] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (id) {
            loadData(id);
        }
    }, [id]);

    const loadData = async (
        requestId: string
    ) => {
        try {
            setLoading(true);

            const [
                request,
                types
            ] = await Promise.all([
                leaveRequestApi.getById(
                    requestId
                ),
                leaveTypeApi.getAll()
            ]);

            if (
                request.status !== "Pending"
            ) {
                setError(
                    "Only pending leave requests can be edited."
                );
                return;
            }

            setLeaveTypeId(
                request.leaveTypeId
            );
            setReason(request.reason ?? "");
            setStartDate(
                request.startDate.substring(
                    0,
                    10
                )
            );

            setEndDate(
                request.endDate.substring(
                    0,
                    10
                )
            );

            setLeaveTypes(
                types.filter(
                    x => x.isActive
                )
            );
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

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!id) {
            return;
        }

        if (
            !leaveTypeId ||
            !startDate ||
            !endDate
        ) {
            setError(
                "Please complete all required fields."
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

            await leaveRequestApi.update(
                id,
                {
                    leaveTypeId,
                    startDate,
                    endDate,
                    reason: reason.trim() || undefined
                }
            );
            navigate(
                `/leave/requests/${id}`
            );
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
                Loading request...
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <Link
                        to={`/leave/requests/${id}`}
                        className="back-link"
                    >
                        ← Leave request
                    </Link>

                    <h1>
                        Edit leave request
                    </h1>

                    <p>
                        Update your pending leave
                        request.
                    </p>
                </div>
            </div>

            {error && (
                <div className="page-error">
                    {error}
                </div>
            )}

            {!error && (
                <form
                    className="content-card form-card"
                    onSubmit={handleSubmit}
                >
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
                                value={
                                    leaveTypeId
                                }
                                onChange={event =>
                                    setLeaveTypeId(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                required
                            >
                                <option value="">
                                    Select leave type
                                </option>

                                {leaveTypes.map(
                                    type => (
                                        <option
                                            key={
                                                type.id
                                            }
                                            value={
                                                type.id
                                            }
                                        >
                                            {
                                                type.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div />

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
                                value={
                                    startDate
                                }
                                onChange={event =>
                                    setStartDate(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                required
                            />
                        </div>
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
                                value={
                                    endDate
                                }
                                min={
                                    startDate
                                }
                                onChange={event =>
                                    setEndDate(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <Link
                            to={`/leave/requests/${id}`}
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
            )}
        </div>
    );
}

