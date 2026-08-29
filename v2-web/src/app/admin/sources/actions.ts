"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

const text = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};
const nullable = (formData: FormData, key: string) => text(formData, key) || null;

export async function createSource(formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = text(formData, "title");
  const url = text(formData, "url");
  const sourceType = text(formData, "source_type");
  if (!title || !url || !sourceType) throw new Error("title, url and source_type are required");

  const { error } = await supabase.from("sources").insert({
    title,
    url,
    source_type: sourceType,
    publisher: nullable(formData, "publisher"),
    published_at: nullable(formData, "published_at"),
    accessed_at: new Date().toISOString(),
    reliability_level: nullable(formData, "reliability_level"),
    notes: nullable(formData, "notes"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/sources");
  redirect("/admin/sources");
}

export async function createPatch(formData: FormData) {
  const { supabase } = await requireAdmin();
  const versionLabel = text(formData, "version_label");
  if (!versionLabel) throw new Error("version_label is required");
  const makeCurrent = formData.get("is_current") === "on";

  const { data: patch, error } = await supabase
    .from("patches")
    .insert({
      version_label: versionLabel,
      name: nullable(formData, "name"),
      released_at: nullable(formData, "released_at"),
      official_url: nullable(formData, "official_url"),
      notes: nullable(formData, "notes"),
      is_current: false,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  if (makeCurrent) {
    const { error: switchError } = await supabase.rpc("set_current_patch", { target_patch_id: patch.id });
    if (switchError) throw new Error(switchError.message);
  }

  revalidatePath("/admin/sources");
  revalidatePath("/coach");
  redirect("/admin/sources");
}

export async function setCurrentPatch(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("set_current_patch", { target_patch_id: id });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/sources");
  revalidatePath("/coach");
}
