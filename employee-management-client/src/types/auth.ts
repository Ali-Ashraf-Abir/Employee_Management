export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
}

export interface AuthUser {
    id?: string;
    email?: string;
    name?: string;
    roles: string[];
}