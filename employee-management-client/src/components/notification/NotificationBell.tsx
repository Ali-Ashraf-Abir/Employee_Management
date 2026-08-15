import {
    useEffect,
    useRef,
    useState
} from "react";
import { useNavigate } from "react-router-dom";

import { useNotifications } from "../../context/NotificationContext";

import type { Notification } from "../../types/notification";
import NotificationDropdown from "./NotificationDropDown";
import { handleNotificationAction } from "../../notification/NotificationActions";
import { LucideBell } from "lucide-react";



export default function NotificationBell() {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead
    } = useNotifications();

    const navigate = useNavigate();

    const [open, setOpen] =
        useState(false);

    const containerRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (
            event: MouseEvent
        ) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node
                )
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const handleNotificationClick = async (
        notification: Notification
    ) => {
        if (!notification.isRead) {
            await markAsRead(notification.id);
        }

        setOpen(false);

        handleNotificationAction(
            notification,
            navigate
        );
    };

    return (
        <div
            ref={containerRef}
            className="notification-wrapper"
        >
            <button
                type="button"
                className={`notification-button ${
                    open
                        ? "notification-button-active"
                        : ""
                }`}
                onClick={() =>
                    setOpen(previous => !previous)
                }
                aria-label="Notifications"
                aria-expanded={open}
            >
                <span className="notification-bell">
                    <LucideBell/>
                </span>

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <NotificationDropdown
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                    onNotificationClick={
                        handleNotificationClick
                    }
                    onClose={() =>
                        setOpen(false)
                    }
                />
            )}
        </div>
    );
}