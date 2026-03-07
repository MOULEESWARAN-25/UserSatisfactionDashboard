"use client";

import { useState } from "react";
import { Bell, MessageSquare, AlertCircle, CheckCircle, X } from "lucide-react";
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
}

// Mock notifications
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "feedback",
    title: "New Feedback Received",
    message: "5 new feedback submissions for Cafeteria service",
    time: "5 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "alert",
    title: "Low Satisfaction Alert",
    message: "Online Course Portal satisfaction dropped below 3.5",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "n3",
    type: "success",
    title: "Weekly Report Ready",
    message: "Your weekly satisfaction report is ready to view",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "n4",
    type: "feedback",
    title: "Feedback Milestone",
    message: "Library service reached 300 total feedback submissions",
    time: "1 day ago",
    read: true,
  },
];

function NotificationIcon({ type }: { type: Notification["type"] }) {
  switch (type) {
    case "feedback":
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case "alert":
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case "success":
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
  }
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
              className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground"
            >
              {unreadCount}
            </motion.span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 p-0"
        align="end"
        forceMount
      >
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            ) : (
              notifications.map((notification, idx) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "group relative flex gap-3 border-b border-border/30 px-4 py-3 transition-colors hover:bg-muted/50",
                    !notification.read && "bg-primary/5"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <NotificationIcon type={notification.type} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm", !notification.read && "font-medium")}>
                        {notification.title}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="absolute left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
