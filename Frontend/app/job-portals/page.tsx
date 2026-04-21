"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Eye, EyeOff, Plus, Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/use-app-store";
import { useToastStore } from "@/store/use-toast-store";
import { JobPortal } from "@/types";

type JobPortalDraft = Omit<JobPortal, "_id">;

const emptyPortal: JobPortalDraft = {
  portalName: "",
  portalUrl: "",
  portalUserId: "",
  portalPassword: "",
  description: "",
};

export default function JobPortalsPage() {
  const portals = useAppStore((state) => state.jobPortals);
  const createJobPortal = useAppStore((state) => state.createJobPortal);
  const updateJobPortal = useAppStore((state) => state.updateJobPortal);
  const deleteJobPortal = useAppStore((state) => state.deleteJobPortal);
  const pushToast = useToastStore((state) => state.pushToast);

  const [form, setForm] = useState<JobPortalDraft>(emptyPortal);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<string, boolean>
  >({});

  const isValid =
    form.portalName.trim().length > 0 &&
    form.portalUrl.trim().length > 0 &&
    form.portalUserId.trim().length > 0 &&
    form.portalPassword.trim().length > 0;

  const filteredPortals = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return portals;

    return portals.filter((portal) =>
      [
        portal.portalName,
        portal.portalUrl,
        portal.portalUserId,
        portal.description,
      ].some((value) => (value ?? "").toLowerCase().includes(q)),
    );
  }, [portals, search]);

  async function handleSubmit() {
    if (!isValid) return;

    const payload = {
      portalName: form.portalName.trim(),
      portalUrl: form.portalUrl.trim(),
      portalUserId: form.portalUserId.trim(),
      portalPassword: form.portalPassword.trim(),
      description: form.description?.trim() || undefined,
    };

    if (editingId) {
      await updateJobPortal(editingId, payload);
      setEditingId(null);
    } else {
      await createJobPortal(payload);
    }

    setForm(emptyPortal);
    setShowFormPassword(false);
    setShowForm(false);
  }

  function handleEdit(portal: JobPortal) {
    setEditingId(portal._id);
    setForm({
      portalName: portal.portalName,
      portalUrl: portal.portalUrl,
      portalUserId: portal.portalUserId,
      portalPassword: portal.portalPassword,
      description: portal.description || "",
    });
    setShowFormPassword(false);
    setShowForm(true);
  }

  function handleCancel() {
    setForm(emptyPortal);
    setEditingId(null);
    setShowFormPassword(false);
    setShowForm(false);
  }

  function togglePasswordVisibility(id: string) {
    setVisiblePasswords((state) => ({ ...state, [id]: !state[id] }));
  }

  async function handleCopy(value: string, key: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(key);
      pushToast({
        title: `${label} copied`,
        description: "Copied to clipboard successfully.",
        tone: "success",
      });
      window.setTimeout(() => {
        setCopiedField((prev) => (prev === key ? null : prev));
      }, 1500);
    } catch {
      pushToast({
        title: "Copy failed",
        description: "Please copy manually.",
        tone: "error",
      });
    }
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <Card className="space-y-4 border-border/70 bg-gradient-to-br from-card via-card to-primary/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Job portals vault</h1>
              <p className="text-sm text-foreground/65">
                Save portal logins and notes in one place.
              </p>
            </div>
            <Button onClick={() => setShowForm((value) => !value)}>
              <Plus className="mr-2 h-4 w-4" />
              {showForm ? "Close form" : "Add portal"}
            </Button>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/45" />
            <Input
              className="pl-9"
              placeholder="Search by portal name, URL, user ID, or description"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </Card>

        {showForm ? (
          <Card className="space-y-4 border-border/70 bg-card/90">
            <h2 className="text-xl font-semibold">
              {editingId ? "Update portal" : "Add new portal"}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <FieldGroup label="Portal name *">
                <Input
                  placeholder="LinkedIn, Naukri, Indeed..."
                  value={form.portalName}
                  onChange={(e) =>
                    setForm({ ...form, portalName: e.target.value })
                  }
                />
              </FieldGroup>
              <FieldGroup label="Portal URL *">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={form.portalUrl}
                  onChange={(e) =>
                    setForm({ ...form, portalUrl: e.target.value })
                  }
                />
              </FieldGroup>
              <FieldGroup label="User ID / Email *">
                <Input
                  placeholder="your-login-id"
                  value={form.portalUserId}
                  onChange={(e) =>
                    setForm({ ...form, portalUserId: e.target.value })
                  }
                />
              </FieldGroup>
              <FieldGroup label="Password *">
                <div className="relative">
                  <Input
                    type={showFormPassword ? "text" : "password"}
                    placeholder="Your portal password"
                    className="pr-11"
                    value={form.portalPassword}
                    onChange={(e) =>
                      setForm({ ...form, portalPassword: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 transition hover:text-foreground"
                    onClick={() => setShowFormPassword((prev) => !prev)}
                    aria-label={
                      showFormPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showFormPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FieldGroup>
            </div>
            <FieldGroup label="Short description (optional)">
              <Textarea
                placeholder="Any notes about this portal"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </FieldGroup>
            <div className="flex flex-wrap gap-2">
              <Button disabled={!isValid} onClick={handleSubmit}>
                {editingId ? "Update portal" : "Save portal"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </Card>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-2">
          {filteredPortals.map((portal) => {
            const showPassword = Boolean(visiblePasswords[portal._id]);

            return (
              <Card
                key={portal._id}
                className="space-y-4 border-border/70 bg-gradient-to-br from-card via-card to-primary/5 shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {portal.portalName}
                    </h3>
                    <a
                      href={portal.portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {portal.portalUrl}
                    </a>
                  </div>
                  <Badge>Saved portal</Badge>
                </div>

                <div className="space-y-3 rounded-xl border border-border/60 bg-card/70 p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="min-w-0 truncate">
                      <span className="font-semibold">User ID:</span>{" "}
                      <span className="text-foreground/90">
                        {portal.portalUserId}
                      </span>
                    </p>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-foreground/70 transition hover:bg-muted hover:text-foreground"
                      onClick={() =>
                        handleCopy(
                          portal.portalUserId,
                          `${portal._id}-id`,
                          "User ID",
                        )
                      }
                      aria-label="Copy user ID"
                    >
                      {copiedField === `${portal._id}-id` ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">Password:</span>
                      <span className="text-foreground/90">
                        {showPassword ? portal.portalPassword : "••••••••"}
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center text-foreground/70 transition hover:text-foreground"
                        onClick={() => togglePasswordVisibility(portal._id)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </p>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-foreground/70 transition hover:bg-muted hover:text-foreground"
                      onClick={() =>
                        handleCopy(
                          portal.portalPassword,
                          `${portal._id}-password`,
                          "Password",
                        )
                      }
                      aria-label="Copy password"
                    >
                      {copiedField === `${portal._id}-password` ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {portal.description ? (
                    <p>
                      <span className="font-semibold">Description:</span>{" "}
                      {portal.description}
                    </p>
                  ) : null}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(portal)}
                  >
                    Edit
                  </Button>
                  <Button size="sm" onClick={() => deleteJobPortal(portal._id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredPortals.length === 0 ? (
          <Card className="text-sm text-foreground/65">
            No portals found.{" "}
            {search
              ? "Try another search."
              : "Click Add portal to save your first portal."}
          </Card>
        ) : null}
      </div>
    </AppShell>
  );
}
