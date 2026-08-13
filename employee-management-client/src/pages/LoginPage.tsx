import AuthLayout from "../layouts/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
    return (
        <AuthLayout>
            <div className="login-card">
                <div className="login-header">
                    <h1>
                        Welcome back
                    </h1>

                    <p>
                        Sign in to access
                        your employee portal.
                    </p>
                </div>

                <LoginForm />
            </div>
        </AuthLayout>
    );
}