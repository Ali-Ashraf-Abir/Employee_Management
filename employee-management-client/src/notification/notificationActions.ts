import type { NavigateFunction } from "react-router-dom";
import type { Notification } from "../types/notification";

type NotificationAction = (
    notification: Notification,
    navigate: NavigateFunction
) => void;

const notificationActions: Record<
    string,
    NotificationAction
> = {
    LeaveRequestCreated: (
        notification,
        navigate
    ) => {
        if (!notification.referenceId) {
            return;
        }

        navigate(
            `/leave/requests-admin/${notification.referenceId}`
        );
    },

    LeaveRequestApproved: (
        notification,
        navigate
    ) => {
        if (!notification.referenceId) {
            return;
        }

        navigate(
            `/leave/requests/${notification.referenceId}`
        );
    },

    LeaveRequestRejected: (
        notification,
        navigate
    ) => {
        if (!notification.referenceId) {
            return;
        }

        navigate(
            `/leave/requests/${notification.referenceId}`
        );
    },

    Announcement: (
        notification,
        navigate
    ) => {
        if (!notification.referenceId) {
            return;
        }

        navigate(
            `/announcements/${notification.referenceId}`
        );
    },

    EmployeeBlocked: (
        notification,
        navigate
    ) => {
        if (!notification.referenceId) {
            return;
        }

        navigate(
            `/employees/${notification.referenceId}`
        );
    }
};

export function handleNotificationAction(
    notification: Notification,
    navigate: NavigateFunction
) {
    const action =
        notificationActions[notification.type];

    if (!action) {
        return;
    }

    action(notification, navigate);
}