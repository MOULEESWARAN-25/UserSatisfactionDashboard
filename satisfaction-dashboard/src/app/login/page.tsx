"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck, ArrowRight, PanelLeft, Loader2, Info } from "lucide-react";
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
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated && user) {
    const redirectPath =
      user.role === "student" ? "/feedback/submit" : "/dashboard";
    router.push(redirectPath);
    return null;
  }

  const handleLogin = async () => {
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
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          userId: userId.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Verify role matches
      if (data.user.role !== selectedRole) {
        setError(`This account is registered as ${data.user.role}, not ${selectedRole}`);
        setIsLoading(false);
        return;
      }

      // Use the auth context login
      login(data.user.userId, data.user.name, data.user.role);

      // Redirect based on role
      if (selectedRole === "student") {
        router.push("/feedback/submit");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Connection error. Please try again.");
      setIsLoading(false);
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
              setUserId("STU2024001");
              setPassword("student123");
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
              setUserId("ADMIN001");
              setPassword("admin123");
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
              {/* Default Credentials Hint */}
              <div className="flex items-start gap-2 rounded-lg bg-blue-500/10 p-3 text-sm">
                <Info className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">Default credentials:</span>
                  <br />
                  {selectedRole === "admin" ? (
                    <>Admin ID: <code className="bg-muted px-1 rounded">ADMIN001</code> / Password: <code className="bg-muted px-1 rounded">admin123</code></>
                  ) : (
                    <>Student ID: <code className="bg-muted px-1 rounded">STU2024001</code> / Password: <code className="bg-muted px-1 rounded">student123</code></>
                  )}
                </div>
              </div>

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
                      : "e.g., ADMIN001"
                  }
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setError("");
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="h-11 rounded-xl"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="h-11 w-full gap-2 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
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
