"use client";

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
import { Settings, Database, Save, TestTube } from "lucide-react";

export default function SettingsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "student"]}>
      <AppShell title="Settings" description="Application configuration">
        <div className="max-w-2xl space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">General</CardTitle>
                  <CardDescription>Basic application settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution Name</Label>
                <Input
                  id="institution"
                  className="h-11 rounded-xl"
                  placeholder="e.g. State University"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  className="h-11 rounded-xl"
                  placeholder="admin@university.edu"
                />
              </div>
              <Separator />
              <Button className="gap-2 rounded-xl">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Database</CardTitle>
                  <CardDescription>
                    MongoDB connection configuration
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="mongo-uri">MongoDB URI</Label>
                <Input
                  id="mongo-uri"
                  type="password"
                  className="h-11 rounded-xl font-mono"
                  placeholder="mongodb+srv://..."
                />
              </div>
              <Button variant="outline" className="gap-2 rounded-xl">
                <TestTube className="h-4 w-4" />
                Test Connection
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
