import apiClient from "./apiClient";
import type {
    AuthResponse,
    LoginRequest
} from "../types/auth";

export const authApi = {
    login(credentials: LoginRequest) {
        return apiClient.post<AuthResponse>(
            "/api/auth/login",
            credentials,
            {
                authenticated: false
            }
        );
    },
    logout() {
        return apiClient.post(
            "/api/auth/logout",
            undefined,
            {
                authenticated: false,
                skipRefresh: true
            }
        );
    }
    
};