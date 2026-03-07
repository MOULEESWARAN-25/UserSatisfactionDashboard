import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SERVICES } from "@/lib/constants";

export default function ServicesPage() {
  return (
    <AppShell title="Services" description="Campus service catalog and question configuration">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <CardTitle className="text-base">{service.name}</CardTitle>
                  <CardDescription>{service.questions.length} feedback questions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {service.questions.map((q) => (
                  <Badge key={q.id} variant="secondary" className="text-xs font-normal">
                    {q.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
