import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

function Label_({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  );
}

export default function SettingsPage() {
  return (
    <AppShell title="Settings" description="Application configuration">
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">General</CardTitle>
            <CardDescription>Basic application settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label_ htmlFor="institution">Institution Name</Label_>
              <Input id="institution" placeholder="e.g. State University" />
            </div>
            <div className="space-y-1.5">
              <Label_ htmlFor="admin-email">Admin Email</Label_>
              <Input id="admin-email" type="email" placeholder="admin@university.edu" />
            </div>
            <Separator />
            <Button size="sm">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Database</CardTitle>
            <CardDescription>MongoDB connection configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label_ htmlFor="mongo-uri">MongoDB URI</Label_>
              <Input id="mongo-uri" type="password" placeholder="mongodb+srv://..." />
            </div>
            <Button size="sm" variant="outline">Test Connection</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

// Re-export Label from radix
export { Label } from "@/components/ui/label";
