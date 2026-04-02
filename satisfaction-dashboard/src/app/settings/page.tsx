"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
  Save,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-muted"
      )}
      onClick={() => onChange(!checked)}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  // College profile
  const [collegeName, setCollegeName] = useState("Demo University");
  const [contactEmail, setContactEmail] = useState("admin@demouniversity.edu");

  // Thresholds
  const [satisfactionThreshold, setSatisfactionThreshold] = useState("3.0");

  // Feedback collection
  const [collectAnonymous, setCollectAnonymous] = useState(false);
  const [autoThankYou, setAutoThankYou] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <ProtectedRoute allowedRoles={["college_admin", "student"]}>
      <AppShell title="Settings" description="Configure your dashboard preferences">
        <div className="max-w-2xl space-y-5">

          {/* College Profile */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <Card>
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Institution Profile</CardTitle>
                    <CardDescription>Basic details shown in reports and exports</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="space-y-1.5">
                  <Label htmlFor="college-name">College / University Name</Label>
                  <Input
                    id="college-name"
                    className="h-10 rounded-xl"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-email">Admin Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    className="h-10 rounded-xl"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Alert threshold */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card>
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Issue Detection Threshold</CardTitle>
                    <CardDescription>Alert when a service score drops below this level</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="space-y-2">
                  <Label htmlFor="threshold">Satisfaction Alert Threshold</Label>
                  <select
                    id="threshold"
                    className="flex h-10 w-full max-w-xs rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={satisfactionThreshold}
                    onChange={(e) => setSatisfactionThreshold(e.target.value)}
                  >
                      <option value="2.5">2.5 - Critical issues only</option>
                      <option value="3.0">3.0 - Alert on low scores (Recommended)</option>
                      <option value="3.5">3.5 - Alert on moderate decline</option>
                      <option value="4.0">4.0 - Alert on any decline</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    An issue is raised when a service&apos;s average satisfaction falls below this score
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feedback Collection */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            <Card>
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950">
                    <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Feedback Collection</CardTitle>
                    <CardDescription>Configure how students submit feedback</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Allow Anonymous Feedback</p>
                    <p className="text-xs text-muted-foreground">Students can submit feedback without sharing identity</p>
                  </div>
                  <Toggle checked={collectAnonymous} onChange={setCollectAnonymous} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Thank You Message</p>
                    <p className="text-xs text-muted-foreground">Show a confirmation screen after submission</p>
                  </div>
                  <Toggle checked={autoThankYou} onChange={setAutoThankYou} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="flex justify-end pb-2"
          >
            <Button onClick={handleSave} className="gap-2 rounded-xl" disabled={saved}>
              {saved ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
