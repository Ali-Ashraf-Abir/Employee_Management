import {
    useEffect,
    useState
} from "react";

import {
    NavLink,
    useLocation
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import type {
    NavigationItem
} from "../navigation/navigation";

import {
    navigationItems
} from "../navigation/NavigationItems";
interface SidebarProps {
    collapsed: boolean;
    mobileOpen: boolean;
    onCloseMobile: () => void;
}
export default function Sidebar({
    collapsed,
    mobileOpen,
    onCloseMobile
}: SidebarProps) {
    const { hasAnyRole } = useAuth();

    const location = useLocation();

    const visibleItems =
        navigationItems.filter(item =>
            canAccess(item, hasAnyRole)
        );

    return (
        <aside
            className={[
                "sidebar",
                collapsed
                    ? "sidebar-collapsed"
                    : "",
                mobileOpen
                    ? "sidebar-mobile-open"
                    : ""
            ].join(" ")}
        >
            <div className="sidebar-brand">
                <div className="sidebar-brand-mark">
                    EM
                </div>

                <span className="sidebar-brand-label">
                    Employee Management
                </span>

                <button
                    type="button"
                    className="sidebar-mobile-close"
                    onClick={onCloseMobile}
                    aria-label="Close navigation"
                >
                    ×
                </button>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section-label">
                    Workspace
                </div>

                {visibleItems.map(item => (
                    <SidebarItem
                        key={
                            item.path ??
                            item.label
                        }
                        item={item}
                        hasAnyRole={hasAnyRole}
                        currentPath={
                            location.pathname
                        }
                    />
                ))}
            </nav>
        </aside>
    );
}

function SidebarItem({
    item,
    hasAnyRole,
    currentPath
}: {
    item: NavigationItem;
    hasAnyRole: (roles: string[]) => boolean;
    currentPath: string;
}) {
    const visibleChildren =
        item.children?.filter(child =>
            canAccess(child, hasAnyRole)
        ) ?? [];

    const hasChildren =
        visibleChildren.length > 0;

    const isChildActive =
        visibleChildren.some(child =>
            child.path
                ? currentPath === child.path ||
                currentPath.startsWith(`${child.path}/`)
                : false
        );

    const [open, setOpen] =
        useState(isChildActive);

    useEffect(() => {
        if (isChildActive) {
            setOpen(true);
        }
    }, [isChildActive]);

    if (hasChildren) {
        return (
            <div className="sidebar-group">
                <button
                    type="button"
                    className="sidebar-link sidebar-group-button"
                    onClick={() =>
                        setOpen(current => !current)
                    }
                >
                    {item.icon && (
                        <item.icon className="sidebar-icon" />
                    )}

                    <span className="sidebar-label">
                        {item.label}
                    </span>

                    <span
                        className={
                            open
                                ? "sidebar-chevron open"
                                : "sidebar-chevron"
                        }
                    >
                        ›
                    </span>
                </button>

                {open && (
                    <div className="sidebar-children">
                        {visibleChildren.map(child => {
                            const Icon = child.icon;

                            return (
                                <NavLink
                                    key={
                                        child.path ??
                                        child.label
                                    }
                                    to={child.path!}
                                    end
                                    title={child.label}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "sidebar-link sidebar-child active"
                                            : "sidebar-link sidebar-child"
                                    }
                                >
                                    {Icon && (
                                        <Icon className="sidebar-icon" />
                                    )}

                                    <span className="sidebar-label">
                                        {child.label}
                                    </span>
                                </NavLink>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    if (!item.path) {
        return null;
    }

    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            end
            title={item.label}
            className={({ isActive }) =>
                isActive
                    ? "sidebar-link sidebar-group-button active"
                    : "sidebar-link sidebar-group-button"
            }
        >
            {Icon && (
                <Icon className="sidebar-icon" />
            )}

            <span className="sidebar-label">
                {item.label}
            </span>
        </NavLink>
    );
}

function canAccess(
    item: NavigationItem,
    hasAnyRole: (roles: string[]) => boolean
) {
    if (!item.roles) {
        return true;
    }

    return hasAnyRole(item.roles);
}