"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LegacyResetPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/reset-password");
  }, [router]);

  return null;
}
