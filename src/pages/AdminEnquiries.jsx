import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";

const STATUSES = [["new", "New"], ["contacted", "Contacted"], ["assessment_booked", "Assessment booked"], ["enrolled", "Enrolled"], ["closed", "Closed"]];

export default function AdminEnquiries() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const isAdmin = user?.role === "admin";
  const { data, isLoading } = useQuery({ queryKey: ["enquiries"], enabled: isAdmin, queryFn: () => base44.entities.Enquiry.list("-created_date", 200) });
  const items = data?.items ?? [];

  if (!isAdmin) return <div className="mx-auto max-w-xl px-6 py-32 text-center"><h1 className="text-2xl font-semibold text-brand-green">Admin access only</h1><p className="mt-2 text-slate-600">Please sign in with an administrator account.</p><Link to="/" className="mt-6 inline-block text-brand-orange">Back to home</Link></div>;

  const setStatus = async (id, followUpStatus) => {
    await base44.entities.Enquiry.update(id, { followUpStatus });
    qc.invalidateQueries({ queryKey: ["enquiries"] });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-brand-green">Enquiry tracker</h1>
      <p className="mb-8 mt-1 text-slate-600">{items.length} enquiries · update follow-up status as you contact families.</p>
      {isLoading ? <p>Loading…</p> : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-brand-green text-white"><tr>{["Date", "Parent / Student", "Program", "Contact", "Timing", "Source", "Follow-up"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {items.map((e) => (
                <tr key={e.id} className="align-top">
                  <td className="px-4 py-3 whitespace-nowrap">{format(new Date(e.created_date), "dd MMM yyyy, HH:mm")}</td>
                  <td className="px-4 py-3"><p className="font-semibold">{e.parentName}</p><p className="text-slate-500">{e.studentName} · Grade {e.grade || "—"}</p>{e.message && <p className="mt-1 max-w-xs text-xs text-slate-500">{e.message}</p>}</td>
                  <td className="px-4 py-3">{e.program || "—"}</td>
                  <td className="px-4 py-3"><a className="block text-brand-green" href={`tel:${e.phone}`}>{e.phone}</a><a className="text-slate-500" href={`mailto:${e.email}`}>{e.email}</a></td>
                  <td className="px-4 py-3">{e.preferredTiming || "—"}</td>
                  <td className="px-4 py-3">{e.source}</td>
                  <td className="px-4 py-3"><select value={e.followUpStatus || "new"} onChange={(ev) => setStatus(e.id, ev.target.value)} className="rounded-lg border px-2 py-2">{STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No enquiries yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}