import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
    label: string;
    path?: string;
    roles?: string[];
    icon?: LucideIcon;
    children?: NavigationItem[];
}