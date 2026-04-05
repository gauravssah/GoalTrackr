"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/use-app-store";

export default function JournalPage() {
  const blogs = useAppStore((state) => state.blogs);
  const createBlog = useAppStore((state) => state.createBlog);
  const updateBlog = useAppStore((state) => state.updateBlog);
  const deleteBlog = useAppStore((state) => state.deleteBlog);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    mood: "",
    tags: "",
  });

  const history = useMemo(
    () =>
      [...blogs].sort(
        (left, right) =>
          new Date(right.date).getTime() - new Date(left.date).getTime(),
      ),
    [blogs],
  );

  async function saveEntry() {
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      mood: form.mood.trim() || "Neutral",
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      date: new Date().toISOString(),
    };

    if (editingId) {
      await updateBlog(editingId, payload);
    } else {
      await createBlog(payload);
    }

    setEditingId(null);
    setForm({ title: "", content: "", mood: "", tags: "" });
  }

  function editEntry(id: string) {
    const entry = blogs.find((item) => item._id === id);
    if (!entry) return;

    setEditingId(id);
    setForm({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags.join(", "),
    });
  }

  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-4 border-primary/15 bg-gradient-to-br from-primary/10 via-card to-card">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/45">
              Daily journal
            </p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Write, revisit, and refine your day.
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-foreground/65">
              Every journal entry is date-stamped automatically and can be
              edited or deleted later.
            </p>
          </div>

          <FieldGroup label="Title">
            <Input
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="Journal title"
            />
          </FieldGroup>
          <FieldGroup label="Mood">
            <Input
              value={form.mood}
              onChange={(event) =>
                setForm({ ...form, mood: event.target.value })
              }
              placeholder="Calm, focused, tired..."
            />
          </FieldGroup>
          <FieldGroup
            label="Tags"
            hint="Comma-separated labels like focus, growth, health."
          >
            <Input
              value={form.tags}
              onChange={(event) =>
                setForm({ ...form, tags: event.target.value })
              }
              placeholder="focus, growth"
            />
          </FieldGroup>
          <FieldGroup label="Entry">
            <Textarea
              value={form.content}
              onChange={(event) =>
                setForm({ ...form, content: event.target.value })
              }
              placeholder="What happened today?"
            />
          </FieldGroup>

          <div className="flex flex-wrap gap-3">
            <Button onClick={saveEntry}>
              {editingId ? "Update journal" : "Save journal"}
            </Button>
            {editingId ? (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: "", content: "", mood: "", tags: "" });
                }}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/45">
              History
            </p>
            <h2 className="mt-2 text-lg font-semibold">Previous journals</h2>
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-foreground/60">
              No journal entries yet.
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <article
                  key={entry._id}
                  className="rounded-2xl border border-border/70 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold">{entry.title}</h3>
                      <p className="text-xs text-foreground/55">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge>{entry.mood}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-foreground/70">
                    {entry.content}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editEntry(entry._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBlog(entry._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
