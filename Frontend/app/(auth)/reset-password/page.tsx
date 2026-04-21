"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";

interface ResetPasswordForm {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, handleSubmit, setValue } = useForm<ResetPasswordForm>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const sentStatus = searchParams.get("sent") === "1";
  const emailFromQuery = searchParams.get("email") || "";
  const isGmail = emailFromQuery.toLowerCase().includes("@gmail.com");

  useEffect(() => {
    if (emailFromQuery) {
      setValue("email", emailFromQuery);
    }
  }, [emailFromQuery, setValue]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-semibold">Reset password</h1>
        <p className="mb-6 text-sm text-foreground/65">
          Enter your email, OTP, and your new password.
        </p>
        {sentStatus ? (
          <p className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
            {isGmail
              ? "OTP sent to your Gmail. Please check inbox and spam."
              : "OTP sent to your email. Please check inbox and spam."}
          </p>
        ) : null}

        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            setError(null);

            if (values.password !== values.confirmPassword) {
              setError("Passwords do not match.");
              return;
            }

            setLoading(true);
            try {
              const response = await api.post("/auth/reset-password", {
                email: values.email,
                otp: values.otp,
                password: values.password,
              });

              if (response.data?.token) {
                localStorage.setItem("goaltrackr_token", response.data.token);
              }

              router.push("/dashboard");
            } catch (requestError: unknown) {
              setError(
                requestError instanceof Error
                  ? requestError.message
                  : "Unable to reset password.",
              );
            } finally {
              setLoading(false);
            }
          })}
        >
          <FieldGroup label="Email address">
            <Input placeholder="Email" {...register("email")} />
          </FieldGroup>
          <FieldGroup label="OTP">
            <Input
              placeholder="6-digit OTP"
              inputMode="numeric"
              {...register("otp")}
            />
          </FieldGroup>
          <FieldGroup label="New password">
            <div className="relative">
              <Input
                placeholder="New password"
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FieldGroup>
          <FieldGroup label="Confirm new password">
            <div className="relative">
              <Input
                placeholder="Confirm new password"
                type={showConfirmPassword ? "text" : "password"}
                className="pr-11"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/55 hover:text-foreground"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FieldGroup>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset password"}
          </Button>
        </form>

        <div className="mt-4 space-y-1 text-sm text-foreground/60">
          <p>
            Need OTP?{" "}
            <Link className="text-primary" href="/forgot-password">
              Request OTP
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
