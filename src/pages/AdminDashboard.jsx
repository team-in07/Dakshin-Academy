
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  X,
  Mail,
  Phone,
  CalendarDays,
  MessageSquare,
  Loader2,
  Inbox,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In Progress" },
  { value: "enrolled", label: "Enrolled" },
  { value: "closed", label: "Closed" },
];

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusClass(status) {
  const styles = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    in_progress: "bg-purple-100 text-purple-700",
    enrolled: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-700",
  };

  return styles[status] || "bg-gray-100 text-gray-700";
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load enquiries from Supabase
  const loadEnquiries = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");
    setSuccess("");

    const { data, error: fetchError } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError("Unable to load enquiries. Please refresh and try again.");
    } else {
      setEnquiries(data || []);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  // Get unique programs for filtering
  const availablePrograms = useMemo(
    () =>
      [...new Set(enquiries.map((item) => item.program).filter(Boolean))]
        .sort(),
    [enquiries]
  );

  // Search and filter enquiries
  const filteredEnquiries = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return enquiries.filter((enquiry) => {
      const matchesSearch =
        !searchTerm ||
        [
          enquiry.parent_name,
          enquiry.student_name,
          enquiry.phone,
          enquiry.email,
          enquiry.program,
          enquiry.grade,
        ].some((value) =>
          String(value || "").toLowerCase().includes(searchTerm)
        );

      const matchesStatus =
        statusFilter === "all" ||
        (enquiry.status || "new") === statusFilter;

      const matchesProgram =
        programFilter === "all" ||
        enquiry.program === programFilter;

      return matchesSearch && matchesStatus && matchesProgram;
    });
  }, [enquiries, search, statusFilter, programFilter]);

  // Dashboard statistics
  const newCount = enquiries.filter(
    (item) => (item.status || "new") === "new"
  ).length;

  const contactedCount = enquiries.filter(
    (item) => item.status === "contacted"
  ).length;

  // Update enquiry status
  async function handleStatusChange(id, newStatus) {
    setUpdatingId(id);
    setError("");
    setSuccess("");

    const { data, error: updateError } = await supabase
      .from("enquiries")
      .update({ status: newStatus })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (updateError) {
      setError("Unable to update enquiry status. Please try again.");
    } else if (!data) {
      setError("Enquiry was not updated. Please check admin permissions.");
    } else {
      setEnquiries((current) =>
        current.map((item) =>
          item.id === id ? { ...item, ...data } : item
        )
      );

      setSelectedEnquiry((current) =>
        current?.id === id ? { ...current, ...data } : current
      );

      setSuccess("Enquiry status updated successfully.");
    }

    setUpdatingId(null);
  }

  // Delete enquiry
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this enquiry? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setSuccess("");

    const { data, error: deleteError } = await supabase
      .from("enquiries")
      .delete()
      .eq("id", id)
      .select("id");

    if (deleteError) {
      setError("Unable to delete enquiry. Please try again.");
    } else if (!data || data.length === 0) {
      setError("Enquiry was not deleted. Please check admin permissions.");
    } else {
      setEnquiries((current) =>
        current.filter((item) => item.id !== id)
      );

      setSelectedEnquiry((current) =>
        current?.id === id ? null : current
      );

      setSuccess("Enquiry deleted successfully.");
    }

    setDeletingId(null);
  }

  // Admin logout
  async function handleLogout() {
    setLoggingOut(true);

    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setLoggingOut(false);
      alert("Unable to sign out. Please try again.");
      return;
    }

    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />

            <div>
              <h1 className="text-lg font-bold">
                Dakshin Academy
              </h1>
              <p className="text-sm text-muted-foreground">
                Administration Portal
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60"
          >
            {loggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}

            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-8">

        {/* Dashboard heading */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />

            <span className="text-sm font-medium text-muted-foreground">
              Admin Dashboard
            </span>
          </div>

          <h2 className="text-3xl font-bold">
            Enquiries Management
          </h2>

          <p className="mt-2 text-muted-foreground">
            View and manage student enquiries submitted through your website.
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        {/* Dashboard statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total Enquiries
              </p>
              <Users className="h-5 w-5 text-primary" />
            </div>

            <p className="mt-3 text-3xl font-bold">
              {enquiries.length}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              New Enquiries
            </p>

            <p className="mt-3 text-3xl font-bold">
              {newCount}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Contacted Enquiries
            </p>

            <p className="mt-3 text-3xl font-bold">
              {contactedCount}
            </p>
          </div>

        </div>

        {/* Enquiries section */}
        <section className="rounded-xl border border-border bg-card">

          {/* Section header */}
          <div className="flex flex-col gap-4 border-b border-border p-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h3 className="text-lg font-semibold">
                Student Enquiries
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {filteredEnquiries.length}{" "}
                {filteredEnquiries.length === 1
                  ? "enquiry"
                  : "enquiries"} found
              </p>
            </div>

            <button
              onClick={() => loadEnquiries(true)}
              disabled={refreshing || loading}
              className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />

              Refresh
            </button>

          </div>

          {/* Search and filters */}
          <div className="flex flex-col gap-3 border-b border-border p-5 md:flex-row">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search parent, student, phone, email or program..."
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All statuses</option>

              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Program filter */}
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All programs</option>

              {availablePrograms.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>

          </div>

          {/* Enquiries table */}
          {loading ? (

            <div className="flex items-center justify-center gap-3 p-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading enquiries...
            </div>

          ) : filteredEnquiries.length === 0 ? (

            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Inbox className="mb-3 h-10 w-10 text-muted-foreground" />

              <h4 className="font-semibold">
                No enquiries found
              </h4>

              <p className="mt-1 text-sm text-muted-foreground">
                Try changing your search or filter.
              </p>
            </div>

          ) : (

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">

                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">
                      Student / Parent
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Program
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Contact
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Date
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Status
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">

                  {filteredEnquiries.map((enquiry) => (

                    <tr key={enquiry.id} className="hover:bg-muted/30">

                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {enquiry.student_name || "—"}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Parent: {enquiry.parent_name || "—"}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Grade: {enquiry.grade || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {enquiry.program || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <p>{enquiry.phone || "—"}</p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {enquiry.email || ""}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {formatDate(enquiry.created_at)}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={enquiry.status || "new"}
                          disabled={updatingId === enquiry.id}
                          onChange={(e) =>
                            handleStatusChange(enquiry.id, e.target.value)
                          }
                          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${getStatusClass(
                            enquiry.status
                          )}`}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option
                              key={status.value}
                              value={status.value}
                            >
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">

                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            title="View enquiry"
                            aria-label="View enquiry"
                            className="rounded-lg border border-border p-2 hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(enquiry.id)}
                            disabled={deletingId === enquiry.id}
                            title="Delete enquiry"
                            aria-label="Delete enquiry"
                            className="rounded-lg border border-border p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === enquiry.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>

                        </div>
                      </td>

                    </tr>

                  ))}

                </tbody>
              </table>
            </div>

          )}

        </section>
      </main>

      {/* Enquiry details modal */}
      {selectedEnquiry && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedEnquiry(null)}
        >

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-dialog-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal header */}
            <div className="mb-6 flex items-start justify-between">

              <div>
                <h3
                  id="enquiry-dialog-title"
                  className="text-xl font-bold"
                >
                  Enquiry Details
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Submitted {formatDate(selectedEnquiry.created_at)}
                </p>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-lg p-2 hover:bg-muted"
                aria-label="Close enquiry details"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Enquiry information */}
            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <p className="text-xs text-muted-foreground">
                  Student Name
                </p>

                <p className="mt-1 font-medium">
                  {selectedEnquiry.student_name || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Parent Name
                </p>

                <p className="mt-1 font-medium">
                  {selectedEnquiry.parent_name || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Grade
                </p>

                <p className="mt-1 font-medium">
                  {selectedEnquiry.grade || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Program
                </p>

                <p className="mt-1 font-medium">
                  {selectedEnquiry.program || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Phone
                </p>

                <p className="mt-1 flex items-center gap-2 font-medium">
                  <Phone className="h-4 w-4" />
                  {selectedEnquiry.phone || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Email
                </p>

                <p className="mt-1 flex items-center gap-2 font-medium">
                  <Mail className="h-4 w-4" />
                  {selectedEnquiry.email || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Preferred Contact
                </p>

                <p className="mt-1 font-medium">
                  {selectedEnquiry.preferred_contact || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Preferred Timing
                </p>

                <p className="mt-1 flex items-center gap-2 font-medium">
                  <CalendarDays className="h-4 w-4" />
                  {selectedEnquiry.preferred_timing || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Timezone
                </p>

                <p className="mt-1 font-medium">
                  {selectedEnquiry.timezone || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Source
                </p>

                <p className="mt-1 font-medium">
                  {selectedEnquiry.source || "—"}
                </p>
              </div>

            </div>

            {/* Additional message */}
            <div className="mt-6">

              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                Additional Message
              </p>

              <p className="mt-2 whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-sm">
                {selectedEnquiry.message || "No additional message."}
              </p>

            </div>

            {/* Update status */}
            <div className="mt-6">

              <label className="text-sm font-medium">
                Update Enquiry Status
              </label>

              <select
                value={selectedEnquiry.status || "new"}
                disabled={updatingId === selectedEnquiry.id}
                onChange={(e) =>
                  handleStatusChange(selectedEnquiry.id, e.target.value)
                }
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

            </div>

            {/* Modal footer */}
            <div className="mt-6 flex justify-end">

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Close
              </button>

            </div>

          </div>
        </div>

      )}

    </div>
  );
}
