"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginWithGoogle } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth-context";
import toast from "react-hot-toast";

const GoogleCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setError("No authorization code received from Google.");
      return;
    }

    const authenticate = async () => {
      try {
        await loginWithGoogle(code);
        await refreshUser();
        router.replace("/");
      } catch (err) {
        console.error("Google login failed:", err);
        const msg = "Authentication failed. Please try again.";
        setError(msg);
        toast.error(msg);
        setTimeout(() => router.replace("/sign-in"), 3000);
      }
    };

    authenticate();
  }, [searchParams, router, refreshUser]);

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <p>Signing you in...</p>
    </main>
  );
};

const GoogleCallback = () => (
  <Suspense>
    <GoogleCallbackContent />
  </Suspense>
);

export default GoogleCallback;
