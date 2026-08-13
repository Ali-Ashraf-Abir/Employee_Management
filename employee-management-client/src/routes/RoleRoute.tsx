import {
    Navigate,
    Outlet
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface RoleRouteProps {
    allowedRoles: string[];
}

export default function RoleRoute({
    allowedRoles
}: RoleRouteProps) {
    const {
        hasAnyRole
    } = useAuth();

    if (!hasAnyRole(allowedRoles)) {
        return (
            <Navigate
                to="/forbidden"
                replace
            />
        );
    }

    return <Outlet />;
}