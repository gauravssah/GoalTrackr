"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/use-app-store";

export default function SignupPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<{ name: string; email: string; password: string; bio: string }>();
  const signup = useAppStore((state) => state.signup);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-lg">
        <h1 className="mb-2 text-3xl font-semibold">Create your workspace</h1>
        <p className="mb-6 text-sm text-foreground/65">Build a calmer, measurable planning system.</p>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            const ok = await signup(values);
            if (ok) router.push("/dashboard");
          })}
        >
          <FieldGroup label="Full name">
            <Input placeholder="Full name" {...register("name")} />
          </FieldGroup>
          <FieldGroup label="Email address">
            <Input placeholder="Email" {...register("email")} />
          </FieldGroup>
          <FieldGroup label="Password">
            <Input placeholder="Password" type="password" {...register("password")} />
          </FieldGroup>
          <FieldGroup label="Bio">
            <Textarea placeholder="Bio" {...register("bio")} />
          </FieldGroup>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
        </form>
        <p className="mt-4 text-sm text-foreground/60">
          Already have an account? <Link className="text-primary" href="/login">Login</Link>
        </p>
      </Card>
    </main>
  );
}
