import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2, Mail, Plus, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, getApiErrorMessage } from "@/lib/api";

export interface ApiEmployee {
  id?: string | number;
  name?: string;
  fullName?: string;
  email: string;
  role?: string;
  department?: string;
  position?: string;
  jobTitle?: string;
  phone?: string;
  hireDate?: string;
  createdAt?: string;
}

export async function fetchEmployees(): Promise<ApiEmployee[]> {
 const endpoints = ["/api/users"];
  for (const ep of endpoints) {
    try {
      const res = await api.get<ApiEmployee[]>(ep);
      if (Array.isArray(res.data)) return res.data;
    } catch {
      // try next
    }
  }
  return [];
}

export default function HREmployees() {
  const [employees, setEmployees] = useState<ApiEmployee[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEmployees();
        if (!cancelled) setEmployees(data);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, "Could not load employees"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const list = employees ?? [];
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return list;
    return list.filter(
      (u) =>
        (u.name ?? u.fullName ?? "").toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.department ?? "").toLowerCase().includes(q) ||
        (u.role ?? "").toLowerCase().includes(q)
    );
  }, [list, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground">
            View, manage, and onboard members of your organization.
          </p>
        </div>
        <Button asChild className="bg-gradient-primary hover:opacity-95 shadow-glow">
          <Link to="/register">
            <Plus className="mr-2 h-4 w-4" /> Add employee
          </Link>
        </Button>
      </div>

      <Card className="shadow-elegant border-border/60">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>All employees</CardTitle>
            <CardDescription>Click a row to view full employee details.</CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, role..."
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
              Loading employees...
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
                  ? "No employees yet. Use “Add employee” to create one."
                  : "No employees match your search."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u, idx) => {
                    const display = u.name ?? u.fullName ?? u.email.split("@")[0];
                    const role = u.role ?? "Employee";
                    const id = u.id ?? idx;
                    return (
                      <TableRow
                        key={id}
                        className="cursor-pointer transition-smooth hover:bg-accent/40"
                        onClick={() => {
                          window.location.assign(`/hr/employees/${id}`);
                        }}
                      >
                        <TableCell>
                          <Link
                            to={`/hr/employees/${id}`}
                            className="flex items-center gap-3 font-medium hover:text-primary"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                              {display.charAt(0).toUpperCase()}
                            </div>
                            <span>{display}</span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            {u.email}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {u.department ?? "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={role.toLowerCase() === "hr" ? "default" : "secondary"}>
                            {role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
