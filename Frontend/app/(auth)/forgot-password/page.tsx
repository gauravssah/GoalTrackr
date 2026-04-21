"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<ForgotPasswordForm>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-semibold">Forgot password</h1>
        <p className="mb-6 text-sm text-foreground/65">
          Enter your email to receive a 6-digit OTP.
        </p>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            setError(null);
            setLoading(true);

            try {
              await api.post("/auth/forgot-password", values);
              const encodedEmail = encodeURIComponent(values.email);
              router.push(`/reset-password?email=${encodedEmail}&sent=1`);
            } catch (requestError: unknown) {
              setError(
                requestError instanceof Error
                  ? requestError.message
                  : "Unable to send OTP.",
              );
            } finally {
              setLoading(false);
            }
          })}
        >
          <FieldGroup label="Email address">
            <Input placeholder="Email" {...register("email")} />
          </FieldGroup>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </form>

        <div className="mt-4 space-y-1 text-sm text-foreground/60">
          <p>
            Already got OTP?{" "}
            <Link className="text-primary" href="/reset-password">
              Reset password
            </Link>
          </p>
          <p>
            Back to{" "}
            <Link className="text-primary" href="/login">
              Login
            </Link>
          </p>
        </div>
      </Card>
    </main>
  );
}
