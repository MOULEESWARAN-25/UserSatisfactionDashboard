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
    title: "5S-Certified Analytics",
    desc: "Track satisfaction trends across departments, from academics to hostels.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    desc: "Secure portals for BIT Students and Campus Administrators.",
  },
  {
    icon: Building2,
    title: "Real-Time Tracking",
    desc: "Monitor issues in the Main Mess, Emerald Hostel, and AC Libraries.",
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
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-foreground selection:bg-primary/20">
      {/* Premium Animated Background */}
      <div className="pointer-events-none absolute inset-0 bg-white" />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute -top-[20%] -left-[10%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_60%)] blur-3xl mix-blend-multiply" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
        className="pointer-events-none absolute top-[20%] -right-[10%] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_60%)] blur-3xl mix-blend-multiply" 
      />

      <header className="relative z-10 border-b border-border/40 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 lg:px-8">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-md shadow-primary/20">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-slate-900">SatisfyIQ</p>
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Bannari Amman Institute</p>
            </div>
          </motion.div>

          <motion.div
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm md:flex backdrop-blur-md"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Clock3 className="h-3.5 w-3.5 text-primary" />
            Academic Session 2026
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-5 pb-10 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pt-14">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="xl:py-8 space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl xl:text-6xl lg:leading-[1.1]">
              Elevating <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">student life</span> <br className="hidden lg:block" />at BIT Sathy
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600">
              The official centralized feedback command center. Track hostel Wi-Fi stability, cafeteria wait times, and academic resources in real-time.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {SYSTEM_POINTS.map((point, idx) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1, duration: 0.4, ease: "easeOut" }}
                className="group rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-md p-5 shadow-sm transition-all hover:shadow-md hover:bg-white"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <point.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-slate-900">{point.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{point.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="rounded-2xl border border-amber-200/50 bg-amber-50/50 px-5 py-4 backdrop-blur-sm"
          >
            <p className="text-sm font-semibold text-amber-900">🔒 BIT Sathy IT Policy Note</p>
            <p className="mt-1 text-sm leading-relaxed text-amber-800/80">
              Only use your assigned BIT credentials. Access attempts are monitored via the campus firewall mapping to your device MAC address.
            </p>
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="rounded-3xl border border-slate-200/50 bg-white/80 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-xl lg:p-10"
        >
          <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500">Sign in to your SatisfyIQ account to continue.</p>
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
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="space-y-1.5"
            >
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {selectedRole === "student" ? "BIT Student ID" : "Admin ID"}
              </Label>
              <Input
                className="h-11 bg-slate-50 border-slate-200 transition-colors focus-visible:bg-white"
                value={userId}
                placeholder={selectedRole === "student" ? "ex: STU2024001" : "ex: ADMIN001"}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setError("");
                }}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="space-y-1.5"
            >
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Secure Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="h-11 bg-slate-50 border-slate-200 pr-10 transition-colors focus-visible:bg-white"
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-slate-400 hover:text-slate-600 hover:bg-transparent"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="h-11 w-full gap-2 bg-slate-900 shadow-md hover:bg-slate-800 transition-all font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating
                  </>
                ) : (
                  <>
                    Secure Login
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-center text-[11px] font-medium text-slate-400"
            >
              {selectedRole === "college_admin"
                ? "Dev Mode: ADMIN001 / admin123"
                : "Dev Mode: STU2024001 / student123"}
            </motion.p>

            
          </div>
        </motion.section>
      </main>
    </div>
  );
}