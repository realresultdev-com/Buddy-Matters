import { LocalNotifications } from "@capacitor/local-notifications";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";
import { Haptics, NotificationType } from "@capacitor/haptics";
import { playIosChime } from "../utils/sound";
import { api } from "./api";

export interface AppNotification {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: string;
  data: string | null;
  is_read: number;
  created_at: string;
}

export interface ParsedNotificationData {
  orderId?: string;
  shortOrderId?: string;
  totalAmount?: number;
  customerName?: string;
  customerEmail?: string;
  itemsCount?: number;
  firstItemName?: string;
  isTest?: boolean;
  createdAt?: string;
}

type NotificationListener = (notif: AppNotification, parsedData: ParsedNotificationData) => void;

class NotificationService {
  private listeners: Set<NotificationListener> = new Set();
  private pollingInterval: ReturnType<typeof setInterval> | null = null;
  private isInitialized = false;
  private lastSeenNotifId: string | null = localStorage.getItem("last_seen_notif_id");

  /**
   * Initialize native channels and action listeners
   */
  async init(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (Capacitor.isNativePlatform()) {
      try {
        // 1. Local Notifications Permissions & Channel
        const perm = await LocalNotifications.checkPermissions();
        if (perm.display !== "granted") {
          await LocalNotifications.requestPermissions();
        }

        // Create high-priority Android channel for Order notifications on both LocalNotifications and PushNotifications
        await LocalNotifications.createChannel({
          id: "orders_channel",
          name: "Order Notifications",
          description: "Instant high-priority alerts when customer places an order",
          importance: 5, // High / Heads-up
          visibility: 1, // Public on lock screen
          vibration: true,
          lights: true,
          lightColor: "#f59e0b",
        });

        try {
          await PushNotifications.createChannel({
            id: "orders_channel",
            name: "Order Notifications",
            description: "Instant high-priority alerts when customer places an order",
            importance: 5,
            visibility: 1,
            vibration: true,
            lights: true,
            lightColor: "#f59e0b",
          });
        } catch (e) {
          console.warn("PushNotifications.createChannel fallback:", e);
        }

        // Listen for user tap on local notification
        LocalNotifications.addListener("localNotificationActionPerformed", () => {
          const userStr = localStorage.getItem("user");
          let isAdmin = false;
          try {
            if (userStr) {
              const u = JSON.parse(userStr);
              isAdmin = u.role === "ADMIN";
            }
          } catch {}
          window.location.href = isAdmin ? `/admin/orders` : `/user/orders`;
        });

        // 2. Firebase Cloud Messaging (FCM) Remote Push Notifications
        const pushPerm = await PushNotifications.checkPermissions();
        if (pushPerm.receive !== "granted") {
          await PushNotifications.requestPermissions();
        }

        // Register device with FCM / APNs
        await PushNotifications.register();

        // Listen for device FCM registration token
        PushNotifications.addListener("registration", async (token) => {
          console.log("Device FCM registration token received:", token.value);
          localStorage.setItem("fcm_device_token", token.value);
          await this.syncDeviceToken(token.value);
        });

        PushNotifications.addListener("registrationError", (err) => {
          console.warn("FCM registration error:", err);
        });

        // Listen for remote push notifications received while app is in foreground
        PushNotifications.addListener("pushNotificationReceived", async (notification) => {
          console.log("FCM push notification received in foreground:", notification);
          const notifItem: AppNotification = {
            id: notification.id || `fcm-${Date.now()}`,
            user_id: null,
            title: notification.title || "🛍️ New Order Alert",
            message: notification.body || "New order placed by customer",
            type: (notification.data?.type as string) || "ORDER_CREATED",
            data: JSON.stringify(notification.data || {}),
            is_read: 0,
            created_at: new Date().toISOString(),
          };
          await this.triggerAlert(notifItem);
        });

        // Listen for user tap on native system tray push notification
        PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
          console.log("User tapped FCM push notification:", action);
          const userStr = localStorage.getItem("user");
          let isAdmin = false;
          try {
            if (userStr) {
              const u = JSON.parse(userStr);
              isAdmin = u.role === "ADMIN";
            }
          } catch {}
          window.location.href = isAdmin ? `/admin/orders` : `/user/orders`;
        });

        // Immediately sync existing token if already stored on device
        const existingToken = localStorage.getItem("fcm_device_token");
        if (existingToken) {
          await this.syncDeviceToken(existingToken);
        }
      } catch (err) {
        console.warn("Native Push/LocalNotifications setup skipped or failed:", err);
      }
    }
  }

  /**
   * Subscribe to incoming notifications
   */
  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Trigger in-app + native device push notification alert
   */
  async triggerAlert(notif: AppNotification): Promise<void> {
    let parsedData: ParsedNotificationData = {};
    try {
      if (notif.data) {
        parsedData = JSON.parse(notif.data);
      }
    } catch {
      parsedData = {};
    }

    // 1. Play crystal-clear synthesized iOS chime
    playIosChime();

    // 2. Trigger high-end iOS haptic feedback
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      // Haptics not available on non-mobile browsers
    }

    // 3. Emit to in-app iOS Banner component
    Array.from(this.listeners).forEach((listener) => listener(notif, parsedData));

    // 4. Schedule Native Android System Notification
    if (Capacitor.isNativePlatform()) {
      try {
        // Generate an integer ID for Android notification manager
        const numId = Math.abs(
          notif.id.split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
        ) % 1000000;

        // Post immediate local system notification without AlarmManager/exact alarms
        await LocalNotifications.schedule({
          notifications: [
            {
              id: numId,
              title: notif.title,
              body: notif.message,
              channelId: "orders_channel",
              smallIcon: "ic_launcher",
              largeIcon: "ic_launcher",
              // CRITICAL: Disable exact alarm so Android never opens the "Alarms & Reminders" settings screen
              // @ts-ignore
              isExactNotification: false,
              // @ts-ignore
              isExactMandatory: false,
              extra: {
                notifId: notif.id,
                orderId: parsedData.orderId,
              },
            },
          ],
        });
      } catch (err) {
        console.error("Failed to post native Android notification:", err);
      }
    }
  }

  /**
   * Start polling for notifications when an admin user is logged in
   */
  startAdminPolling(): void {
    this.stopAdminPolling();

    // Ensure FCM token is synced to database for admin
    this.syncDeviceToken();

    // Perform immediate check
    this.checkNewNotifications();

    // Poll every 5 seconds for real-time responsiveness
    this.pollingInterval = setInterval(() => {
      // Only poll when window is visible or active to conserve battery
      if (!document.hidden) {
        this.checkNewNotifications();
      }
    }, 5000);
  }

  /**
   * Stop polling
   */
  stopAdminPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /**
   * Check for new notifications from server
   */
  async checkNewNotifications(): Promise<AppNotification[]> {
    try {
      const res = await api.get("/notifications");
      const notifs: AppNotification[] = Array.isArray(res.data?.notifications) ? res.data.notifications : [];

      if (!notifs.length) return [];

      const latestNotif = notifs[0];

      // If first run, set the last seen to prevent alert bomb on login
      if (!this.lastSeenNotifId) {
        this.lastSeenNotifId = latestNotif.id;
        localStorage.setItem("last_seen_notif_id", latestNotif.id);
        return notifs;
      }

      // Check if there are notifications newer than lastSeenNotifId
      const newItems: AppNotification[] = [];
      for (const item of notifs) {
        if (item.id === this.lastSeenNotifId) break;
        newItems.push(item);
      }

      if (newItems.length > 0) {
        // Update last seen
        this.lastSeenNotifId = latestNotif.id;
        localStorage.setItem("last_seen_notif_id", latestNotif.id);

        // Alert for each new notification (most recent first)
        for (const notif of newItems) {
          await this.triggerAlert(notif);
        }
      }

      return notifs;
    } catch {
      // Ignore network errors during polling
      return [];
    }
  }

  /**
   * Send a test order notification to test the push notification and iOS banner
   */
  async triggerTestOrder(): Promise<AppNotification | null> {
    try {
      const res = await api.post("/admin/notifications/test");
      if (res.data?.notification) {
        const notif: AppNotification = res.data.notification;
        await this.triggerAlert(notif);
        return notif;
      }
      return null;
    } catch (err) {
      console.error("Failed to trigger test order notification:", err);
      throw err;
    }
  }

  /**
   * Fetch notification list
   */
  async getNotifications(): Promise<{ notifications: AppNotification[]; unreadCount: number }> {
    const res = await api.get("/notifications");
    return {
      notifications: Array.isArray(res.data?.notifications) ? res.data.notifications : [],
      unreadCount: res.data.unreadCount || 0,
    };
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  }

  /**
   * Mark all as read
   */
  /**
   * Mark all as read
   */
  async markAllAsRead(): Promise<void> {
    await api.post("/notifications/mark-all-read");
  }

  /**
   * Sync native FCM device token to backend for instant push notifications
   * Works for both authenticated users and newly installed guest devices
   */
  async syncDeviceToken(customToken?: string): Promise<void> {
    const token = customToken || localStorage.getItem("fcm_device_token");
    if (!token) return;

    try {
      await api.post("/notifications/fcm-token", {
        token,
        platform: Capacitor.getPlatform() || "android",
      });
      console.log("FCM device token synced with backend for instant push notifications");
    } catch (err) {
      console.warn("Failed to sync FCM device token:", err);
    }
  }

  /**
   * Unbind user on logout while preserving device notification capabilities
   */
  async removeDeviceToken(): Promise<void> {
    const token = localStorage.getItem("fcm_device_token");
    if (!token) return;
    try {
      await api.delete("/notifications/fcm-token", { data: { token } });
    } catch (err) {
      console.warn("Failed to remove FCM device token:", err);
    }
  }
}

export const notificationService = new NotificationService();

