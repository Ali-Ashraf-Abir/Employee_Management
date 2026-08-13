import {
    Component,
    type ErrorInfo,
    type ReactNode
} from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary
    extends Component<Props, State>
{
    state: State = {
        hasError: false
    };

    static getDerivedStateFromError(): State {
        return {
            hasError: true
        };
    }

    componentDidCatch(
        error: Error,
        errorInfo: ErrorInfo
    ) {
        console.error(
            "Unhandled application error:",
            error,
            errorInfo
        );
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="status-page">
                    <span className="status-code">
                        !
                    </span>

                    <h1>
                        Something went wrong
                    </h1>

                    <p>
                        An unexpected error occurred.
                        Please try again.
                    </p>

                    <button
                        type="button"
                        className="status-action"
                        onClick={
                            this.handleReload
                        }
                    >
                        Reload application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}