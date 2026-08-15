import {
    BookOpen,
    Check,
    X,
    Lock,
    Unlock,
    Megaphone,
    Bell
} from "lucide-react";
import type { Notification } from "../../types/notification";

interface NotificationItemProps {
    notification: Notification;
    onRead: (id: string) => void;
    onClick: (
        notification: Notification
    ) => void;
}

export default function NotificationItem({
    notification,
    onClick
}: NotificationItemProps) {
    const handleClick = () => {
        onClick(notification);
    };

    return (
        <button
            type="button"
            className={`notification-item ${
                notification.isRead
                    ? ""
                    : "notification-item-unread"
            }`}
            onClick={handleClick}
        >
            <div className="notification-item-icon">
                {getNotificationIcon(
                    notification.type
                )}
            </div>

            <div className="notification-item-content">
                <div className="notification-item-title">
                    {notification.title}

                    {!notification.isRead && (
                        <span className="notification-unread-dot" />
                    )}
                </div>

                <div className="notification-item-message">
                    {notification.message}
                </div>

                <div className="notification-item-time">
                    {formatNotificationDate(
                        new Date(
                            notification.createdAt
                        )
                    )}
                </div>
            </div>
        </button>
    );
}

function getNotificationIcon(type: string) {
    switch (type) {
        case "LeaveRequestCreated":
            return <BookOpen size={18} />;

        case "LeaveRequestApproved":
            return <Check size={18} />;

        case "LeaveRequestRejected":
            return <X size={18} />;

        case "EmployeeBlocked":
            return <Lock size={18} />;

        case "EmployeeUnblocked":
            return <Unlock size={18} />;

        case "Announcement":
            return <Megaphone size={18} />;

        default:
            return <Bell size={18} />;
    }
}

function formatNotificationDate(date: Date) {
    const now = new Date();

    const difference =
        now.getTime() - date.getTime();

    const minutes = Math.floor(
        difference / 60000
    );

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days}d ago`;
    }

    return date.toLocaleDateString();
}