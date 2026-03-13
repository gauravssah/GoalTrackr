import Link from "next/link";
import { ArrowRight, ChartNoAxesCombined, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 lg:px-8">
      <header className="mb-20 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-foreground/55">GoalTrackr</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-6xl">Turn daily effort into visible momentum.</h1>
        </div>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </header>
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="max-w-2xl text-lg text-foreground/70">
            A production-ready life planning platform for tasks, goals, journals, job applications, analytics, and end-of-day reflection.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/signup">
              <Button size="lg">
                Start planning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">View dashboard</Button>
            </Link>
          </div>
        </div>
        <Card className="grid gap-4 p-8">
          <div className="rounded-2xl bg-primary/10 p-4">
            <ChartNoAxesCombined className="mb-3 h-5 w-5 text-primary" />
            <h3 className="font-semibold">Visual analytics</h3>
            <p className="text-sm text-foreground/70">Track progress with productivity charts, heatmaps, and scorecards.</p>
          </div>
          <div className="rounded-2xl bg-secondary/10 p-4">
            <Sparkles className="mb-3 h-5 w-5 text-secondary" />
            <h3 className="font-semibold">Multi-level planning</h3>
            <p className="text-sm text-foreground/70">Organize daily tasks, weekly goals, monthly milestones, and yearly objectives.</p>
          </div>
          <div className="rounded-2xl bg-accent/10 p-4">
            <ShieldCheck className="mb-3 h-5 w-5 text-accent" />
            <h3 className="font-semibold">Secure by default</h3>
            <p className="text-sm text-foreground/70">JWT auth, validation, rate limiting, and protected routes are built in.</p>
          </div>
        </Card>
      </section>
    </main>
  );
}
