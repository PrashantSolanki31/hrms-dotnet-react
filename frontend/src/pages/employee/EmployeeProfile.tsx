import { BadgeCheck, Briefcase, Building2, CalendarDays, Loader2, Mail, Phone, Shield, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCurrentEmployee } from "@/hooks/useCurrentEmployee";

export default function EmployeeProfile() {
  const { data, loading, error } = useCurrentEmployee();
  const display = data?.fullName ?? data?.name ?? data?.email?.split("@")[0] ?? "User";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground">Your personal account information.</p>
      </div>

      {loading ? (
        <Card className="shadow-elegant border-border/60">
          <CardContent className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading your profile...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="shadow-elegant border-destructive/30 bg-destructive/5">
          <CardContent className="p-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden shadow-elegant border-border/60">
          <div className="h-24 bg-gradient-auth" />
          <CardContent className="-mt-12 space-y-6 p-6">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-background bg-gradient-primary text-primary-foreground text-3xl font-bold shadow-glow">
                {display.charAt(0).toUpperCase()}
              </div>
              <div className="pb-2">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {display}
                  <BadgeCheck className="h-5 w-5 text-primary" />
                </h2>
                <p className="text-sm text-muted-foreground">{data?.position ?? data?.jobTitle ?? data?.email}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow icon={UserIcon} label="Full name" value={display} />
              <InfoRow icon={Mail} label="Email" value={data?.email ?? "—"} />
              <InfoRow icon={Phone} label="Phone" value={data?.phone ?? "—"} />
              <InfoRow icon={Building2} label="Department" value={data?.department ?? "—"} />
              <InfoRow icon={Briefcase} label="Position" value={data?.position ?? data?.jobTitle ?? "—"} />
              <InfoRow
                icon={Shield}
                label="Role"
                value={<Badge variant={data?.role === "HR" ? "default" : "secondary"}>{data?.role}</Badge>}
              />
              <InfoRow icon={CalendarDays} label="Hire date" value={formatDate(data?.hireDate ?? data?.createdAt)} />
              <InfoRow
                icon={BadgeCheck}
                label="Status"
                value={<Badge className="bg-success text-success-foreground">Active</Badge>}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-elegant border-border/60">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Your authentication is secured with JWT.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Password changes and two-factor authentication will be available soon.
        </CardContent>
      </Card>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserIcon;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="mt-1 text-sm font-medium break-words">{value}</div>
      </div>
    </div>
  );
}
