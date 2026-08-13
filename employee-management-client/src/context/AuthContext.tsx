import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";

import { decodeJwt } from "../utils/jwt";
import type { AuthUser } from "../types/auth";

interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext =
    createContext<AuthContextValue | undefined>(
        undefined
    );

interface AuthProviderProps {
    children: ReactNode;
}

function getUserFromStorage(): AuthUser | null {
    const token =
        localStorage.getItem("accessToken");

    if (!token) {
        return null;
    }

    return decodeJwt(token);
}

export function AuthProvider({
    children
}: AuthProviderProps) {
    const [user, setUser] =
        useState<AuthUser | null>(
            getUserFromStorage
        );

    useEffect(() => {
        const handleUnauthorized = () => {
            localStorage.removeItem(
                "accessToken"
            );

            setUser(null);
        };

        window.addEventListener(
            "auth:unauthorized",
            handleUnauthorized
        );

        return () => {
            window.removeEventListener(
                "auth:unauthorized",
                handleUnauthorized
            );
        };
    }, []);

    const login = (token: string) => {
        localStorage.setItem(
            "accessToken",
            token
        );

        setUser(
            decodeJwt(token)
        );
    };

    const logout = () => {
        localStorage.removeItem(
            "accessToken"
        );

        setUser(null);
    };

    const hasRole = (role: string) => {
        return user?.roles.includes(role) ?? false;
    };

    const hasAnyRole = (roles: string[]) => {
        return roles.some(hasRole);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                login,
                logout,
                hasRole,
                hasAnyRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}