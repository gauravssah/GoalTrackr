"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/use-app-store";

export default function SearchPage() {
  const searchAll = useAppStore((state) => state.searchAll);
  const results = useAppStore((state) => state.searchResults);
  const [query, setQuery] = useState("");

  return (
    <AppShell>
      <div className="space-y-5">
        <Card>
          <h1 className="mb-4 text-2xl font-semibold">Global search</h1>
          <Input
            placeholder="Search tasks, blogs, job applications"
            value={query}
            onChange={async (e) => {
              const nextValue = e.target.value;
              setQuery(nextValue);
              await searchAll(nextValue);
            }}
          />
        </Card>
        <div className="grid gap-5 xl:grid-cols-3">
          <Card>
            <h2 className="mb-4 text-lg font-semibold">Tasks</h2>
            {results.tasks.map((task) => <p key={task._id} className="mb-2 text-sm">{task.title}</p>)}
          </Card>
          <Card>
            <h2 className="mb-4 text-lg font-semibold">Blogs</h2>
            {results.blogs.map((blog) => <p key={blog._id} className="mb-2 text-sm">{blog.title}</p>)}
          </Card>
          <Card>
            <h2 className="mb-4 text-lg font-semibold">Job applications</h2>
            {results.jobs.map((job) => <p key={job._id} className="mb-2 text-sm">{job.companyName} - {job.jobRole}</p>)}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
