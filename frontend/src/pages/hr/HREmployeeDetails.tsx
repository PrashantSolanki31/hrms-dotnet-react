import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Briefcase, Building2, CalendarDays, Loader2, Mail, Phone, Shield, User as UserIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api, getApiErrorMessage } from "@/lib/api";
import { fetchEmployees, type ApiEmployee } from "./HREmployees";

async function fetchEmployeeById(id: string): Promise<ApiEmployee | null> {
  const endpoints = [`/api/employees/${id}`, `/api/users/${id}`];
  for (const ep of endpoints) {
    try {
      const res = await api.get<ApiEmployee>(ep);
      if (res.data && typeof res.data === "object") return res.data;
    } catch {
      // try next
    }
  }
  // Fallback: scan list
  const list = await fetchEmployees();
  return list.find((e) => String(e.id) === String(id)) ?? null;
}

export default function HREmployeeDetails() {
  const { id = "" } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<ApiEmployee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEmployeeById(id);
        if (!cancelled) {
          if (!data) setError("Employee not found.");
          else setEmployee(data);
        }
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, "Could not load employee"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
          <Link to="/hr/employees">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to employees
          </Link>
        </Button>
      </div>

      {loading ? (
        <Card className="shadow-elegant border-border/60">
          <CardContent className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading employee...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="shadow-elegant border-destructive/30 bg-destructive/5">
          <CardContent className="p-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : employee ? (
        <EmployeeDetailCard employee={employee} />
      ) : null}
    </div>
  );
}

function EmployeeDetailCard({ employee }: { employee: ApiEmployee }) {
  const display = employee.name ?? employee.fullName ?? employee.email.split("@")[0];
  const role = employee.role ?? "Employee";

  return (
    <>
      <Card className="overflow-hidden shadow-elegant border-border/60">
        <div className="h-28 bg-gradient-auth" />
        <CardContent className="-mt-14 space-y-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-background bg-gradient-primary text-primary-foreground text-3xl font-bold shadow-glow">
                {display.charAt(0).toUpperCase()}
              </div>
              <div className="pb-2">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  {display}
                  <BadgeCheck className="h-5 w-5 text-primary" />
                </h2>
                <p className="text-sm text-muted-foreground">{employee.position ?? employee.jobTitle ?? "Team member"}</p>
              </div>
            </div>
            <Badge variant={role.toLowerCase() === "hr" ? "default" : "secondary"} className="self-start sm:self-auto">
              {role}
            </Badge>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow icon={UserIcon} label="Full name" value={display} />
            <InfoRow icon={Mail} label="Email" value={employee.email} />
            <InfoRow icon={Phone} label="Phone" value={employee.phone ?? "—"} />
            <InfoRow icon={Building2} label="Department" value={employee.department ?? "—"} />
            <InfoRow icon={Briefcase} label="Position" value={employee.position ?? employee.jobTitle ?? "—"} />
            <InfoRow icon={Shield} label="Role" value={role} />
            <InfoRow
              icon={CalendarDays}
              label="Hire date"
              value={formatDate(employee.hireDate ?? employee.createdAt)}
            />
            <InfoRow icon={BadgeCheck} label="Employee ID" value={String(employee.id ?? "—")} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant border-border/60">
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Recent activity and audit log will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No recent activity to display.
        </CardContent>
      </Card>
    </>
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
