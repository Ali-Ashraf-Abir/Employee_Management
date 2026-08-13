import type {
    ButtonHTMLAttributes
} from "react";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

export default function Button({
    children,
    loading = false,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            className="button"
        >
            {loading
                ? "Signing in..."
                : children}
        </button>
    );
}