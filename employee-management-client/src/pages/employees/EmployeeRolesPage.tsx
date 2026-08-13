import {
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

const AVAILABLE_ROLES = [
    "Employee",
    "HR",
    "Admin"
];

export default function EmployeeRolesPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedRoles, setSelectedRoles] =
        useState<string[]>([]);

    const [employeeName, setEmployeeName] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (!id) {
            return;
        }

        employeeApi
            .getById(id)
            .then(employee => {
                setEmployeeName(
                    `${employee.firstName} ${employee.lastName}`
                );

                setSelectedRoles(
                    employee.roles
                );
            })
            .catch(() => {
                setError(
                    "Unable to load employee."
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const toggleRole = (
        role: string
    ) => {
        if (role === "Employee") {
            return;
        }

        setSelectedRoles(
            current =>
                current.includes(role)
                    ? current.filter(
                        item =>
                            item !== role
                    )
                    : [...current, role]
        );
    };

    const handleSave = async () => {
        if (!id) {
            return;
        }

        try {
            setSaving(true);
            setError("");

            await employeeApi.updateRoles(
                id,
                selectedRoles
            );

            navigate(
                `/employees/${id}`
            );
        } catch {
            setError(
                "Unable to update roles."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                Loading roles...
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <Link
                        to={`/employees/${id}`}
                        className="back-link"
                    >
                        ← Employee
                    </Link>

                    <h1>
                        Manage roles
                    </h1>

                    <p>
                        {employeeName}
                    </p>
                </div>
            </div>

            <div className="content-card roles-card">
                {error && (
                    <div className="page-error">
                        {error}
                    </div>
                )}

                <div className="role-options">
                    {AVAILABLE_ROLES.map(
                        role => {
                            const checked =
                                selectedRoles.includes(
                                    role
                                );

                            return (
                                <label
                                    key={role}
                                    className={
                                        checked
                                            ? "role-option selected"
                                            : "role-option"
                                    }
                                >
                                    <input
                                        type="checkbox"
                                        checked={
                                            checked
                                        }
                                        disabled={
                                            role ===
                                            "Employee"
                                        }
                                        onChange={() =>
                                            toggleRole(
                                                role
                                            )
                                        }
                                    />

                                    <div>
                                        <strong>
                                            {role}
                                        </strong>

                                        <span>
                                            {role ===
                                            "Employee"
                                                ? "Every employee has this role."
                                                : `Grant ${role} permissions.`}
                                        </span>
                                    </div>
                                </label>
                            );
                        }
                    )}
                </div>

                <div className="form-actions">
                    <Link
                        to={`/employees/${id}`}
                        className="secondary-button"
                    >
                        Cancel
                    </Link>

                    <button
                        type="button"
                        className="primary-button"
                        disabled={saving}
                        onClick={
                            handleSave
                        }
                    >
                        {saving
                            ? "Saving..."
                            : "Save roles"}
                    </button>
                </div>
            </div>
        </div>
    );
}