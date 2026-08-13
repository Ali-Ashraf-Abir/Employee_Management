import {
    Link
} from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="status-page">
            <span className="status-code">
                404
            </span>

            <h1>
                Page not found
            </h1>

            <p>
                The page you're looking for
                doesn't exist.
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