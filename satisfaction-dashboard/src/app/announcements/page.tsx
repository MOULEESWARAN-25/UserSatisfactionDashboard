"use client";

import { motion } from "framer-motion";
import { Megaphone, ArrowRightLeft, Clock3, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const IMPACT_UPDATES = [
  {
    id: "cafeteria-wait-time",
    service: "Cafeteria",
    issue: "Long waiting time during lunch",
    before: "Average wait time: 25 minutes",
    after: "Average wait time: 12 minutes",
    action: "Added 2 serving counters and staggered queue lanes.",
    date: "Feb 2026",
  },
  {
    id: "hostel-wifi",
    service: "Hostel",
    issue: "Unstable WiFi in evening hours",
    before: "Frequent drops on floors 3 and 4",
    after: "Stable connection across all blocks",
    action: "Installed additional access points and upgraded routers.",
    date: "Jan 2026",
  },
  {
    id: "library-hours",
    service: "Library",
    issue: "Limited hours during exam prep",
    before: "Closed at 6:00 PM",
    after: "Open until 10:00 PM on weekdays",
    action: "Extended staffing schedule based on student requests.",
    date: "Dec 2025",
  },
];

export default function AnnouncementsPage() {
  return (
    <ProtectedRoute allowedRoles={["college_admin", "student"]}>
      <AppShell
        title="Feedback Impact"
        description="What changed based on student feedback"
      >
        <div className="space-y-5">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex items-start gap-3 p-4">
              <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
                <Megaphone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Your feedback creates real change</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  These updates were prioritized and completed after repeated student feedback.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {IMPACT_UPDATES.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base">{item.service}</CardTitle>
                      <Badge variant="outline" className="rounded-full text-xs">
                        <Clock3 className="mr-1 h-3 w-3" />
                        {item.date}
                      </Badge>
                    </div>
                    <CardDescription>{item.issue}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                      <p className="text-xs text-muted-foreground">Before</p>
                      <p className="text-sm">{item.before}</p>
                    </div>
                    <div className="flex items-center justify-center text-muted-foreground">
                      <ArrowRightLeft className="h-4 w-4" />
                    </div>
                    <div className="space-y-2 rounded-lg border bg-emerald-50/50 p-3 dark:bg-emerald-950/20">
                      <p className="text-xs text-muted-foreground">After</p>
                      <p className="text-sm font-medium">{item.after}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Action Taken
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.action}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
