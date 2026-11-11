import { supabase } from "@/lib/supabase";

export async function listCms(type, { includeDrafts = false } = {}) {
  let query = supabase.from("cms_content").select("*").eq("type", type).order("sort_order").order("created_at");
  if (!includeDrafts) query = query.eq("published", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((row) => ({ ...row, ...(row.content || {}) }));
}

export async function saveCms(type, item) {
  const { id, slug, title, published = true, sort_order = 0, ...content } = item;
  const payload = { type, slug: slug || crypto.randomUUID(), title: title || "Untitled", published, sort_order: Number(sort_order) || 0, content };
  const query = id ? supabase.from("cms_content").update(payload).eq("id", id) : supabase.from("cms_content").insert(payload);
  const { data, error } = await query.select("*").single();
  if (error) throw error;
  return { ...data, ...(data.content || {}) };
}

export async function deleteCms(id) {
  const { error } = await supabase.from("cms_content").delete().eq("id", id);
  if (error) throw error;
}

export async function getSiteSettings() {
  const rows = await listCms("setting");
  return Object.fromEntries(rows.map((row) => [row.slug, row.value || ""]));
}

export async function isCmsInitialized(type) {
  const rows = await listCms("setting");
  return rows.some((row) => row.slug === `cms_initialized_${type}`);
}

export async function markCmsInitialized(type) {
  const { data, error } = await supabase.from("cms_content").select("id").eq("type", "setting").eq("slug", `cms_initialized_${type}`).maybeSingle();
  if (error) throw error;
  if (data) return;
  await saveCms("setting", { slug: `cms_initialized_${type}`, title: `Internal CMS marker: ${type}`, value: "true", published: true, sort_order: -1000 });
}

export async function uploadWebsiteImage(file) {
  if (!file?.type?.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Image must be smaller than 8 MB.");
  const path = `${Date.now()}-${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const { error } = await supabase.storage.from("website-media").upload(path, file, { upsert: false });
  if (error) throw error;
  return supabase.storage.from("website-media").getPublicUrl(path).data.publicUrl;
}
