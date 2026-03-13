"use client";

import { useState } from "react";
import { Bell, MessageSquare, AlertCircle, CheckCircle, X, Archive, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface Notification {
  id: string;
  type: "feedback" | "alert" | "success";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "alert",
    title: "Low Satisfaction Alert",
    message: "Hostel WiFi satisfaction dropped to 2.4 — below the alert threshold",
    time: "5 min ago",
    read: false,
    actionUrl: "/dashboard",
  },
  {
    id: "n2",
    type: "alert",
    title: "Issue Detected",
    message: "Online Course Portal is slow during peak hours — 31 reports received",
    time: "2 hours ago",
    read: false,
    actionUrl: "/dashboard",
  },
  {
    id: "n3",
    type: "feedback",
    title: "New Feedback Received",
    message: "12 new submissions across Cafeteria and Library services today",
    time: "3 hours ago",
    read: false,
    actionUrl: "/feedback",
  },
  {
    id: "n4",
    type: "success",
    title: "Weekly Report Ready",
    message: "Your weekly satisfaction summary is ready to download from Reports",
    time: "1 day ago",
    read: true,
    actionUrl: "/reports",
  },
  {
    id: "n5",
    type: "feedback",
    title: "Feedback Milestone",
    message: "Library service reached 300 total feedback submissions — great engagement!",
    time: "2 days ago",
    read: true,
  },
  {
    id: "n6",
    type: "success",
    title: "Issue Resolved",
    message: "Cafeteria waiting time issue has been marked as resolved by staff",
    time: "3 days ago",
    read: true,
    actionUrl: "/dashboard",
  },
];

function NotificationIcon({ type }: { type: Notification["type"] }) {
  switch (type) {
    case "feedback":
      return <MessageSquare className="h-3.5 w-3.5 text-blue-500" />;
    case "alert":
      return <AlertCircle className="h-3.5 w-3.5 text-amber-500" />;
    case "success":
      return <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />;
  }
}

const typeColors: Record<Notification["type"], string> = {
  alert: "bg-amber-50 dark:bg-amber-950/50",
  feedback: "bg-blue-50 dark:bg-blue-950/50",
  success: "bg-emerald-50 dark:bg-emerald-950/50",
};

type FilterTab = "all" | "unread" | "alerts";

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const displayed = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "alerts") return n.type === "alert";
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const archiveNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
      setOpen(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-0" align="end" forceMount>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="flex h-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex border-b border-border/50 px-4 py-2 gap-1">
          {(["all", "unread", "alerts"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                activeTab === tab
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="max-h-[380px] overflow-y-auto">
          <AnimatePresence>
            {displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Bell className="mb-2 h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">
                  {activeTab === "unread" ? "All caught up!" : "No notifications"}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {activeTab === "unread" ? "No unread notifications" : "Nothing here yet"}
                </p>
              </div>
            ) : (
              displayed.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "group relative flex cursor-pointer gap-3 border-b border-border/30 px-4 py-3.5 transition-colors hover:bg-muted/40",
                    !notification.read && "bg-primary/[0.03]"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {/* Unread dot */}
                  {!notification.read && (
                    <span className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    typeColors[notification.type]
                  )}>
                    <NotificationIcon type={notification.type} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn(
                        "text-sm leading-snug",
                        !notification.read ? "font-medium" : "text-muted-foreground"
                      )}>
                        {notification.title}
                      </p>
                      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {notification.actionUrl && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        )}
                        <button
                          onClick={(e) => archiveNotification(notification.id, e)}
                          className="rounded hover:text-foreground"
                          title="Archive"
                        >
                          <Archive className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">{notification.time}</p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-border/50 px-4 py-2.5">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground"
              onClick={() => setNotifications([])}
            >
              Clear all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
