"use client";

import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SERVICES } from "@/lib/constants";
import { AdminOnly } from "@/components/auth/ProtectedRoute";
import {
  UtensilsCrossed,
  BookOpen,
  Monitor,
  Building2,
  Calendar,
  HelpCircle,
} from "lucide-react";
import type { ServiceId } from "@/types/feedback";

const SERVICE_ICONS: Record<ServiceId, React.ComponentType<{ className?: string }>> = {
  cafeteria: UtensilsCrossed,
  library: BookOpen,
  "online-course": Monitor,
  hostel: Building2,
  "campus-event": Calendar,
};

export default function ServicesPage() {
  return (
    <AdminOnly>
      <AppShell
        title="Services"
        description="Campus service catalog and question configuration"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const IconComponent =
              SERVICE_ICONS[service.id as ServiceId] || HelpCircle;
            return (
              <Card
                key={service.id}
                className="group overflow-hidden transition-all hover:shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {service.name}
                      </CardTitle>
                      <CardDescription>
                        {service.questions.length} feedback questions
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {service.questions.map((q) => (
                      <Badge
                        key={q.id}
                        variant="secondary"
                        className="rounded-full text-xs font-normal"
                      >
                        {q.label}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </AppShell>
    </AdminOnly>
  );
}
