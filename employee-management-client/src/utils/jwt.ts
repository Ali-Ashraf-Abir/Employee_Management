import type { AuthUser } from "../types/auth";

interface JwtPayload {
    sub?: string;
    email?: string;
    name?: string;
    role?: string | string[];
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?:
        string | string[];
}

function decodeBase64Url(value: string): string {
    const base64 = value
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const padded = base64.padEnd(
        base64.length + (4 - base64.length % 4) % 4,
        "="
    );

    return atob(padded);
}

export function decodeJwt(token: string): AuthUser | null {
    try {
        const parts = token.split(".");

        if (parts.length !== 3) {
            return null;
        }

        const payload =
            JSON.parse(
                decodeBase64Url(parts[1])
            ) as JwtPayload;

        const roleClaim =
            payload[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] ?? payload.role;

        const roles = Array.isArray(roleClaim)
            ? roleClaim
            : roleClaim
                ? [roleClaim]
                : [];

        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            roles
        };
    } catch {
        return null;
    }
}