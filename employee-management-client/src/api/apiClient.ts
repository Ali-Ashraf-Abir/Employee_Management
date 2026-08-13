const API_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends RequestInit {
    authenticated?: boolean;
}

interface ProblemDetails {
    title?: string;
    detail?: string;
    message?: string;
    status?: number;
    errors?: Record<string, string[]>;
}

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(status: number, data: unknown) {
        super(ApiError.getMessage(status, data));

        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }

    private static getMessage(
        status: number,
        data: unknown
    ): string {
        if (
            typeof data === "object" &&
            data !== null
        ) {
            const problem = data as ProblemDetails;

            if (typeof problem.detail === "string") {
                return problem.detail;
            }

            if (typeof problem.message === "string") {
                return problem.message;
            }

            if (typeof problem.title === "string") {
                return problem.title;
            }

            if (problem.errors) {
                const messages = Object.values(
                    problem.errors
                ).flat();

                if (messages.length > 0) {
                    return messages.join(" ");
                }
            }
        }

        switch (status) {
            case 0:
                return "Unable to connect to the server.";

            case 400:
                return "The request could not be completed.";

            case 401:
                return "Your session has expired. Please sign in again.";

            case 403:
                return "You are not allowed to perform this action.";

            case 404:
                return "The requested resource was not found.";

            case 409:
                return "The request conflicts with the current state.";

            case 422:
                return "The submitted data is invalid.";

            case 500:
                return "An unexpected server error occurred.";

            default:
                return "The request could not be completed.";
        }
    }
}

async function parseResponse(
    response: Response
): Promise<unknown> {
    const contentType =
        response.headers.get("content-type") ?? "";

    if (
        contentType.includes("application/json") ||
        contentType.includes("application/problem+json")
    ) {
        return response.json();
    }

    const text = await response.text();

    return text || null;
}

async function request<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const {
        authenticated = true,
        headers,
        ...fetchOptions
    } = options;

    const requestHeaders = new Headers(headers);

    if (
        fetchOptions.body &&
        !requestHeaders.has("Content-Type")
    ) {
        requestHeaders.set(
            "Content-Type",
            "application/json"
        );
    }

    if (authenticated) {
        const token =
            localStorage.getItem("accessToken");

        if (token) {
            requestHeaders.set(
                "Authorization",
                `Bearer ${token}`
            );
        }
    }

    let response: Response;

    try {
        response = await fetch(
            `${API_URL}${endpoint}`,
            {
                ...fetchOptions,
                headers: requestHeaders
            }
        );
    } catch {
        throw new ApiError(
            0,
            {
                message:
                    "Unable to connect to the server."
            }
        );
    }

    const data = await parseResponse(response);

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("accessToken");

            window.dispatchEvent(
                new Event("auth:unauthorized")
            );
        }

        throw new ApiError(
            response.status,
            data
        );
    }

    return data as T;
}

const apiClient = {
    get<T>(
        endpoint: string,
        options?: RequestOptions
    ) {
        return request<T>(
            endpoint,
            {
                ...options,
                method: "GET"
            }
        );
    },

    post<T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ) {
        return request<T>(
            endpoint,
            {
                ...options,
                method: "POST",
                body:
                    body !== undefined
                        ? JSON.stringify(body)
                        : undefined
            }
        );
    },

    put<T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ) {
        return request<T>(
            endpoint,
            {
                ...options,
                method: "PUT",
                body:
                    body !== undefined
                        ? JSON.stringify(body)
                        : undefined
            }
        );
    },

    patch<T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ) {
        return request<T>(
            endpoint,
            {
                ...options,
                method: "PATCH",
                body:
                    body !== undefined
                        ? JSON.stringify(body)
                        : undefined
            }
        );
    },

    delete<T>(
        endpoint: string,
        options?: RequestOptions
    ) {
        return request<T>(
            endpoint,
            {
                ...options,
                method: "DELETE"
            }
        );
    }
};

export default apiClient;