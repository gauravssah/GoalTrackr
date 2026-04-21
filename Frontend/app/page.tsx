import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 lg:px-8">
      <header className="mb-14 flex flex-col gap-5 sm:mb-20 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-foreground/55">
            GoalTrackr
          </p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl md:text-6xl">
            Turn daily effort into visible momentum.
          </h1>
        </div>
        <Link href="/login" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">Login</Button>
        </Link>
      </header>
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="max-w-2xl text-lg text-foreground/70">
            Plan tasks, goals, journals, and job applications in one place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Start planning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View dashboard
              </Button>
            </Link>
          </div>
        </div>
        <Card className="grid gap-4 p-8">
          <div className="rounded-2xl bg-primary/10 p-4">
            <ChartNoAxesCombined className="mb-3 h-5 w-5 text-primary" />
            <h3 className="font-semibold">Visual analytics</h3>
            <p className="text-sm text-foreground/70">
              View progress with simple charts and heatmaps.
            </p>
          </div>
          <div className="rounded-2xl bg-secondary/10 p-4">
            <Sparkles className="mb-3 h-5 w-5 text-secondary" />
            <h3 className="font-semibold">Multi-level planning</h3>
            <p className="text-sm text-foreground/70">
              Plan daily work and long-term goals with ease.
            </p>
          </div>
          <div className="rounded-2xl bg-accent/10 p-4">
            <ShieldCheck className="mb-3 h-5 w-5 text-accent" />
            <h3 className="font-semibold">Secure by default</h3>
            <p className="text-sm text-foreground/70">
              Secure login and protected data are built in.
            </p>
          </div>
        </Card>
      </section>
    </main>
  );
}
