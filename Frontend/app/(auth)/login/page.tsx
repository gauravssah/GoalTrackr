"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/use-app-store";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<{
    email: string;
    password: string;
  }>();
  const login = useAppStore((state) => state.login);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-semibold">Login to GoalTrackr</h1>
        <p className="mb-6 text-sm text-foreground/65">
          Continue with your productivity workspace.
        </p>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            const ok = await login(values);
            if (ok) router.push("/dashboard");
          })}
        >
          <FieldGroup label="Email address">
            <Input placeholder="Email" {...register("email")} />
          </FieldGroup>
          <FieldGroup label="Password">
            <div className="relative">
              <Input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                className="pr-11"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/55 hover:text-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FieldGroup>
          <p className="text-right text-sm">
            <Link className="text-primary" href="/forgot-password">
              Forgot password? Get OTP
            </Link>
          </p>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-foreground/60">
          New here?{" "}
          <Link className="text-primary" href="/signup">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  );
}
