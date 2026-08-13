import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MasterLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(false);

    const [mobileSidebarOpen, setMobileSidebarOpen] =
        useState(false);

    return (
        <div
            className={
                sidebarCollapsed
                    ? "app-layout sidebar-collapsed"
                    : "app-layout"
            }
        >
            <Sidebar
                collapsed={sidebarCollapsed}
                mobileOpen={mobileSidebarOpen}
                onCloseMobile={() =>
                    setMobileSidebarOpen(false)
                }
            />

            {mobileSidebarOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() =>
                        setMobileSidebarOpen(false)
                    }
                />
            )}

            <div className="app-main">
                <Header
                    sidebarCollapsed={sidebarCollapsed}
                    mobileSidebarOpen={mobileSidebarOpen}
                    onToggleSidebar={() =>
                        setSidebarCollapsed(
                            current => !current
                        )
                    }
                    onToggleMobileSidebar={() =>
                        setMobileSidebarOpen(
                            current => !current
                        )
                    }
                />

                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}