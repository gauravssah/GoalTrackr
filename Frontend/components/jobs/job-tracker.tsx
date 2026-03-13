"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store/use-app-store";

export function JobTracker() {
  const jobs = useAppStore((state) => state.jobs);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {jobs.map((job) => (
        <Card key={job._id}>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{job.companyName}</h3>
              <p className="text-sm text-foreground/60">{job.jobRole}</p>
            </div>
            <Badge>{job.status}</Badge>
          </div>
          <p className="mb-4 text-sm text-foreground/70">{job.notes}</p>
          <Progress value={job.timelineProgress} />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>Follow-up: {job.followUpReminder}</span>
            <Link href={job.jobLink} className="inline-flex items-center gap-1 text-primary">
              Open link
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
