import {
    LayoutDashboard,
    Users,
    CalendarDays,
    CalendarClock,
    ClipboardList,
    Clock3,
    ClipboardCheck,
    FileBarChart
} from "lucide-react";

import type { NavigationItem } from "./navigation";

export const navigationItems: NavigationItem[] = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard
    },
    {
        label: "Employees",
        path: "/employees",
        roles: ["Admin", "HR"],
        icon: Users
    },
    {
        label: "Leave",
        icon: CalendarDays,
        children: [
            {
                label: "My Leave",
                path: "/leave",
                icon: CalendarClock
            },
            {
                label: "Leave Types",
                path: "/leave/types",
                roles: ["Admin", "HR"],
                icon: ClipboardList
            },
            {
                label: "All Requests",
                path: "/leave/all-requests",
                roles: ["Admin", "HR"],
                icon: ClipboardCheck
            }
        ]
    },
    {
        label: "Attendance",
        icon: Clock3,
        children: [
            {
                label: "My Attendance",
                path: "/attendance",
                icon: Clock3
            },
            {
                label: "Attendance",
                path: "/admin/attendance",
                roles: ["Admin", "HR"],
                icon: ClipboardCheck
            },
            {
                label: "Attendance Report",
                path: "/admin/attendance/report",
                roles: ["Admin", "HR"],
                icon: FileBarChart
            }
        ]
    }
];