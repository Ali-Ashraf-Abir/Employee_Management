import type {
    InputHTMLAttributes
} from "react";

interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function Input({
    label,
    error,
    id,
    ...props
}: InputProps) {
    return (
        <div className="form-field">
            <label htmlFor={id}>
                {label}
            </label>

            <input
                id={id}
                {...props}
                className={
                    error
                        ? "input input-error"
                        : "input"
                }
            />

            {error && (
                <span className="field-error">
                    {error}
                </span>
            )}
        </div>
    );
}