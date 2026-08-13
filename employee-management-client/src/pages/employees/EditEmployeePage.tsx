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
import { employeeApi } from "../../api/employeeApi";

export default function EditEmployeePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
        position: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) {
            setError("Invalid employee ID.");
            setLoading(false);
            return;
        }

        employeeApi
            .getById(id)
            .then(employee => {
                setForm({
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    email: employee.email,
                    department: employee.department,
                    position: employee.position
                });
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

    const updateField = (
        field: keyof typeof form,
        value: string
    ) => {
        setForm(current => ({
            ...current,
            [field]: value
        }));
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!id) {
            return;
        }

        setError("");

        if (
            !form.firstName.trim() ||
            !form.lastName.trim() ||
            !form.email.trim() ||
            !form.department.trim() ||
            !form.position.trim()
        ) {
            setError(
                "Please fill in all required fields."
            );
            return;
        }

        try {
            setSaving(true);

            await employeeApi.update(id, {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                department: form.department.trim(),
                position: form.position.trim()
            });

            navigate(`/employees/${id}`);
        } catch {
            setError(
                "Unable to update employee."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                Loading employee...
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
                        Edit employee
                    </h1>

                    <p>
                        Update employee information.
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
                    <FormField
                        label="First name"
                        value={form.firstName}
                        onChange={value =>
                            updateField(
                                "firstName",
                                value
                            )
                        }
                        required
                    />

                    <FormField
                        label="Last name"
                        value={form.lastName}
                        onChange={value =>
                            updateField(
                                "lastName",
                                value
                            )
                        }
                        required
                    />

                    <FormField
                        label="Email address"
                        type="email"
                        value={form.email}
                        onChange={value =>
                            updateField(
                                "email",
                                value
                            )
                        }
                        required
                    />

                    <FormField
                        label="Department"
                        value={form.department}
                        onChange={value =>
                            updateField(
                                "department",
                                value
                            )
                        }
                        required
                    />

                    <FormField
                        label="Position"
                        value={form.position}
                        onChange={value =>
                            updateField(
                                "position",
                                value
                            )
                        }
                        required
                    />
                </div>

                <div className="form-actions">
                    <Link
                        to={`/employees/${id}`}
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

function FormField({
    label,
    value,
    onChange,
    type = "text",
    required = false
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
}) {
    return (
        <div className="form-field">
            <label>
                {label}
                {required && (
                    <span className="required">
                        {" "}*
                    </span>
                )}
            </label>

            <input
                className="input"
                type={type}
                value={value}
                required={required}
                onChange={event =>
                    onChange(
                        event.target.value
                    )
                }
            />
        </div>
    );
}