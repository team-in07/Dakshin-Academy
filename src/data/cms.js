
import { supabase } from "@/lib/supabase";

// Fetch CMS content
export async function listCms(type, { includeDrafts = false } = {}) {
  let query = supabase
    .from("cms_content")
    .select("*")
    .eq("type", type)
    .order("sort_order")
    .order("created_at");

  if (!includeDrafts) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map((row) => ({
    ...row,
    ...(row.content || {}),
  }));
}

// Save CMS content
export async function saveCms(type, item) {
  const {
    id,
    slug,
    title,
    published = true,
    sort_order = 0,
    ...content
  } = item;

  const payload = {
    type,
    slug: slug || crypto.randomUUID(),
    title: title || "Untitled",
    published,
    sort_order: Number(sort_order) || 0,
    content,
  };

  const query = id
    ? supabase.from("cms_content").update(payload).eq("id", id)
    : supabase.from("cms_content").insert(payload);

  const { data, error } = await query.select("*").single();

  if (error) throw error;

  return {
    ...data,
    ...(data.content || {}),
  };
}

// Delete CMS content
export async function deleteCms(id) {
  const { error } = await supabase
    .from("cms_content")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Get website settings
export async function getSiteSettings() {
  const rows = await listCms("setting");

  return Object.fromEntries(
    rows.map((row) => [row.slug, row.value || ""])
  );
}

// Check CMS initialization
export async function isCmsInitialized(type) {
  const rows = await listCms("setting");

  return rows.some(
    (row) => row.slug === `cms_initialized_${type}`
  );
}

// Mark CMS initialized
export async function markCmsInitialized(type) {
  const { data, error } = await supabase
    .from("cms_content")
    .select("id")
    .eq("type", "setting")
    .eq("slug", `cms_initialized_${type}`)
    .maybeSingle();

  if (error) throw error;

  if (data) return;

  await saveCms("setting", {
    slug: `cms_initialized_${type}`,
    title: `Internal CMS marker: ${type}`,
    value: "true",
    published: true,
    sort_order: -1000,
  });
}

// Upload website images to Supabase Storage
export async function uploadWebsiteImage(file) {
  if (!file) {
    throw new Error("Please select an image.");
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPG, PNG and WebP images are allowed.");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be smaller than 8 MB.");
  }

  const fileExtension = file.name.split(".").pop().toLowerCase();

  const fileName = `${crypto.randomUUID()}.${fileExtension}`;

  const filePath = `tutors/${Date.now()}-${fileName}`;

  // Upload image to Supabase Storage
  const { data, error } = await supabase.storage
    .from("website-media")
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw error;
  }

  // Get public image URL
  const { data: publicData } = supabase.storage
    .from("website-media")
    .getPublicUrl(data.path);

  const imageUrl = publicData?.publicUrl;

  if (!imageUrl) {
    throw new Error("Could not generate public image URL.");
  }

  console.log("Image uploaded successfully:", imageUrl);

  return imageUrl;
}
