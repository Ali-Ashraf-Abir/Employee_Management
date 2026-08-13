import {
    Link
} from "react-router-dom";

export default function ForbiddenPage() {
    return (
        <div className="status-page">
            <span className="status-code">
                403
            </span>

            <h1>
                Access denied
            </h1>

            <p>
                You don't have permission to
                access this resource.
            </p>

            <Link
                to="/dashboard"
                className="status-action"
            >
                Return to dashboard
            </Link>
        </div>
    );
}