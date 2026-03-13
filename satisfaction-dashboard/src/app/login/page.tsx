"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  GraduationCap,
  LifeBuoy,
  LineChart,
  Loader2,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth";

const SYSTEM_POINTS = [
  {
    icon: LineChart,
    title: "Service Analytics",
    desc: "Track satisfaction trends by department and service.",
  },
  {
    icon: Shield,
    title: "Secure Access",
    desc: "Role-based sign-in for students and administrators.",
  },
  {
    icon: LifeBuoy,
    title: "Issue Follow-up",
    desc: "Flag and resolve service issues through one workflow.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(user.role === "student" ? "/feedback/submit" : "/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated && user) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError("");

    if (role === "college_admin") {
      setUserId("ADMIN001");
      setPassword("admin123");
    } else {
      setUserId("STU2024001");
      setPassword("student123");
    }
  };

  const handleLogin = async () => {
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }
    if (!userId.trim()) {
      setError("Please enter your ID");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          userId: userId.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Login failed. Check your credentials.");
        setIsLoading(false);
        return;
      }

      if (data.user.role !== selectedRole) {
        setError("Role mismatch - check your credentials.");
        setIsLoading(false);
        return;
      }

      login(data.user.userId, data.user.name, data.user.role);
      router.push(selectedRole === "student" ? "/feedback/submit" : "/dashboard");
    } catch {
      setError("Connection error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_42%)]" />

      <header className="relative z-10 border-b border-border/70 bg-card/70 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5 lg:px-8">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">College Service Feedback System</p>
              <p className="text-[11px] text-muted-foreground">Internal Portal</p>
            </div>
          </motion.div>

          <motion.div
            className="hidden items-center gap-2 text-xs text-muted-foreground md:flex"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Clock3 className="h-3.5 w-3.5" />
            Academic Session 2026
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-5 pb-10 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pt-14">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Service quality monitoring for
              <span className="text-primary"> college operations</span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              This system is used by students and administrative teams to submit, track, and review service feedback across campus departments.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {SYSTEM_POINTS.map((point, idx) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.07, duration: 0.3 }}
                className="rounded-xl border border-border bg-card/80 p-4"
              >
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <point.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold">{point.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{point.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.3 }}
            className="rounded-xl border border-border bg-card/80 p-4"
          >
            <p className="text-sm font-semibold">Operational Note</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use your assigned college credentials only. All activities are logged for system audit and issue follow-up.
            </p>
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/10"
        >
          <div className="mb-5 space-y-1">
            <h2 className="text-xl font-semibold">Sign in</h2>
            <p className="text-sm text-muted-foreground">Select your role and enter your assigned credentials.</p>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            {(
              [
                { role: "student" as UserRole, label: "Student", icon: GraduationCap },
                { role: "college_admin" as UserRole, label: "Admin", icon: ShieldCheck },
              ] as const
            ).map(({ role, label, icon: Icon }) => (
              <motion.button
                key={role}
                type="button"
                onClick={() => handleRoleSelect(role)}
                className={cn(
                  "relative flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors",
                  selectedRole === role ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                whileTap={{ scale: 0.98 }}
              >
                {selectedRole === role && (
                  <motion.span
                    layoutId="login-role-tab"
                    className="absolute inset-0 rounded-md bg-background shadow-sm"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 340, damping: 30 }}
                  />
                )}
                <Icon className={cn("h-4 w-4", role === "student" ? "text-chart-2" : "text-primary")} />
                {label}
              </motion.button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                {selectedRole === "student" ? "Student ID" : "Admin ID"}
              </Label>
              <Input
                className="h-10 bg-background"
                value={userId}
                placeholder={selectedRole === "student" ? "STU2024001" : "ADMIN001"}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setError("");
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="h-10 bg-background pr-10"
                  value={password}
                  placeholder="Enter password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="h-10 w-full gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              {selectedRole === "college_admin"
                ? "Credentials: ADMIN001 / admin123"
                : "Credentials: STU2024001 / student123"}
            </p>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-1.5 text-xs text-destructive"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
