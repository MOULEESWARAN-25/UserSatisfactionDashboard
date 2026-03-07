import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3, Calendar } from "lucide-react";

const REPORT_TYPES = [
  {
    title: "Monthly Summary",
    description: "Aggregate satisfaction scores and feedback volume for the current month",
    icon: Calendar,
  },
  {
    title: "Service Breakdown",
    description: "Detailed per-service analytics with question-level ratings",
    icon: BarChart3,
  },
  {
    title: "Trend Report",
    description: "Week-over-week satisfaction trends and anomaly detection",
    icon: FileText,
  },
];

export default function ReportsPage() {
  return (
    <AppShell title="Reports" description="Generate and export analytics reports">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_TYPES.map((report) => (
          <Card key={report.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <report.icon size={16} className="text-muted-foreground" />
                </div>
              </div>
              <CardTitle className="text-base mt-3">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Download size={13} />
                Export CSV
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
