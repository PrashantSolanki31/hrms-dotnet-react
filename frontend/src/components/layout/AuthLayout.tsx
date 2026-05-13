import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, Users } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-auth lg:flex lg:flex-col lg:justify-between p-12 text-primary-foreground">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <Link to="/" className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <span className="text-sm font-bold">HR</span>
          </div>
          <span className="text-lg font-semibold">HRMS Suite</span>
        </Link>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Modern HR.<br />Built for teams that move fast.
            </h2>
            <p className="mt-4 text-base text-primary-foreground/80 max-w-md">
              Manage your people, payroll, and processes — all from one professional, secure workspace.
            </p>
          </div>

          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
              <span>Enterprise-grade JWT security & role-based access</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 shrink-0" />
              <span>Centralized employee directory & profiles</span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0" />
              <span>Clean, modern interface designed for daily use</span>
            </li>
          </ul>
        </div>

        <p className="relative z-10 text-xs text-primary-foreground/70">
          © {new Date().getFullYear()} HRMS Suite. All rights reserved.
        </p>
      </div>

      {/* Right: form */}
      <div className="relative flex min-h-screen items-center justify-center bg-background p-6 lg:p-12">
        <div className="absolute right-4 top-4 lg:right-6 lg:top-6">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <span className="text-sm font-bold">HR</span>
            </div>
            <span className="text-lg font-semibold">HRMS Suite</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
