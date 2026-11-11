import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadWebsiteImage } from "@/data/cms";

const DEFINITIONS = {
  tutors: { title: "Tutors", fields: ["name", "qualifications", "experience", "subjects", "grades", "intro", "photoUrl", "programSlugs", "sortOrder"], publish: "is_published" },
  testimonials: { title: "Testimonials & success stories", fields: ["author", "detail", "category", "highlight", "quote", "program_slug", "sort_order"], publish: "is_published" },
};

export default function AdminEntityPanel({ table, notify }) {
  const queryClient = useQueryClient();
  const config = DEFINITIONS[table];
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  async function refresh() {
    const { data, error } = await supabase.from(table).select("*").order(table === "tutors" ? "sortOrder" : "sort_order");
    if (error) notify(`Could not load ${config.title}: ${error.message}`, true); else setRows(data || []);
  }
  useEffect(() => { refresh(); }, [table]);
  async function save(event) {
    event.preventDefault(); setBusy(true);
    const form = new FormData(event.currentTarget); const row = { id: editing.id || crypto.randomUUID() };
    for (const field of config.fields) row[field] = String(form.get(field) || "").trim();
    const orderField = table === "tutors" ? "sortOrder" : "sort_order"; row[orderField] = Number(row[orderField]) || 0;
    if (table === "tutors") { try { row.programSlugs = JSON.parse(row.programSlugs || "[]"); } catch { row.programSlugs = row.programSlugs.split(",").map((x) => x.trim()).filter(Boolean); } }
    if (table === "testimonials") row.permission_granted = form.get("permission_granted") === "on";
    row.is_published = form.get("is_published") === "on";
    try { const { error } = await supabase.from(table).upsert(row); if (error) throw error; setEditing(null); await queryClient.invalidateQueries({ queryKey: [table === "tutors" ? "tutors" : "testimonials"] }); await refresh(); notify(`${config.title} saved.`); }
    catch (error) { notify(`Could not save item: ${error.message}`, true); } finally { setBusy(false); }
  }
  async function remove(row) {
    if (!window.confirm(`Delete “${row.name || row.author}”?`)) return;
    const { error } = await supabase.from(table).delete().eq("id", row.id);
    if (error) notify(`Could not delete item: ${error.message}`, true); else { await queryClient.invalidateQueries({ queryKey: [table === "tutors" ? "tutors" : "testimonials"] }); await refresh(); notify("Item deleted."); }
  }
  async function upload(event) {
    const file = event.target.files?.[0]; if (!file) return; setBusy(true);
    try { const url = await uploadWebsiteImage(file); setEditing((old) => ({ ...old, photoUrl: url })); }
    catch (error) { notify(`Image upload failed: ${error.message}`, true); } finally { setBusy(false); }
  }
  return <section className="rounded-xl border border-border bg-card"><div className="flex items-center justify-between gap-3 border-b p-5"><div><h3 className="font-semibold">{config.title}</h3><p className="text-sm text-muted-foreground">Edit records displayed on the public website.</p></div><button onClick={() => setEditing({ is_published: true })} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4"/>Add</button></div>
    {rows.map((row) => <div key={row.id} className="flex items-center justify-between gap-3 border-b p-4"><div><p className="font-medium">{row.name || row.author}</p><p className="text-xs text-muted-foreground">{row.is_published ? "Published" : "Draft"}{table === "testimonials" && !row.permission_granted ? " · Permission not confirmed" : ""}</p></div><div className="flex gap-2"><button onClick={() => setEditing({ ...row })} className="rounded-lg border px-3 py-2 text-sm">Edit</button><button onClick={() => remove(row)} aria-label="Delete" className="rounded-lg border p-2 text-red-600"><Trash2 className="h-4 w-4"/></button></div></div>)}
    {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3" onClick={() => setEditing(null)}><form onSubmit={save} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-card p-6"><h4 className="mb-4 text-xl font-bold">{editing.id ? "Edit" : "Add"} {table === "tutors" ? "tutor" : "story"}</h4><div className="grid gap-4 sm:grid-cols-2">{config.fields.map((field) => <label key={field} className={`text-sm font-medium ${["intro", "quote", "programSlugs"].includes(field) ? "sm:col-span-2" : ""}`}>{field.replace(/[A-Z_]/g, (x) => ` ${x}`).replace(/^./, (x) => x.toUpperCase())}{["intro", "quote", "programSlugs"].includes(field) ? <textarea name={field} rows={3} defaultValue={Array.isArray(editing[field]) ? editing[field].join(", ") : editing[field] || ""} className="mt-1 w-full rounded-lg border bg-background p-2"/> : <input name={field} defaultValue={editing[field] || ""} className="mt-1 w-full rounded-lg border bg-background p-2"/>}</label>)}</div>{table === "tutors" && <label className="mt-4 block text-sm">Upload tutor image<input type="file" accept="image/*" className="mt-1 block" onChange={upload}/>{editing.photoUrl && <img src={editing.photoUrl} alt="Tutor preview" className="mt-2 h-20 rounded"/>}</label>}{table === "testimonials" && <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" name="permission_granted" defaultChecked={editing.permission_granted}/> Parent/student permission to publish</label>}<label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" name="is_published" defaultChecked={editing.is_published}/> Published on website</label><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className="rounded-lg border px-4 py-2">Cancel</button><button disabled={busy} className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">{busy ? "Saving…" : "Save"}</button></div></form></div>}
  </section>;
}
