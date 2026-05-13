import { Briefcase, Building2, Calendar, CheckCircle2, Clock, FileText, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useCurrentEmployee } from "@/hooks/useCurrentEmployee";

const quickStats = [
  { label: "Hours This Week", value: "32h", icon: Clock, color: "text-primary", bg: "bg-accent" },
  { label: "Tasks Completed", value: "12", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  { label: "Leave Balance", value: "8 days", icon: Calendar, color: "text-warning", bg: "bg-warning/10" },
  { label: "Documents", value: "5", icon: FileText, color: "text-primary", bg: "bg-accent" },
];

export default function EmployeeDashboard() {
  const { data, loading } = useCurrentEmployee();
  const display = data?.fullName ?? data?.name ?? data?.email?.split("@")[0] ?? "there";
  const firstName = display.split(" ")[0];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none shadow-large">
        <div className="relative bg-gradient-auth p-6 sm:p-8 text-primary-foreground">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <p className="text-sm uppercase tracking-wide text-primary-foreground/80">Welcome back</p>
            <h1 className="mt-2 text-3xl font-semibold">Hi, {firstName} 👋</h1>
            <p className="mt-2 max-w-lg text-sm text-primary-foreground/85">
              Here's a snapshot of your workspace. Have a productive day!
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link to="/employee/profile">View profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="shadow-elegant border-border/60">
        <CardHeader>
          <CardTitle>Your information</CardTitle>
          <CardDescription>Details on file from your HR team.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <InfoLine icon={Mail} label="Email" value={loading ? "Loading..." : data?.email ?? "—"} />
          <InfoLine icon={Building2} label="Department" value={loading ? "Loading..." : data?.department ?? "—"} />
          <InfoLine
            icon={Briefcase}
            label="Position"
            value={loading ? "Loading..." : data?.position ?? data?.jobTitle ?? "—"}
          />
          <InfoLine
            icon={CheckCircle2}
            label="Role"
            value={
              loading ? (
                "Loading..."
              ) : (
                <Badge variant={data?.role === "HR" ? "default" : "secondary"}>{data?.role ?? "Employee"}</Badge>
              )
            }
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="shadow-elegant border-border/60">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.bg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-semibold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-elegant border-border/60">
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Updates from your HR team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p className="rounded-lg border border-border/60 bg-muted/40 p-3">
              📢 Quarterly all-hands meeting next Friday at 3 PM.
            </p>
            <p className="rounded-lg border border-border/60 bg-muted/40 p-3">
              🎉 Welcome our newest team members! Say hi on Slack.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-border/60">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Things you can do right now.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            <Button variant="outline" className="justify-start" disabled>
              <Calendar className="mr-2 h-4 w-4" /> Request leave
            </Button>
            <Button variant="outline" className="justify-start" disabled>
              <FileText className="mr-2 h-4 w-4" /> Submit timesheet
            </Button>
            <Button variant="outline" className="justify-start" disabled>
              <CheckCircle2 className="mr-2 h-4 w-4" /> View payslips
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/employee/profile">
                <Clock className="mr-2 h-4 w-4" /> Update profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-sm font-medium break-words">{value}</div>
      </div>
    </div>
  );
}
