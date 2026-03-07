"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck, ArrowRight, PanelLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserRole } from "@/types/auth";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  // Redirect if already logged in
  if (isAuthenticated && user) {
    const redirectPath =
      user.role === "student" ? "/feedback/submit" : "/dashboard";
    router.push(redirectPath);
    return null;
  }

  const handleLogin = () => {
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }
    if (!userId.trim()) {
      setError(
        selectedRole === "student"
          ? "Please enter your Student ID"
          : "Please enter your Admin ID"
      );
      return;
    }
    if (!userName.trim()) {
      setError("Please enter your name");
      return;
    }

    login(userId.trim(), userName.trim(), selectedRole);

    // Redirect based on role
    if (selectedRole === "student") {
      router.push("/feedback/submit");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <PanelLeft className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              User Satisfaction Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Select your role to continue
            </p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              setSelectedRole("student");
              setError("");
            }}
            className={cn(
              "group relative flex flex-col items-center gap-4 rounded-2xl border-2 p-6 transition-all",
              selectedRole === "student"
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border bg-card hover:border-primary/50 hover:shadow-md"
            )}
          >
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
                selectedRole === "student"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted group-hover:bg-primary/10"
              )}
            >
              <GraduationCap className="h-7 w-7" />
            </div>
            <div className="text-center">
              <div className="font-semibold">Student</div>
              <div className="text-xs text-muted-foreground">
                Submit Feedback
              </div>
            </div>
            {selectedRole === "student" && (
              <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-primary" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole("admin");
              setError("");
            }}
            className={cn(
              "group relative flex flex-col items-center gap-4 rounded-2xl border-2 p-6 transition-all",
              selectedRole === "admin"
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border bg-card hover:border-primary/50 hover:shadow-md"
            )}
          >
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
                selectedRole === "admin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted group-hover:bg-primary/10"
              )}
            >
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="text-center">
              <div className="font-semibold">Admin</div>
              <div className="text-xs text-muted-foreground">
                View Analytics
              </div>
            </div>
            {selectedRole === "admin" && (
              <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-primary" />
            )}
          </button>
        </div>

        {/* Login Form */}
        {selectedRole && (
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="text-lg">
                {selectedRole === "student" ? "Student Login" : "Admin Login"}
              </CardTitle>
              <CardDescription>
                {selectedRole === "student"
                  ? "Enter your student credentials to submit feedback"
                  : "Enter your admin credentials to access the dashboard"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="userId">
                  {selectedRole === "student" ? "Student ID" : "Admin ID"}
                </Label>
                <Input
                  id="userId"
                  className="h-11 rounded-xl"
                  placeholder={
                    selectedRole === "student"
                      ? "e.g., STU2024001"
                      : "e.g., ADM001"
                  }
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setError("");
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userName">Full Name</Label>
                <Input
                  id="userName"
                  className="h-11 rounded-xl"
                  placeholder="Enter your full name"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    setError("");
                  }}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                onClick={handleLogin}
                className="h-11 w-full gap-2 rounded-xl"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <p className="text-center text-xs text-muted-foreground">
          Students submit feedback • Admins analyze feedback
        </p>
      </div>
    </div>
  );
}
