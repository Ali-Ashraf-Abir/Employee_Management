import type {
    ReactNode
} from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({
    children
}: AuthLayoutProps) {
    return (
        <div className="auth-layout">
            <div className="auth-container">
                <div className="brand">
                    <div className="brand-mark">
                        EM
                    </div>

                    <span>
                        Employee Management
                    </span>
                </div>

                {children}

                <p className="auth-footer">
                    Secure employee management portal
                </p>
            </div>
        </div>
    );
}