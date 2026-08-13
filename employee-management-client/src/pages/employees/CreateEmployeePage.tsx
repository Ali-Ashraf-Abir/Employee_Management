import {
    useState,
    type FormEvent
} from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
import { employeeApi } from "../../api/employeeApi";
import { ApiError } from "../../api/apiClient";

export default function CreateEmployeePage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        department: "",
        position: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
        setError("");

        if (
            !form.firstName.trim() ||
            !form.lastName.trim() ||
            !form.email.trim() ||
            !form.password ||
            !form.department.trim() ||
            !form.position.trim()
        ) {
            setError(
                "Please fill in all required fields."
            );
            return;
        }

        try {
            setLoading(true);

            const employee =
                await employeeApi.create({
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    department: form.department.trim(),
                    position: form.position.trim()
                });

            navigate(
                `/employees/${employee.id}`
            );
        } catch (error) {
            if (error instanceof ApiError) {
                const data = error.data;

                if (
                    typeof data === "object" &&
                    data !== null &&
                    "message" in data
                ) {
                    setError(
                        String(data.message)
                    );
                } else {
                    setError(
                        "Unable to create employee."
                    );
                }
            } else {
                setError(
                    "Unable to create employee."
                );
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
                        to="/employees"
                        className="back-link"
                    >
                        ← Employees
                    </Link>

                    <h1>
                        Add employee
                    </h1>

                    <p>
                        Create a new employee
                        account.
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

                    <FormField
                        label="Temporary password"
                        type="password"
                        value={form.password}
                        onChange={value =>
                            updateField(
                                "password",
                                value
                            )
                        }
                        required
                    />
                </div>

                <div className="form-actions">
                    <Link
                        to="/employees"
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
                            : "Create employee"}
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