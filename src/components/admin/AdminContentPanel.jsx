import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import { deleteCms, isCmsInitialized, listCms, markCmsInitialized, saveCms, uploadWebsiteImage } from "@/data/cms";
import { PROGRAMS } from "@/data/programs";
import { FAQS } from "@/data/site";
import { DEFAULT_SLIDES } from "@/components/home/Hero";
import { DEFAULT_SITE_SECTIONS } from "@/data/defaultSiteSections";
import { DEFAULT_SITE_SETTINGS } from "@/data/defaultSiteSettings";

const TYPES = [
  ["program", "Programs"], ["hero_slide", "Hero announcements"], ["faq", "FAQs"],
  ["section", "Website sections"], ["setting", "Website settings"],
];
const FIELDS = {
  program: ["short", "seoTitle", "seoDesc", "audience", "topics", "benefits", "format", "tutorFocus", "fee", "imageUrl", "ctaText", "ctaLink"],
  hero_slide: ["eyebrow", "description", "imageUrl", "ctaText", "ctaLink"],
  faq: ["group", "answer"],
  section: ["page", "eyebrow", "heading", "body", "imageUrl", "ctaText", "ctaLink"],
  setting: ["value"],
};
const ARRAY_FIELDS = new Set(["topics", "benefits", "format", "tutorFocus"]);
const LABELS = { seoDesc: "Search description", seoTitle: "Browser/search title", imageUrl: "Image URL", ctaLink: "Button link", ctaText: "Button text", tutorFocus: "Tutor subjects (comma separated)" };
const blank = (type) => ({ type, slug: "", title: "", published: false, sort_order: 0, ...(type === "program" ? { topics: [], benefits: [], format: [], tutorFocus: [] } : {}) });

export default function AdminContentPanel({ type, notify }) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const fields = FIELDS[type] || [];
  const label = useMemo(() => TYPES.find(([key]) => key === type)?.[1] || type, [type]);

  async function refresh() {
    try {
      let saved = await listCms(type, { includeDrafts: true });
      let defaults = [];
      if (type === "program") defaults = PROGRAMS.map((item, index) => ({ ...item, id: null, type, title: item.title, slug: item.slug, published: true, sort_order: index }));
      if (type === "hero_slide") defaults = DEFAULT_SLIDES.map((item, index) => ({ ...item, id: null, type, title: item.eyebrow, slug: `announcement-${index + 1}`, published: true, sort_order: index }));
      if (type === "faq") defaults = FAQS.flatMap((group, g) => group.items.map((item, i) => ({ type, id: null, slug: `faq-${g + 1}-${i + 1}`, title: item.q, answer: item.a, group: group.group, published: true, sort_order: g * 10 + i })));
      if (type === "section") defaults = DEFAULT_SITE_SECTIONS.map((item) => ({ ...item, type, id: null }));
      if (type === "setting") defaults = DEFAULT_SITE_SETTINGS.map((item) => ({ ...item, type, id: null }));
      const managedTypes = ["program", "hero_slide", "faq", "section", "setting"];
      const wasInitialized = managedTypes.includes(type) ? await isCmsInitialized(type) : true;
      const existingSlugs = new Set(saved.map((item) => item.slug));
      const missingDefaults = defaults.filter((item) => !existingSlugs.has(item.slug));
      if (!wasInitialized && missingDefaults.length) {
        for (const item of missingDefaults) await saveCms(type, item);
        saved = await listCms(type, { includeDrafts: true });
      }
      if (managedTypes.includes(type)) await markCmsInitialized(type);
      const bySlug = new Map(saved.map((item) => [item.slug, item]));
      const rows = [...defaults.filter((item) => !wasInitialized || bySlug.has(item.slug)).map((item) => ({ ...item, ...(bySlug.get(item.slug) || {}) })), ...saved.filter((item) => !defaults.some((base) => base.slug === item.slug))];
      setItems(type === "setting" ? rows.filter((item) => !item.slug.startsWith("cms_initialized_")) : rows);
    }
    catch (error) { notify(`Could not load ${label.toLowerCase()}: ${error.message}`, true); }
  }
  useEffect(() => { refresh(); }, [type]);

  async function submit(event) {
    event.preventDefault(); setBusy(true);
    const form = new FormData(event.currentTarget);
    const next = { ...editing };
    for (const field of fields) {
      const raw = String(form.get(field) || "").trim();
      if (ARRAY_FIELDS.has(field)) {
        if (field === "format") next[field] = raw.split("\n").map((line) => line.split("|").map((v) => v.trim())).filter((row) => row[0]);
        else next[field] = raw.split("\n").map((v) => v.trim()).filter(Boolean);
      } else if (field === "tutorFocus") next[field] = raw.split(",").map((v) => v.trim()).filter(Boolean);
      else next[field] = raw;
    }
    next.slug = String(form.get("slug") || "").trim() || next.slug || crypto.randomUUID();
    next.title = String(form.get("title") || "").trim();
    next.sort_order = Number(form.get("sort_order")) || 0;
    next.published = editing.is_builtin || form.get("published") === "on";
    try { await saveCms(type, next); setEditing(null); await queryClient.invalidateQueries({ queryKey: ["cms"] }); await queryClient.invalidateQueries({ queryKey: ["programs"] }); await queryClient.invalidateQueries({ queryKey: ["program"] }); await refresh(); notify(`${label} saved.`); }
    catch (error) { notify(`Could not save ${label.toLowerCase()}: ${error.message}`, true); }
    finally { setBusy(false); }
  }
  async function remove(item) {
    const builtin = type === "section" && item.is_builtin;
    if (!window.confirm(builtin ? `Reset “${item.title}” to the website's original text?` : `Delete “${item.title}”?`)) return;
    try {
      if (builtin) await saveCms(type, { ...DEFAULT_SITE_SECTIONS.find((entry) => entry.slug === item.slug), id: item.id, type });
      else await deleteCms(item.id);
      await queryClient.invalidateQueries({ queryKey: ["cms"] }); await queryClient.invalidateQueries({ queryKey: ["programs"] }); await queryClient.invalidateQueries({ queryKey: ["program"] }); await refresh(); notify(builtin ? "Section reset to its original text." : `${label} deleted.`);
    }
    catch (error) { notify(`Could not delete item: ${error.message}`, true); }
  }
  async function upload(event) {
    const file = event.target.files?.[0]; if (!file) return;
    setBusy(true);
    try { const imageUrl = await uploadWebsiteImage(file); setEditing((value) => ({ ...value, imageUrl })); }
    catch (error) { notify(`Image upload failed: ${error.message}`, true); }
    finally { setBusy(false); event.target.value = ""; }
  }
  const textValue = (field, value) => ARRAY_FIELDS.has(field) ? (field === "format" ? (value || []).map((row) => row.join(" | ")).join("\n") : (value || []).join("\n")) : field === "tutorFocus" ? (value || []).join(", ") : value || "";

  return <section className="rounded-xl border border-border bg-card">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5"><div><h3 className="text-lg font-semibold">{label}</h3><p className="mt-1 text-sm text-muted-foreground">{type === "section" ? "Edit existing homepage headings and descriptions, or add a custom section for any page." : type === "setting" ? "Update the phone, WhatsApp, and website details displayed on the public site." : "Add, edit, publish, or remove items shown on the public website."}</p></div><button onClick={() => setEditing(blank(type))} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4"/> Add {label.replace(/s$/, "")}</button></div>
    {items.length === 0 ? <p className="p-8 text-sm text-muted-foreground">No saved items yet. The website continues to use its built-in content until you publish a CMS item.</p> : <div className="divide-y">{items.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-semibold">{item.title}</p><p className="text-xs text-muted-foreground">/{item.slug} · {item.published ? "Published" : "Draft"}</p></div><div className="flex gap-2"><button onClick={() => setEditing({ ...blank(type), ...item })} className="rounded-lg border px-3 py-2 text-sm">Edit</button><button onClick={() => remove(item)} aria-label={item.is_builtin ? `Reset ${item.title}` : `Delete ${item.title}`} className="rounded-lg border p-2 text-red-600"><Trash2 className="h-4 w-4"/></button></div></div>)}</div>}
    {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3" onClick={() => setEditing(null)}><form onSubmit={submit} onClick={(event) => event.stopPropagation()} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-5 shadow-xl sm:p-7"><div className="mb-5 flex justify-between"><div><h4 className="text-xl font-bold">{editing.id ? "Edit" : "Add"} {label.replace(/s$/, "")}</h4><p className="text-sm text-muted-foreground">Content changes appear on the public website after publishing.</p></div><button type="button" onClick={() => setEditing(null)} aria-label="Close"><X className="h-5 w-5"/></button></div>
      <div className="grid gap-4 sm:grid-cols-2"><Field name="title" label="Title" value={editing.title}/><Field name="slug" label="Page/section key (URL slug)" value={editing.slug} disabled={editing.is_builtin}/>{fields.map((field) => <Field key={field} name={field} label={LABELS[field] || field.replace(/[A-Z]/g, (x) => ` ${x}`).replace(/^./, (x) => x.toUpperCase())} value={textValue(field, editing[field])} wide={ARRAY_FIELDS.has(field) || ["description", "short", "seoDesc", "audience", "answer", "body", "value"].includes(field)} multiline={ARRAY_FIELDS.has(field) || ["description", "short", "seoDesc", "audience", "answer", "body", "value"].includes(field)}/>)}</div>
      {fields.includes("imageUrl") && <div className="mt-4"><label className="text-sm font-medium">Upload an image (up to 8 MB)</label><div className="mt-2 flex items-center gap-3"><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm"><ImagePlus className="h-4 w-4"/> Choose image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={upload}/></label>{editing.imageUrl && <img src={editing.imageUrl} alt="Selected" className="h-12 w-16 rounded object-cover"/>}</div></div>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2"><Field name="sort_order" label="Display order" type="number" value={editing.sort_order || 0}/><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={editing.published} disabled={editing.is_builtin}/> Published on website {editing.is_builtin && <span className="text-xs text-muted-foreground">(existing section)</span>}</label></div>
      <div className="mt-6 flex justify-end"><button disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:opacity-50"><Save className="h-4 w-4"/>{busy ? "Saving…" : "Save changes"}</button></div></form></div>}
  </section>;
}

function Field({ name, label, value, type = "text", wide = false, multiline = false, disabled = false }) {
  return <label className={`block text-sm font-medium ${wide ? "sm:col-span-2" : ""}`}>{label}<div className="mt-1 text-xs font-normal text-muted-foreground">{disabled ? "Fixed key for linking this existing section" : name === "format" ? "One row per line: Label | Description" : ARRAY_FIELDS.has(name) ? "One item per line" : ""}</div>{multiline ? <textarea name={name} defaultValue={value} rows={3} disabled={disabled} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"/> : <input name={name} type={type} defaultValue={value} disabled={disabled} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-60"/>}</label>;
}
