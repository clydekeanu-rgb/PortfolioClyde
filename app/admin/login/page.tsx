import { LoginForm } from "@/components/LoginForm";
import { SitePage } from "@/components/PageBackdrop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Clyde Abenojar",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <SitePage variant="admin">
      <main className="flex min-h-[100dvh] items-center justify-center px-6">
        <div className="v2-card w-full max-w-md p-8">
          <p className="v2-eyebrow" style={{ color: "var(--v2-accent-text)" }}>
            {"// admin"}
          </p>
          <h1 className="v2-display mt-2 text-2xl">Sign in</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--v2-muted)" }}>
            Enter your admin email to receive a magic login link.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </main>
    </SitePage>
  );
}
