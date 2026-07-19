import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/notification.api";
import { useAuth } from "../context/useAuth";

const Notifications = () => {
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setPageLoading(true);
      const res = await getNotifications();
      setNotifications(res?.data?.data?.notifications || []);
      setUnreadCount(res?.data?.data?.unreadCount || 0);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkRead = async (notificationId) => {
    await markNotificationRead(notificationId);
    await fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setMessage("All notifications marked as read.");
    await fetchNotifications();
  };

  if (loading || pageLoading) return <h2>Loading notifications...</h2>;

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl rounded-xl border border-neutral-200 bg-white p-10 text-center">
        <h1 className="text-2xl font-bold">Login to view notifications</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Updates from channels you follow will appear here.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Login
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-red-600">Activity center</p>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="mt-2 text-sm text-neutral-500">
            {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white disabled:bg-neutral-300"
        >
          Mark all read
        </button>
      </div>

      {message && (
        <div className="mb-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm">
          {message}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center">
          <h2 className="font-bold">No notifications yet</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Subscribe to creators and new uploads will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
          {notifications.map((notification) => (
            <article
              key={notification._id}
              className={[
                "grid gap-4 p-4 sm:grid-cols-[48px_1fr_auto] sm:items-center",
                notification.isRead ? "bg-white" : "bg-red-50/50",
              ].join(" ")}
            >
              <img
                src={notification.sender?.avatar}
                alt={notification.sender?.username || "sender"}
                className="h-12 w-12 rounded-full object-cover"
              />

              <div>
                <p className="font-semibold text-neutral-950">
                  {notification.message}
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  From @{notification.sender?.username || "creator"} ·{" "}
                  {new Date(notification.createdAt).toLocaleString()}
                </p>

                {notification.video?._id && (
                  <Link
                    to={`/watch/${notification.video._id}`}
                    className="mt-2 inline-flex text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Watch video
                  </Link>
                )}
              </div>

              {!notification.isRead && (
                <button
                  onClick={() => handleMarkRead(notification._id)}
                  className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-100"
                >
                  Mark read
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Notifications;