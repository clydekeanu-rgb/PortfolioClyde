"use server";

import { adminSupabase } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function submitComment(formData: FormData) {
  const postId = formData.get("postId") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const body = formData.get("body") as string;

  if (!postId || !name || !email || !body) {
    return { success: false };
  }

  const { error } = await adminSupabase.from("comments").insert({
    post_id: postId,
    name,
    email,
    body,
    approved: false,
  });

  if (error) {
    return { success: false };
  }

  revalidatePath(`/blog/`);
  return { success: true };
}
