const API_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends RequestInit {
    authenticated?: boolean;
    skipRefresh?: boolean;
}

interface ProblemDetails {
    title?: string;
    detail?: string;
    message?: string;
    status?: number;
    errors?: Record<string, string[]>;
}

interface AuthResponse {
    accessToken: string;
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
        if (typeof data === "object" && data !== null) {
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

function getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
}

function setAccessToken(token: string): void {
    localStorage.setItem("accessToken", token);
}

function clearAccessToken(): void {
    localStorage.removeItem("accessToken");
}

function handleUnauthorized(): void {
    clearAccessToken();

    window.dispatchEvent(
        new Event("auth:unauthorized")
    );
}
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/auth/refresh`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                return null;
            }

            const data =
                await parseResponse(response) as AuthResponse;

            if (
                !data ||
                typeof data.accessToken !== "string"
            ) {
                return null;
            }

            setAccessToken(data.accessToken);

            return data.accessToken;
        } catch {
            return null;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}
async function request<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const {
        authenticated = true,
        skipRefresh = false,
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

    const sendRequest = async (
        accessToken?: string | null
    ): Promise<Response> => {
        const headersForRequest =
            new Headers(requestHeaders);

        if (authenticated && accessToken) {
            headersForRequest.set(
                "Authorization",
                `Bearer ${accessToken}`
            );
        }

        return fetch(
            `${API_URL}${endpoint}`,
            {
                ...fetchOptions,
                headers: headersForRequest,
                credentials: "include"
            }
        );
    };

    let response: Response;

    try {
        response = await sendRequest(
            authenticated
                ? getAccessToken()
                : null
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

    /*
     * Access token expired.
     *
     * Don't try refreshing:
     * - unauthenticated requests
     * - the refresh endpoint itself
     */
    if (
        response.status === 401 &&
        authenticated &&
        !skipRefresh
    ) {
        const newAccessToken =
            await refreshAccessToken();

        if (newAccessToken) {
            try {
                response = await sendRequest(
                    newAccessToken
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
        } else {
            handleUnauthorized();
        }
    }

    const data = await parseResponse(response);

    if (!response.ok) {
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
interface JwtPayload {
    exp?: number;
}

function isAccessTokenExpired(
    token: string
): boolean {
    try {
        const payload = JSON.parse(
            atob(
                token
                    .split(".")[1]
                    .replace(/-/g, "+")
                    .replace(/_/g, "/")
            )
        ) as JwtPayload;

        if (!payload.exp) {
            return true;
        }

        return (
            payload.exp * 1000 <=
            Date.now() + 30_000
        );
    } catch {
        return true;
    }
}
export async function getValidAccessToken(): Promise<string | null> {
    const token = getAccessToken();

    if (token && !isAccessTokenExpired(token)) {
        return token;
    }

    return refreshAccessToken();
}
export default apiClient;