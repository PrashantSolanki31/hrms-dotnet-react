import { useEffect, useState } from "react";
import { Building2, Loader2, Mail, Search, ShieldCheck, UserPlus, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, getApiErrorMessage } from "@/lib/api";

interface ApiUser {
  id?: string | number;
  name?: string;
  fullName?: string;
  email: string;
  role?: string;
}

const stats = [
  { label: "Total Employees", icon: Users, color: "text-primary", bg: "bg-accent" },
  { label: "Departments", icon: Building2, color: "text-success", bg: "bg-success/10" },
  { label: "HR Admins", icon: ShieldCheck, color: "text-warning", bg: "bg-warning/10" },
  { label: "New This Month", icon: UserPlus, color: "text-primary", bg: "bg-accent" },
];

export default function HRDashboard() {
  const [users, setUsers] = useState<ApiUser[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Try common endpoints; fall back gracefully
        const endpoints = ["/api/users", "/api/employees", "/api/auth/users"];
        let data: ApiUser[] | null = null;
        for (const ep of endpoints) {
          try {
            const res = await api.get<ApiUser[]>(ep);
            if (Array.isArray(res.data)) {
              data = res.data;
              break;
            }
          } catch {
            // try next
          }
        }
        if (cancelled) return;
        setUsers(data ?? []);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, "Could not load users"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const list = users ?? [];
  const filtered = list.filter((u) => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      (u.name ?? u.fullName ?? "").toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.role ?? "").toLowerCase().includes(q)
    );
  });

  const counts = {
    total: list.length,
    departments: 1,
    hr: list.filter((u) => (u.role ?? "").toLowerCase() === "hr").length,
    new: 0,
  };
  const statValues = [counts.total, counts.departments, counts.hr, counts.new];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">HR Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your workforce and team operations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="shadow-elegant border-border/60">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.bg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-semibold">{loading ? "—" : statValues[i]}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-elegant border-border/60">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>All Users</CardTitle>
            <CardDescription>People with access to the workspace.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading users...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
              <Users className="h-8 w-8 opacity-50" />
              <p className="text-sm">
                {list.length === 0
                  ? "No users yet — or your backend doesn't expose a /api/users endpoint."
                  : "No users match your search."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u, idx) => {
                    const display = u.name ?? u.fullName ?? u.email.split("@")[0];
                    const role = (u.role ?? "Employee");
                    return (
                      <TableRow key={u.id ?? idx}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                              {display.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{display}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            {u.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={role.toLowerCase() === "hr" ? "default" : "secondary"}>{role}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
