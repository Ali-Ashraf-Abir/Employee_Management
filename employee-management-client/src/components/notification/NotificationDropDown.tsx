import type { Notification } from "../../types/notification";
import NotificationItem from "./NotificationItem";

interface NotificationDropdownProps {
    notifications: Notification[];
    unreadCount: number;
    onRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onNotificationClick: (
        notification: Notification
    ) => void;
    onClose: () => void;
}
export default function NotificationDropdown({
    notifications,
    unreadCount,
    onRead,
    onMarkAllAsRead,
    onNotificationClick,
    onClose
}: NotificationDropdownProps) {
    return (
        <div className="notification-dropdown">
            <div className="notification-dropdown-header">
                <div>
                    <h3>Notifications</h3>

                    {unreadCount > 0 && (
                        <span>
                            {unreadCount} unread
                        </span>
                    )}
                </div>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        className="notification-mark-all"
                        onClick={onMarkAllAsRead}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="notification-list">
                {notifications.length === 0 ? (
                    <div className="notification-empty">
                        <div className="notification-empty-icon">
                            🔔
                        </div>

                        <strong>
                            No notifications
                        </strong>

                        <span>
                            You're all caught up.
                        </span>
                    </div>
                ) : (
                    notifications.map(
                        notification => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onRead={onRead}
                                onClick={onNotificationClick}
                            />
                        )
                    )
                )}
            </div>

            {notifications.length > 0 && (
                <div className="notification-dropdown-footer">
                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}