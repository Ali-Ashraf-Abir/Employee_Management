import {
    useAuth
} from "../context/AuthContext";

export default function DashboardPage() {
    const {
        user
    } = useAuth();

    const name =
        user?.name ??
        user?.email ??
        "there";

    return (
        <div className="dashboard">
            <div className="page-heading">
                <div>
                    <h1>
                        Welcome back, {name}
                    </h1>

                    <p>
                        Here's what's happening
                        across your workspace.
                    </p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <span className="dashboard-card-label">
                        Employees
                    </span>

                    <strong>—</strong>

                    <span className="dashboard-card-description">
                        Total employees
                    </span>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-card-label">
                        Leave Requests
                    </span>

                    <strong>—</strong>

                    <span className="dashboard-card-description">
                        Pending requests
                    </span>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-card-label">
                        Attendance
                    </span>

                    <strong>—</strong>

                    <span className="dashboard-card-description">
                        Today's attendance
                    </span>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-card-label">
                        Status
                    </span>

                    <strong>Active</strong>

                    <span className="dashboard-card-description">
                        Your account
                    </span>
                </div>
            </div>

            <section className="dashboard-section">
                <div className="section-heading">
                    <div>
                        <h2>
                            Recent activity
                        </h2>

                        <p>
                            Your latest employee
                            management activity.
                        </p>
                    </div>
                </div>

                <div className="empty-state">
                    <h3>
                        No recent activity
                    </h3>

                    <p>
                        Activity will appear here
                        when there is something to
                        show.
                    </p>
                </div>
            </section>
        </div>
    );
}