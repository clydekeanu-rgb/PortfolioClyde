import { LoginForm } from "@/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Clyde Abenojar",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-md border border-border bg-surface p-8 shadow-soft">
        <p className="font-mono text-sm text-accent">Admin /&gt;</p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Sign in</h1>
        <p className="mt-2 text-sm text-secondary">
          Enter your admin email to receive a magic login link.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
