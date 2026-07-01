"use server";

import { adminSupabase } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

function getAuthRedirectOrigin() {
  const headersList = headers();
  const host =
    headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";

  if (host) {
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://clydeabenojar.site";
}

export async function sendMagicLink(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!email || !adminEmail || email !== adminEmail) {
    return { success: false, error: "Unauthorized." };
  }

  const supabase = createServerSupabaseClient();
  const origin = getAuthRedirectOrigin();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback/`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = (formData.get("excerpt") as string) || null;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "true";

  const { error } = await adminSupabase.from("posts").insert({
    title,
    slug,
    excerpt,
    content,
    published,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/");
  revalidatePath("/blog/");
  return { success: true };
}

export async function updatePost(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = (formData.get("excerpt") as string) || null;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "true";

  const { error } = await adminSupabase
    .from("posts")
    .update({
      title,
      slug,
      excerpt,
      content,
      published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/");
  revalidatePath("/blog/");
  revalidatePath(`/blog/${slug}/`);
  return { success: true };
}

export async function deletePost(id: string) {
  await adminSupabase.from("posts").delete().eq("id", id);
  revalidatePath("/admin/");
  revalidatePath("/blog/");
}

export async function togglePublish(id: string, published: boolean) {
  await adminSupabase
    .from("posts")
    .update({
      published: !published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/");
  revalidatePath("/blog/");
}

export async function approveComment(id: string) {
  await adminSupabase.from("comments").update({ approved: true }).eq("id", id);
  revalidatePath("/admin/");
}

export async function deleteComment(id: string) {
  await adminSupabase.from("comments").delete().eq("id", id);
  revalidatePath("/admin/");
}

export async function logout() {
  redirect("/admin/login/");
}
