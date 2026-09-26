import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Send, X, ShoppingBag, CreditCard, Sparkles, Loader2 } from "lucide-react";
import { notificationService, AppNotification } from "../../services/notification.service";

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateBadge?: () => void;
}

export default function NotificationCenterModal({
  isOpen,
  onClose,
  onUpdateBadge,
}: NotificationCenterModalProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications);
      onUpdateBadge?.();
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
      onUpdateBadge?.();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleSendTestNotification = async () => {
    setSendingTest(true);
    try {
      await notificationService.triggerTestOrder();
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to trigger test notification:", err);
    } finally {
      setSendingTest(false);
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.is_read) {
      notificationService.markAsRead(notif.id).catch(console.error);
    }
    onClose();
    navigate("/admin/orders");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* iOS Modal Card */}
      <div className="relative w-full max-w-lg bg-slate-900/95 text-white rounded-3xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh] backdrop-blur-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Bell className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-tight flex items-center gap-2">
                Order Notifications
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Admin Real-Time
                </span>
              </h3>
              <p className="text-xs text-slate-400">Push notification alerts for new customer orders</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs">
          <button
            onClick={handleSendTestNotification}
            disabled={sendingTest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 active:scale-95 disabled:opacity-50 transition-all shadow-sm"
          >
            {sendingTest ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Simulate Push Alert</span>
              </>
            )}
          </button>

          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-2" />
              <p className="text-xs">Loading order alerts...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 px-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-slate-500" />
              </div>
              <p className="font-semibold text-slate-300 text-sm">No notifications yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                When customers place or pay for orders, real-time push alerts will appear here.
              </p>
              <button
                onClick={handleSendTestNotification}
                className="mt-4 px-4 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Send Test Notification</span>
              </button>
            </div>
          ) : (
            notifications.map((notif) => {
              let parsed: any = {};
              try {
                if (notif.data) parsed = JSON.parse(notif.data);
              } catch {
                parsed = {};
              }

              const isPaid = notif.type === "ORDER_PAID";

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-start gap-3 my-1 hover:bg-white/10 ${
                    notif.is_read ? "opacity-75 bg-transparent" : "bg-white/5 border border-white/10"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      isPaid
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {isPaid ? <CreditCard className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        {notif.title}
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        )}
                      </h4>
                      {parsed.totalAmount && (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            isPaid
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          ₹{parsed.totalAmount.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                      <span>{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {parsed.customerName && <span>• {parsed.customerName}</span>}
                      {parsed.firstItemName && <span>• {parsed.firstItemName}</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-400">
          <span>Synced with Cloudflare D1 & Android Push</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg hover:bg-white/10 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
