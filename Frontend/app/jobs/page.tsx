"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/use-app-store";
import { JobApplication, JobStatus } from "@/types";

const emptyJob: Omit<JobApplication, "_id"> = {
  companyName: "",
  jobRole: "",
  jobLink: "",
  applicationDate: "",
  status: "Pending",
  followUpReminder: "",
  notes: "",
  timelineProgress: 0,
};

export default function JobsPage() {
  const jobs = useAppStore((state) => state.jobs);
  const createJob = useAppStore((state) => state.createJob);
  const updateJob = useAppStore((state) => state.updateJob);
  const deleteJob = useAppStore((state) => state.deleteJob);
  const [form, setForm] = useState(emptyJob);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleSubmit() {
    const payload = {
      ...form,
      timelineProgress: Number(form.timelineProgress),
    };
    if (editingId) {
      await updateJob(editingId, payload);
      setEditingId(null);
    } else {
      await createJob(payload);
    }
    setForm(emptyJob);
  }

  function startEdit(job: JobApplication) {
    setEditingId(job._id);
    setForm({
      companyName: job.companyName,
      jobRole: job.jobRole,
      jobLink: job.jobLink,
      applicationDate: job.applicationDate?.slice(0, 10) || "",
      status: job.status,
      followUpReminder: job.followUpReminder?.slice(0, 10) || "",
      notes: job.notes || "",
      timelineProgress: job.timelineProgress,
    });
  }

  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-4">
          <h1 className="text-2xl font-semibold">Job application tracker</h1>
          <FieldGroup label="Company name">
            <Input
              placeholder="Company name"
              value={form.companyName}
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
            />
          </FieldGroup>
          <FieldGroup label="Job role">
            <Input
              placeholder="Job role"
              value={form.jobRole}
              onChange={(e) => setForm({ ...form, jobRole: e.target.value })}
            />
          </FieldGroup>
          <FieldGroup label="Job link">
            <Input
              placeholder="Job link"
              value={form.jobLink}
              onChange={(e) => setForm({ ...form, jobLink: e.target.value })}
            />
          </FieldGroup>
          <div className="grid gap-3 md:grid-cols-2">
            <FieldGroup label="Application date">
              <Input
                type="date"
                value={form.applicationDate}
                onChange={(e) =>
                  setForm({ ...form, applicationDate: e.target.value })
                }
              />
            </FieldGroup>
            <FieldGroup label="Follow-up reminder">
              <Input
                type="date"
                value={form.followUpReminder}
                onChange={(e) =>
                  setForm({ ...form, followUpReminder: e.target.value })
                }
              />
            </FieldGroup>
            <FieldGroup label="Application status">
              <select
                className="h-11 w-full rounded-xl border bg-card px-4"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as JobStatus })
                }
              >
                <option>Not Applied</option>
                <option>Pending</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>Rejected</option>
                <option>Offer</option>
              </select>
            </FieldGroup>
            <FieldGroup label="Timeline progress (%)">
              <Input
                type="number"
                placeholder="Timeline %"
                value={form.timelineProgress}
                onChange={(e) =>
                  setForm({ ...form, timelineProgress: Number(e.target.value) })
                }
              />
            </FieldGroup>
          </div>
          <FieldGroup label="Notes">
            <Textarea
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </FieldGroup>
          <Button onClick={handleSubmit}>
            {editingId ? "Update application" : "Save application"}
          </Button>
        </Card>

        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job._id}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{job.companyName}</h2>
                  <p className="text-sm text-foreground/60">{job.jobRole}</p>
                </div>
                <Badge>{job.status}</Badge>
              </div>
              <p className="text-sm text-foreground/70">{job.notes}</p>
              <p className="mt-3 text-sm text-foreground/60">
                Progress: {job.timelineProgress}%
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(job)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    updateJob(job._id, {
                      timelineProgress: Math.min(
                        job.timelineProgress + 10,
                        100,
                      ),
                    })
                  }
                >
                  Advance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteJob(job._id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
