import {
    useNavigate
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
    sidebarCollapsed: boolean;
    mobileSidebarOpen: boolean;
    onToggleSidebar: () => void;
    onToggleMobileSidebar: () => void;
}

export default function Header({
    sidebarCollapsed,
    mobileSidebarOpen,
    onToggleSidebar,
    onToggleMobileSidebar
}: HeaderProps) {
    const {
        user,
        logout
    } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();

        navigate(
            "/login",
            {
                replace: true
            }
        );
    };

    const displayName =
        user?.name ??
        user?.email ??
        "User";

    return (
        <header className="app-header">
            <div className="header-left">
                {/* Desktop sidebar toggle */}
                <button
                    type="button"
                    className="sidebar-toggle desktop-sidebar-toggle"
                    onClick={onToggleSidebar}
                    aria-label={
                        sidebarCollapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                    title={
                        sidebarCollapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                >
                    <span>☰</span>
                </button>

                {/* Mobile sidebar toggle */}
                <button
                    type="button"
                    className="sidebar-toggle mobile-sidebar-toggle"
                    onClick={onToggleMobileSidebar}
                    aria-label={
                        mobileSidebarOpen
                            ? "Close navigation"
                            : "Open navigation"
                    }
                >
                    <span>
                        {mobileSidebarOpen
                            ? "×"
                            : "☰"}
                    </span>
                </button>

                <h2 className="header-title">
                    Employee Management
                </h2>
            </div>

            <div className="header-user">
                <div className="user-info">
                    <span className="user-name">
                        {displayName}
                    </span>

                    <span className="user-role">
                        {user?.roles.join(", ") ||
                            "Employee"}
                    </span>
                </div>

                <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Sign out
                </button>
            </div>
        </header>
    );
}