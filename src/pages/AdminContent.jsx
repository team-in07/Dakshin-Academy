import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { PROGRAMS } from "@/data/programs";
import { DEFAULT_SLIDES } from "@/components/home/Hero";

const TABS = ["Hero slides", "Tutors", "Success stories", "Programs"];
const emptySlide = { eyebrow: "", title: "", description: "", imageUrl: "", buttonText: "", buttonLink: "/contact#enquiry", sortOrder: 0, isActive: true };
const emptyTutor = { name: "", qualifications: "", experience: "", subjects: "", grades: "", intro: "", photoUrl: "", programSlugs: [], sortOrder: 0 };
const emptyStory = { category: "parent_review", quote: "", author: "", detail: "", highlight: "", programSlug: "", permissionGranted: false, sortOrder: 0 };
const inputClass = "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10";
const Field = ({ label, children }) => <label className="block text-sm font-medium text-slate-700">{label}{children}</label>;

function AdminOnly() {
  return <div className="mx-auto max-w-xl px-6 py-32 text-center"><h1 className="text-2xl font-semibold text-brand-green">Admin access only</h1><p className="mt-2 text-slate-600">Sign in with an administrator account to edit website content.</p><Link to="/" className="mt-6 inline-block text-brand-orange">Back to home</Link></div>;
}

export default function AdminContent() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [tab, setTab] = useState(TABS[0]);
  const [editing, setEditing] = useState(null);
  const [programSlug, setProgramSlug] = useState(PROGRAMS[0].slug);
  const seededSlides = useRef(false);
  const qc = useQueryClient();
  const slides = useQuery({ queryKey: ["admin-content", "slides"], enabled: isAdmin, queryFn: async () => (await base44.entities.HeroSlide.list("sortOrder", 100))?.items || [] });
  const tutors = useQuery({ queryKey: ["tutors", "all"], enabled: isAdmin, queryFn: async () => (await base44.entities.Tutor.list("sortOrder", 200))?.items || [] });
  const stories = useQuery({ queryKey: ["testimonials", "all"], enabled: isAdmin, queryFn: async () => (await base44.entities.Testimonial.list("sortOrder", 200))?.items || [] });
  const programContent = useQuery({ queryKey: ["admin-content", "programs"], enabled: isAdmin, queryFn: async () => (await base44.entities.ProgramContent.list("slug", 100))?.items || [] });
  useEffect(() => {
    if (!isAdmin || !slides.data || slides.data.length > 0 || seededSlides.current) return;
    seededSlides.current = true;
    Promise.all(DEFAULT_SLIDES.map((slide) => base44.entities.HeroSlide.create(slide)))
      .then(() => Promise.all([
        qc.invalidateQueries({ queryKey: ["admin-content", "slides"] }),
        qc.invalidateQueries({ queryKey: ["hero-slides"] }),
      ]))
      .catch(() => { seededSlides.current = false; });
  }, [isAdmin, slides.data, qc]);
  const programRecord = programContent.data?.find((item) => item.slug === programSlug);
  const activeProgram = useMemo(() => {
    if (!programRecord) return PROGRAMS.find((item) => item.slug === programSlug);
    try { return { ...PROGRAMS.find((item) => item.slug === programSlug), ...JSON.parse(programRecord.contentJson) }; } catch { return PROGRAMS.find((item) => item.slug === programSlug); }
  }, [programRecord, programSlug]);
  const save = useMutation({
    mutationFn: async ({ entity, item }) => {
      const { id, created_date, updated_date, created_by_id, ...payload } = item;
      if (id) return base44.entities[entity].update(id, payload);
      return base44.entities[entity].create(payload);
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([qc.invalidateQueries({ queryKey: ["admin-content"] }), qc.invalidateQueries({ queryKey: ["hero-slides"] }), qc.invalidateQueries({ queryKey: ["tutors"] }), qc.invalidateQueries({ queryKey: ["testimonials"] })]);
      if (variables.entity === "ProgramContent") await qc.invalidateQueries({ queryKey: ["admin-content", "programs"] });
      setEditing(null);
    },
  });
  const remove = useMutation({ mutationFn: ({ entity, id }) => base44.entities[entity].delete(id), onSuccess: async () => { await Promise.all([qc.invalidateQueries({ queryKey: ["admin-content"] }), qc.invalidateQueries({ queryKey: ["hero-slides"] }), qc.invalidateQueries({ queryKey: ["tutors"] }), qc.invalidateQueries({ queryKey: ["testimonials"] })]); setEditing(null); } });

  if (!isAdmin) return <AdminOnly />;
  const items = tab === "Hero slides" ? slides.data || [] : tab === "Tutors" ? tutors.data || [] : tab === "Success stories" ? stories.data || [] : PROGRAMS;
  const entity = tab === "Hero slides" ? "HeroSlide" : tab === "Tutors" ? "Tutor" : "Testimonial";
  const startNew = () => setEditing(tab === "Hero slides" ? { ...emptySlide } : tab === "Tutors" ? { ...emptyTutor } : tab === "Success stories" ? { ...emptyStory } : { ...activeProgram });
  const updateField = (field, value) => setEditing((current) => ({ ...current, [field]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (tab === "Programs") {
      const existing = programContent.data?.find((item) => item.slug === editing.slug);
      save.mutate({ entity: "ProgramContent", item: { ...(existing || {}), slug: editing.slug, contentJson: JSON.stringify(editing) } });
    } else save.mutate({ entity, item: editing });
  };
  const tabsKey = `${tab}-${editing?.id || editing?.slug || (editing ? "new" : "list")}`;

  return <main className="mx-auto max-w-7xl px-6 py-12">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">Website administration</p><h1 className="mt-1 text-3xl font-bold text-brand-green">Manage your content</h1><p className="mt-2 text-slate-600">Update the homepage, tutors, success stories and program pages.</p></div><Link to="/admin/enquiries" className="rounded-full border border-brand-green px-5 py-2.5 text-sm font-semibold text-brand-green">Open enquiry tracker</Link></div>
    <div className="mt-8 flex flex-wrap gap-2 border-b pb-3">{TABS.map((name) => <button key={name} onClick={() => { setTab(name); setEditing(null); }} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === name ? "bg-brand-green text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{name}</button>)}</div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.2fr)]">
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3"><h2 className="font-semibold text-brand-green">{tab}</h2>{tab !== "Programs" && <button onClick={startNew} className="rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-white">Add new</button>}</div>
        {tab === "Programs" && <Field label="Choose a program"><select className={inputClass} value={programSlug} onChange={(event) => { setProgramSlug(event.target.value); setEditing(null); }}>{PROGRAMS.map((program) => <option key={program.slug} value={program.slug}>{program.title}</option>)}</select></Field>}
        <div className="mt-4 space-y-2">{items.map((item, index) => <button key={item.id || item.slug || index} onClick={() => { if (tab === "Programs") { setProgramSlug(item.slug); const stored = programContent.data?.find((entry) => entry.slug === item.slug); let overrides = {}; try { overrides = stored ? JSON.parse(stored.contentJson) : {}; } catch { /* Use the built-in program copy if stored content is invalid. */ } setEditing({ ...item, ...overrides }); } else setEditing({ ...item, programSlugs: Array.isArray(item.programSlugs) ? item.programSlugs : [] }); }} className={`block w-full rounded-xl border p-3 text-left transition ${editing?.id === item.id || (tab === "Programs" && editing?.slug === item.slug) ? "border-brand-green bg-brand-green/5" : "border-slate-100 hover:border-slate-300"}`}><span className="block font-medium text-slate-800">{item.title || item.name || item.author || item.slug}</span><span className="mt-1 block line-clamp-1 text-xs text-slate-500">{item.description || item.intro || item.quote || item.short}</span></button>)}{items.length === 0 && tab !== "Programs" && <p className="py-8 text-center text-sm text-slate-500">No saved items yet. Use Add new to create one.</p>}</div>
      </section>
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        {!editing && <div className="py-12 text-center text-slate-500">Select an item to edit, or create a new one.</div>}
        {editing && <form key={tabsKey} onSubmit={submit} className="space-y-4">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-brand-green">{editing.id ? "Edit" : "New"} {tab === "Programs" ? "program page" : tab === "Hero slides" ? "hero slide" : tab === "Tutors" ? "tutor profile" : "success story"}</h2>{editing.id && <button type="button" onClick={() => remove.mutate({ entity, id: editing.id })} className="text-sm font-medium text-red-600">Delete</button>}</div>
          {tab === "Hero slides" && <>
            <Field label="Small heading"><input className={inputClass} value={editing.eyebrow || ""} onChange={(e) => updateField("eyebrow", e.target.value)} /></Field>
            <Field label="Main heading"><input required className={inputClass} value={editing.title || ""} onChange={(e) => updateField("title", e.target.value)} /></Field>
            <Field label="Description"><textarea rows={4} className={inputClass} value={editing.description || ""} onChange={(e) => updateField("description", e.target.value)} /></Field>
            <Field label="Background image URL"><input className={inputClass} type="url" value={editing.imageUrl || ""} onChange={(e) => updateField("imageUrl", e.target.value)} /></Field>
            {editing.imageUrl && <img src={editing.imageUrl} alt="Slide preview" className="h-32 w-full rounded-xl object-cover" />}
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Button text"><input className={inputClass} value={editing.buttonText || ""} onChange={(e) => updateField("buttonText", e.target.value)} /></Field><Field label="Button destination"><input className={inputClass} placeholder="/contact#enquiry or https://…" value={editing.buttonLink || ""} onChange={(e) => updateField("buttonLink", e.target.value)} /></Field></div>
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Display order"><input className={inputClass} type="number" value={editing.sortOrder || 0} onChange={(e) => updateField("sortOrder", Number(e.target.value))} /></Field><Field label="Visibility"><select className={inputClass} value={editing.isActive === false ? "false" : "true"} onChange={(e) => updateField("isActive", e.target.value === "true")}><option value="true">Visible</option><option value="false">Hidden</option></select></Field></div>
          </>}
          {tab === "Tutors" && <>
            <Field label="Tutor name"><input required className={inputClass} value={editing.name || ""} onChange={(e) => updateField("name", e.target.value)} /></Field>
            <Field label="Qualifications"><input className={inputClass} value={editing.qualifications || ""} onChange={(e) => updateField("qualifications", e.target.value)} /></Field>
            <Field label="Teaching experience"><input className={inputClass} value={editing.experience || ""} onChange={(e) => updateField("experience", e.target.value)} /></Field>
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Subjects taught"><input className={inputClass} value={editing.subjects || ""} onChange={(e) => updateField("subjects", e.target.value)} /></Field><Field label="Grades"><input className={inputClass} value={editing.grades || ""} onChange={(e) => updateField("grades", e.target.value)} /></Field></div>
            <Field label="Short introduction"><textarea rows={3} className={inputClass} value={editing.intro || ""} onChange={(e) => updateField("intro", e.target.value)} /></Field>
            <Field label="Photo URL"><input type="url" className={inputClass} value={editing.photoUrl || ""} onChange={(e) => updateField("photoUrl", e.target.value)} /></Field>
            <Field label="Programs taught"><select multiple className={`${inputClass} min-h-28`} value={editing.programSlugs || []} onChange={(e) => updateField("programSlugs", Array.from(e.target.selectedOptions, (option) => option.value))}>{PROGRAMS.map((program) => <option key={program.slug} value={program.slug}>{program.title}</option>)}</select></Field>
          </>}
          {tab === "Success stories" && <>
            <Field label="Story type"><select className={inputClass} value={editing.category || "parent_review"} onChange={(e) => updateField("category", e.target.value)}>{[["parent_review","Parent review"],["student_achievement","Student achievement"],["score_improvement","Score improvement"],["competition_result","Competition result"],["student_project","Student project"]].map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
            <Field label="Review or story"><textarea required rows={4} className={inputClass} value={editing.quote || ""} onChange={(e) => updateField("quote", e.target.value)} /></Field>
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Display name"><input className={inputClass} value={editing.author || ""} onChange={(e) => updateField("author", e.target.value)} /></Field><Field label="Context"><input className={inputClass} value={editing.detail || ""} onChange={(e) => updateField("detail", e.target.value)} /></Field></div>
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Achievement highlight"><input className={inputClass} value={editing.highlight || ""} onChange={(e) => updateField("highlight", e.target.value)} /></Field><Field label="Related program"><select className={inputClass} value={editing.programSlug || ""} onChange={(e) => updateField("programSlug", e.target.value)}><option value="">All programs</option>{PROGRAMS.map((program) => <option key={program.slug} value={program.slug}>{program.title}</option>)}</select></Field></div>
            <label className="flex items-start gap-2 text-sm text-slate-700"><input type="checkbox" checked={!!editing.permissionGranted} onChange={(e) => updateField("permissionGranted", e.target.checked)} className="mt-1" />Parent permission received for any real student name or photo</label>
          </>}
          {tab === "Programs" && <>
            <Field label="Program title"><input required className={inputClass} value={editing.title || ""} onChange={(e) => updateField("title", e.target.value)} /></Field>
            <Field label="Short description"><textarea rows={2} className={inputClass} value={editing.short || ""} onChange={(e) => updateField("short", e.target.value)} /></Field>
            <Field label="Who this program is for"><textarea rows={3} className={inputClass} value={editing.audience || ""} onChange={(e) => updateField("audience", e.target.value)} /></Field>
            <Field label="Topics covered (one per line)"><textarea rows={5} className={inputClass} value={(editing.topics || []).join("\n")} onChange={(e) => updateField("topics", e.target.value.split("\n").filter(Boolean))} /></Field>
            <Field label="Benefits (one per line)"><textarea rows={5} className={inputClass} value={(editing.benefits || []).join("\n")} onChange={(e) => updateField("benefits", e.target.value.split("\n").filter(Boolean))} /></Field>
            <Field label="Schedule rows (label: detail, one per line)"><textarea rows={4} className={inputClass} value={(editing.format || []).map(([key, value]) => `${key}: ${value}`).join("\n")} onChange={(e) => updateField("format", e.target.value.split("\n").filter(Boolean).map((row) => { const [key, ...rest] = row.split(":"); return [key.trim(), rest.join(":").trim()]; }))} /></Field>
            <Field label="SEO page title"><input className={inputClass} value={editing.seoTitle || ""} onChange={(e) => updateField("seoTitle", e.target.value)} /></Field>
            <Field label="SEO description"><textarea rows={2} className={inputClass} value={editing.seoDesc || ""} onChange={(e) => updateField("seoDesc", e.target.value)} /></Field>
          </>}
          {(save.isError || remove.isError) && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">Could not save this change. Check your admin access and try again.</p>}
          <button disabled={save.isPending} className="rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{save.isPending ? "Saving…" : "Save changes"}</button>
        </form>}
      </section>
    </div>
  </main>;
}
