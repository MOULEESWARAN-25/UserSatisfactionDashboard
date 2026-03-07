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
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { 
  Settings, 
  Bell, 
  Save, 
  Palette, 
  MessageSquare, 
  Download, 
  CheckCircle,
  Mail,
  Clock,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Simple toggle switch component
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
  
  // Dashboard Settings
  const [defaultView, setDefaultView] = useState("dashboard");
  const [showTrends, setShowTrends] = useState(true);
  const [showRecentFeedback, setShowRecentFeedback] = useState(true);
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [lowSatisfactionAlerts, setLowSatisfactionAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [feedbackNotifications, setFeedbackNotifications] = useState(true);
  
  // Feedback Settings
  const [autoThankYou, setAutoThankYou] = useState(true);
  const [collectAnonymous, setCollectAnonymous] = useState(true);
  const [satisfactionThreshold, setSatisfactionThreshold] = useState("3.5");
  
  // Export Settings
  const [exportFormat, setExportFormat] = useState("csv");
  const [includeComments, setIncludeComments] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "student"]}>
      <AppShell title="Settings" description="Configure your dashboard preferences">
        <div className="max-w-3xl space-y-6">
          {/* Dashboard Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Dashboard Preferences</CardTitle>
                    <CardDescription>Customize your dashboard view</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="default-view">Default Landing Page</Label>
                  <select
                    id="default-view"
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={defaultView}
                    onChange={(e) => setDefaultView(e.target.value)}
                  >
                    <option value="dashboard">Dashboard Overview</option>
                    <option value="analytics">Analytics</option>
                    <option value="feedback">Recent Feedback</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Show Trend Charts</p>
                    <p className="text-xs text-muted-foreground">Display satisfaction trend charts on dashboard</p>
                  </div>
                  <Toggle checked={showTrends} onChange={setShowTrends} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Show Recent Feedback</p>
                    <p className="text-xs text-muted-foreground">Display latest feedback submissions</p>
                  </div>
                  <Toggle checked={showRecentFeedback} onChange={setShowRecentFeedback} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950">
                    <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Notification Settings</CardTitle>
                    <CardDescription>Manage how you receive updates</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive updates via email</p>
                    </div>
                  </div>
                  <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Low Satisfaction Alerts</p>
                    <p className="text-xs text-muted-foreground">Get notified when scores drop below threshold</p>
                  </div>
                  <Toggle checked={lowSatisfactionAlerts} onChange={setLowSatisfactionAlerts} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">New Feedback Notifications</p>
                    <p className="text-xs text-muted-foreground">Alert when new feedback is submitted</p>
                  </div>
                  <Toggle checked={feedbackNotifications} onChange={setFeedbackNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Daily Digest</p>
                      <p className="text-xs text-muted-foreground">Summary email every morning</p>
                    </div>
                  </div>
                  <Toggle checked={dailyDigest} onChange={setDailyDigest} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feedback Collection Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950">
                    <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Feedback Settings</CardTitle>
                    <CardDescription>Configure feedback collection behavior</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Auto Thank You Message</p>
                    <p className="text-xs text-muted-foreground">Send automatic response after submission</p>
                  </div>
                  <Toggle checked={autoThankYou} onChange={setAutoThankYou} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Allow Anonymous Feedback</p>
                    <p className="text-xs text-muted-foreground">Let students submit without identification</p>
                  </div>
                  <Toggle checked={collectAnonymous} onChange={setCollectAnonymous} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threshold">Alert Threshold Score</Label>
                  <Input
                    id="threshold"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    className="h-11 w-32 rounded-xl"
                    value={satisfactionThreshold}
                    onChange={(e) => setSatisfactionThreshold(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Alert when service satisfaction drops below this score
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Export Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950">
                    <Download className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Export Settings</CardTitle>
                    <CardDescription>Configure data export preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label>Default Export Format</Label>
                  <div className="flex gap-2">
                    {["csv", "xlsx", "pdf"].map((format) => (
                      <Button
                        key={format}
                        variant={exportFormat === format ? "default" : "outline"}
                        size="sm"
                        className="rounded-lg uppercase"
                        onClick={() => setExportFormat(format)}
                      >
                        {format}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Include Comments</p>
                    <p className="text-xs text-muted-foreground">Add feedback comments to exports</p>
                  </div>
                  <Toggle checked={includeComments} onChange={setIncludeComments} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
          >
            <Button 
              onClick={handleSave}
              className="gap-2 rounded-xl"
              disabled={saved}
            >
              {saved ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save All Settings
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
