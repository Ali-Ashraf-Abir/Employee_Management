import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";

import {
    HubConnectionBuilder,
    HubConnectionState
} from "@microsoft/signalr";

import apiClient, {
    getValidAccessToken
} from "../api/apiClient";
import { useAuth } from "./AuthContext";
import type { Notification } from "../types/notification";

interface NotificationContextValue {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext =
    createContext<NotificationContextValue | undefined>(
        undefined
    );

interface NotificationProviderProps {
    children: ReactNode;
}

const API_URL = import.meta.env.VITE_API_URL;

function mergeNotifications(
    current: Notification[],
    incoming: Notification[]
): Notification[] {
    const map = new Map<string, Notification>();

    for (const notification of current) {
        map.set(notification.id, notification);
    }

    for (const notification of incoming) {
        map.set(notification.id, notification);
    }

    return Array.from(map.values()).sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    );
}

export function NotificationProvider({
    children
}: NotificationProviderProps) {
    const { user, isAuthenticated } = useAuth();

    const [notifications, setNotifications] =
        useState<Notification[]>([]);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            setNotifications([]);
            return;
        }

        let cancelled = false;

        const connection =
            new HubConnectionBuilder()
                .withUrl(
                    `${API_URL}/hubs/notifications`,
                    {
                        accessTokenFactory: async () => {
                            return (
                                await getValidAccessToken()
                            ) ?? "";
                        }
                    }
                )
                .withAutomaticReconnect()
                .build();

        const handleNotification = (
            notification: Notification
        ) => {
            if (cancelled) {
                return;
            }

            setNotifications(previous =>
                mergeNotifications(
                    previous,
                    [notification]
                )
            );
        };

        const start = async () => {
            try {
                /*
                 * Register the SignalR handler BEFORE
                 * loading existing notifications.
                 */
                connection.on(
                    "NotificationReceived",
                    handleNotification
                );

                await connection.start();

                if (cancelled) {
                    return;
                }

                /*
                 * Load existing notifications.
                 */
                const existing =
                    await apiClient.get<Notification[]>(
                        "/api/notifications"
                    );

                if (cancelled) {
                    return;
                }

                /*
                 * Merge instead of replacing.
                 * This prevents duplicates if a realtime
                 * notification arrived while fetching.
                 */
                setNotifications(previous =>
                    mergeNotifications(
                        previous,
                        existing
                    )
                );
            } catch (error) {
                if (!cancelled) {
                    console.error(
                        "Failed to initialize notifications:",
                        error
                    );
                }
            }
        };

        start();

        return () => {
            cancelled = true;

            connection.off(
                "NotificationReceived",
                handleNotification
            );

            if (
                connection.state !==
                HubConnectionState.Disconnected
            ) {
                connection.stop();
            }
        };
    }, [isAuthenticated, user?.id]);

    const markAsRead = async (id: string) => {
        await apiClient.patch(
            `/api/notifications/${id}/read`
        );

        setNotifications(previous =>
            previous.map(notification =>
                notification.id === id
                    ? {
                        ...notification,
                        isRead: true
                    }
                    : notification
            )
        );
    };

    const markAllAsRead = async () => {
        await apiClient.patch(
            "/api/notifications/read-all"
        );

        setNotifications(previous =>
            previous.map(notification => ({
                ...notification,
                isRead: true
            }))
        );
    };

    const unreadCount =
        notifications.filter(
            notification => !notification.isRead
        ).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context =
        useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useNotifications must be used inside NotificationProvider"
        );
    }

    return context;
}