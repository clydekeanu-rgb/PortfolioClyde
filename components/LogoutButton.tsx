"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="v2-btn v2-btn-outline px-4 py-2 text-sm"
    >
      Logout
    </button>
  );
}
