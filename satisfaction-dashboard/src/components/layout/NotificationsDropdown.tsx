"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, MessageSquare, AlertCircle, CheckCircle, X,
  Archive, ExternalLink, Settings, TrendingDown, Info,
} from "lucide-react";
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
  type: "feedback" | "alert" | "success" | "system";
  urgency?: "critical" | "high" | "normal";
  title: string;
  message: string;
  time: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

// Base reference: March 13 2026 10:35 IST
const NOW = new Date("2026-03-13T05:05:00Z"); // UTC equivalent

function makeDate(minsAgo: number): Date {
  return new Date(NOW.getTime() - minsAgo * 60 * 1000);
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "alert",
    urgency: "critical",
    title: "Critical: WiFi Satisfaction Dropped",
    message: "Hostel WiFi satisfaction fell to 2.4/5 — 18% below the alert threshold. 41 students reported connectivity issues this morning.",
    time: makeDate(8),
    read: false,
    actionUrl: "/dashboard",
    actionLabel: "View Issues",
  },
  {
    id: "n2",
    type: "alert",
    urgency: "high",
    title: "Online Portal Slowness Detected",
    message: "Online Course Portal response times spiked during 9–10 AM peak hours. 31 student complaints logged in the last hour.",
    time: makeDate(62),
    read: false,
    actionUrl: "/dashboard",
    actionLabel: "View Dashboard",
  },
  {
    id: "n3",
    type: "alert",
    urgency: "high",
    title: "Cafeteria Wait Time Spike",
    message: "Average wait time at Cafeteria rose to 22 minutes — 3× the normal baseline. Staff have been notified.",
    time: makeDate(140),
    read: false,
    actionUrl: "/dashboard",
    actionLabel: "View Issues",
  },
  {
    id: "n4",
    type: "feedback",
    urgency: "normal",
    title: "New Feedback Batch Received",
    message: "47 new submissions today — 12 for Library, 18 for Cafeteria, 17 for Sports Complex. Response rate is up 6%.",
    time: makeDate(210),
    read: false,
    actionUrl: "/feedback",
    actionLabel: "Review Feedback",
  },
  {
    id: "n5",
    type: "success",
    urgency: "normal",
    title: "Weekly Report Ready",
    message: "Your weekly satisfaction summary for Mar 6–12 is ready. Overall score: 3.9/5 (+0.2 vs last week).",
    time: makeDate(1440), // 1 day
    read: true,
    actionUrl: "/reports",
    actionLabel: "Open Report",
  },
  {
    id: "n6",
    type: "success",
    urgency: "normal",
    title: "Issue Resolved: Transport Delays",
    message: "The campus transport delay complaint cluster has been marked resolved by the Transport Department. 28 students notified.",
    time: makeDate(2880), // 2 days
    read: true,
    actionUrl: "/dashboard",
  },
  {
    id: "n7",
    type: "feedback",
    urgency: "normal",
    title: "Feedback Milestone: Library",
    message: "Library service crossed 500 total submissions — the most engaged service this semester. Great student participation!",
    time: makeDate(4320), // 3 days
    read: true,
  },
  {
    id: "n8",
    type: "system",
    urgency: "normal",
    title: "AI Analysis Completed",
    message: "Groq AI finished analyzing this week's feedback data. 9 insights generated — 3 high priority recommendations available.",
    time: makeDate(1560),
    read: true,
    actionUrl: "/analytics",
    actionLabel: "View Insights",
  },
];

function timeAgo(date: Date): string {
  const diffMs = NOW.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return "yesterday";
  return `${diffDays}d ago`;
}

const typeConfig: Record<
  Notification["type"],
  { icon: React.ComponentType<{ className?: string }>; iconColor: string; bgColor: string; label: string }
> = {
  alert: {
    icon: AlertCircle,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/60",
    label: "Alert",
  },
  feedback: {
    icon: MessageSquare,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/60",
    label: "Feedback",
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/60",
    label: "Success",
  },
  system: {
    icon: Settings,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/60",
    label: "System",
  },
};

const urgencyAccent: Record<NonNullable<Notification["urgency"]>, string> = {
  critical: "border-l-2 border-l-rose-500",
  high: "border-l-2 border-l-amber-500",
  normal: "",
};

type FilterTab = "all" | "unread" | "alerts";

export function NotificationsDropdown() {
  const router = useRouter();
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
      setOpen(false);
      router.push(notification.actionUrl);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg"
          aria-label="Open notifications"
        >
          <motion.div
            animate={unreadCount > 0 ? { rotate: [0, -10, 10, -8, 8, 0] } : {}}
            transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatDelay: 8 }}
          >
            <Bell className="h-4 w-4" />
          </motion.div>
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-96 p-0" align="end" forceMount>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex h-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary"
              >
                {unreadCount} new
              </motion.span>
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
        <div className="flex gap-1 border-b border-border/50 px-4 py-2">
          {(["all", "unread", "alerts"] as FilterTab[]).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "secondary" : "ghost"}
              size="sm"
              className="h-7 rounded-md px-2.5 text-xs capitalize"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === "unread" && unreadCount > 0 && (
                <span className="ml-1 rounded-full bg-primary/20 px-1 text-[10px] font-semibold text-primary">
                  {unreadCount}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Notification list */}
        <div className="max-h-[420px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {displayed.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <Bell className="mb-2 h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">
                  {activeTab === "unread" ? "All caught up!" : "No notifications"}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {activeTab === "unread" ? "No unread notifications" : "Nothing here yet"}
                </p>
              </motion.div>
            ) : (
              displayed.map((notification) => {
                const config = typeConfig[notification.type];
                const IconComponent = config.icon;
                const accentClass = urgencyAccent[notification.urgency ?? "normal"];

                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
                    transition={{ duration: 0.18 }}
                    className={cn(
                      "group relative flex cursor-pointer gap-3 border-b border-border/30 px-4 py-3.5 transition-colors hover:bg-muted/40",
                      !notification.read && "bg-primary/[0.03]",
                      accentClass
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Unread dot */}
                    {!notification.read && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary"
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        config.bgColor
                      )}
                    >
                      <IconComponent className={cn("h-3.5 w-3.5", config.iconColor)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-0.5 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm leading-snug",
                            !notification.read ? "font-semibold" : "font-medium text-muted-foreground"
                          )}
                        >
                          {notification.title}
                        </p>
                        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {notification.actionUrl && (
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded text-muted-foreground hover:text-foreground"
                            onClick={(e) => archiveNotification(notification.id, e)}
                            title="Dismiss"
                          >
                            <Archive className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-muted-foreground/60">{timeAgo(notification.time)}</p>
                        {notification.actionLabel && (
                          <>
                            <span className="text-[10px] text-muted-foreground/40">·</span>
                            <span className="text-[10px] font-medium text-primary hover:underline">
                              {notification.actionLabel} →
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setOpen(false);
                router.push("/dashboard");
              }}
            >
              View all on Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-destructive"
              onClick={() => setNotifications([])}
            >
              Clear all
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
