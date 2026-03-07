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
import { Download, FileText, BarChart3, Calendar } from "lucide-react";
import { AdminOnly } from "@/components/auth/ProtectedRoute";

const REPORT_TYPES = [
  {
    title: "Monthly Summary",
    description:
      "Aggregate satisfaction scores and feedback volume for the current month",
    icon: Calendar,
  },
  {
    title: "Service Breakdown",
    description:
      "Detailed per-service analytics with question-level ratings",
    icon: BarChart3,
  },
  {
    title: "Trend Report",
    description:
      "Week-over-week satisfaction trends and anomaly detection",
    icon: FileText,
  },
];

export default function ReportsPage() {
  return (
    <AdminOnly>
      <AppShell
        title="Reports"
        description="Generate and export analytics reports"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REPORT_TYPES.map((report) => (
            <Card
              key={report.title}
              className="group overflow-hidden transition-all hover:shadow-lg"
            >
              <CardHeader className="pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <report.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4 text-base">{report.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-xl"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </AppShell>
    </AdminOnly>
  );
}
