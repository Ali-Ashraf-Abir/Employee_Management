import {
    useState,
    type FormEvent
} from "react";
import { useNavigate } from "react-router-dom";

import { authApi } from "../../api/authApi";
import { ApiError } from "../../api/apiClient";
import { useAuth } from "../../context/AuthContext";

import Input from "../common/Input";
import Button from "../common/Button";

export default function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");

        if (!email.trim() || !password) {
            setError(
                "Please enter your email and password."
            );

            return;
        }

        try {
            setLoading(true);

            const response =
                await authApi.login({
                    email: email.trim(),
                    password
                },
            );

            login(response.accessToken);

            navigate("/dashboard", {
                replace: true
            });
        } catch (error) {
            if (error instanceof ApiError) {
                const data = error.data;

                if (
                    typeof data === "object" &&
                    data !== null &&
                    "message" in data
                ) {
                    setError(
                        String(
                            data.message
                        )
                    );
                } else {
                    setError(
                        "Unable to sign in. Please check your credentials."
                    );
                }
            } else {
                setError(
                    "Something went wrong. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="login-form"
            onSubmit={handleSubmit}
        >
            {error && (
                <div
                    className="login-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            <Input
                id="email"
                type="email"
                label="Email address"
                placeholder="you@company.com"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                    setEmail(
                        event.target.value
                    )
                }
                disabled={loading}
            />

            <div className="password-field">
                <Input
                    id="password"
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    label="Password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                        setPassword(
                            event.target.value
                        )
                    }
                    disabled={loading}
                />

                <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                        setShowPassword(
                            value => !value
                        )
                    }
                    disabled={loading}
                >
                    {showPassword
                        ? "Hide"
                        : "Show"}
                </button>
            </div>

            <div className="login-options">
                <label className="remember-me">
                    <input
                        type="checkbox"
                    />

                    <span>
                        Remember me
                    </span>
                </label>

                <button
                    type="button"
                    className="forgot-password"
                >
                    Forgot password?
                </button>
            </div>

            <Button
                type="submit"
                loading={loading}
            >
                Sign in
            </Button>
        </form>
    );
}