import {
    useCallback,
    useEffect,
    useState
} from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    employeeApi
} from "../../api/employeeApi";

import {
    ApiError
} from "../../api/apiClient";

import type {
    Employee
} from "../../types/employee";

export default function EmployeeDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] =
        useState<Employee | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(false);

    const loadEmployee = useCallback(
        async () => {
            if (!id) {
                return;
            }

            try {
                setLoading(true);

                const result =
                    await employeeApi.getById(id);

                setEmployee(result);
            } catch (error) {
                if (
                    error instanceof ApiError &&
                    error.status === 404
                ) {
                    setError(
                        "Employee not found."
                    );
                } else {
                    setError(
                        "Unable to load employee."
                    );
                }
            } finally {
                setLoading(false);
            }
        },
        [id]
    );

    useEffect(() => {
        loadEmployee();
    }, [loadEmployee]);

    const handleStatusChange = async () => {
        if (!employee) {
            return;
        }

        try {
            setActionLoading(true);

            // Your Employee contract should expose
            // the account status/lockout state.
            //
            // For now this assumes an `isDisabled`
            // property exists.
            if (employee.isDisabled) {
                await employeeApi.enable(
                    employee.id
                );
            } else {
                await employeeApi.disable(
                    employee.id
                );
            }

            await loadEmployee();
        } catch {
            setError(
                "Unable to update employee status."
            );
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                Loading employee...
            </div>
        );
    }

    if (error || !employee) {
        return (
            <div className="page">
                <div className="page-error">
                    {error ||
                        "Employee not found."}
                </div>

                <button
                    className="secondary-button"
                    onClick={() =>
                        navigate(
                            "/employees"
                        )
                    }
                >
                    Back to employees
                </button>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <Link
                        to="/employees"
                        className="back-link"
                    >
                        ← Employees
                    </Link>

                    <h1>
                        {employee.firstName}{" "}
                        {employee.lastName}
                    </h1>

                    <p>
                        Employee ID:{" "}
                        {employee.employeeId}
                    </p>
                </div>

                <div className="page-actions">
                    <Link
                        to={`/employees/${employee.id}/edit`}
                        className="secondary-button"
                    >
                        Edit
                    </Link>

                    <button
                        type="button"
                        className={
                            employee.isDisabled
                                ? "primary-button"
                                : "danger-button"
                        }
                        disabled={
                            actionLoading
                        }
                        onClick={
                            handleStatusChange
                        }
                    >
                        {actionLoading
                            ? "Updating..."
                            : employee.isDisabled
                                ? "Enable account"
                                : "Disable account"}
                    </button>
                </div>
            </div>

            <div className="details-grid">
                <section className="content-card">
                    <div className="card-header">
                        <h2>
                            Personal information
                        </h2>
                    </div>

                    <div className="details-list">
                        <Detail
                            label="First name"
                            value={
                                employee.firstName
                            }
                        />

                        <Detail
                            label="Last name"
                            value={
                                employee.lastName
                            }
                        />

                        <Detail
                            label="Email"
                            value={
                                employee.email
                            }
                        />

                        <Detail
                            label="Phone"
                            value={
                                employee.phoneNumber ||
                                "Not provided"
                            }
                        />

                        <Detail
                            label="Joined"
                            value={new Date(
                                employee.joinedAt
                            ).toLocaleDateString()}
                        />
                    </div>
                </section>

                <section className="content-card">
                    <div className="card-header">
                        <h2>
                            Roles
                        </h2>

                        <Link
                            to={`/employees/${employee.id}/roles`}
                            className="table-action secondary-button"
                        >
                            Manage
                        </Link>
                    </div>

                    <div className="role-list">
                        {employee.roles.map(
                            role => (
                                <span
                                    key={role}
                                    className="role-badge"
                                >
                                    {role}
                                </span>
                            )
                        )}
                    </div>
                </section>
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
        <div className="detail-row">
            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>
        </div>
    );
}