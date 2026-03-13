"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/use-app-store";
import { formatDate } from "@/lib/utils";

const avatarOptions = [":)", "B)", "8)", ":D", ":P", ":o", ":*", "<3", ":|", ":/"];

function isImageSource(value?: string) {
  if (!value) return false;
  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:image/") || value.startsWith("blob:");
}

export default function ProfilePage() {
  const user = useAppStore((state) => state.user);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const tasks = useAppStore((state) => state.tasks);
  const [form, setForm] = useState({ name: "", bio: "", profileImage: "" });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        bio: user.bio || "",
        profileImage: user.profileImage || ""
      });
    }
  }, [user]);

  const completedTasks = tasks.filter((task) => task.status === "Completed").length;

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setForm((current) => ({ ...current, profileImage: result }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <AppShell>
      <Card className="max-w-4xl">
        {user && (
          <div className="grid gap-6 md:grid-cols-[220px_1fr]">
            <div className="space-y-4">
              {isImageSource(form.profileImage) ? (
                <img
                  src={form.profileImage}
                  alt={user.name}
                  className="h-[220px] w-[220px] rounded-3xl border border-border object-cover"
                />
              ) : (
                <div className="flex h-[220px] w-[220px] items-center justify-center rounded-3xl border border-border bg-card text-6xl font-semibold">
                  {form.profileImage || ":)"}
                </div>
              )}
              <p className="text-sm text-foreground/60">Joined {formatDate(user.joinedDate)}</p>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold">Your profile</h1>
              <FieldGroup label="Name">
                <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </FieldGroup>
              <FieldGroup label="Profile image or avatar" hint="Paste an image URL or choose a quick avatar option.">
                <Input
                  placeholder="Profile image URL or avatar token"
                  value={form.profileImage}
                  onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
                />
              </FieldGroup>
              <FieldGroup label="Upload profile image" hint="Local image choose karke direct preview aur save kar sakte ho.">
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
              </FieldGroup>
              <div>
                <p className="mb-2 text-sm font-medium text-foreground/75">Quick avatar options</p>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-lg transition ${
                        form.profileImage === avatar ? "border-primary bg-primary/10" : "border-border bg-card"
                      }`}
                      onClick={() => setForm({ ...form, profileImage: avatar })}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
              <FieldGroup label="Bio">
                <Textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              </FieldGroup>
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <p>Email: {user.email}</p>
                <p>Total completed tasks: {completedTasks}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => updateProfile(form)}>Update profile</Button>
                <Button variant="outline" onClick={() => setForm((current) => ({ ...current, profileImage: "" }))}>
                  Clear image
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </AppShell>
  );
}
