
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, ImagePlus, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadWebsiteImage } from "@/data/cms";
import { clearTutorsCache } from "@/data/tutor";

const DEFINITIONS = {
  tutors: {
    title: "Tutors",
    fields: [
      "name",
      "qualifications",
      "experience",
      "subjects",
      "grades",
      "intro",
      "photoUrl",
      "programSlugs",
      "sortOrder",
    ],
  },

  testimonials: {
    title: "Testimonials & success stories",
    fields: [
      "author",
      "detail",
      "category",
      "highlight",
      "quote",
      "program_slug",
      "sort_order",
    ],
  },
};

export default function AdminEntityPanel({ table, notify }) {
  const queryClient = useQueryClient();
  const config = DEFINITIONS[table];

  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load records
  async function refresh() {
    if (!config) return;

    const orderField =
      table === "tutors" ? "sortOrder" : "sort_order";

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderField);

    if (error) {
      notify(`Could not load ${config.title}: ${error.message}`, true);
      return;
    }

    setRows(data || []);
  }

  useEffect(() => {
    refresh();
  }, [table]);

  // Close editor
  function closeEditor() {
    if (busy || uploading) return;
    setEditing(null);
  }

  // Save record
  async function save(event) {
    event.preventDefault();

    if (uploading) {
      notify("Please wait until the image upload finishes.", true);
      return;
    }

    setBusy(true);

    try {
      const form = new FormData(event.currentTarget);

      const row = {
        id: editing.id || crypto.randomUUID(),
      };

      for (const field of config.fields) {
        if (field === "photoUrl" && table === "tutors") {
          // Save the actual Supabase Storage image URL.
          row.photoUrl = editing.photoUrl || null;
        } else {
          row[field] = String(form.get(field) || "").trim();
        }
      }

      // Convert sort order into a number.
      const orderField =
        table === "tutors" ? "sortOrder" : "sort_order";

      row[orderField] = Number(row[orderField]) || 0;

      // Convert program slugs into an array.
      if (table === "tutors") {
        try {
          row.programSlugs = JSON.parse(
            row.programSlugs || "[]"
          );
        } catch {
          row.programSlugs = row.programSlugs
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      // Testimonial permission.
      if (table === "testimonials") {
        row.permission_granted =
          form.get("permission_granted") === "on";
      }

      // Publish status.
      row.is_published =
        form.get("is_published") === "on";

      // Save to Supabase.
      const { data: savedRow, error } = await supabase
        .from(table)
        .upsert(row)
        .select()
        .single();

      if (error) throw error;

      // Verify the saved tutor image URL.
      if (table === "tutors") {
        console.log("Tutor saved successfully.");
        console.log("Saved image URL:", savedRow.photoUrl);

        if (editing.photoUrl && savedRow.photoUrl !== editing.photoUrl) {
          throw new Error(
            "The saved image URL does not match the uploaded image URL."
          );
        }

        // Clear cached tutor data.
        clearTutorsCache();
      }

      // Refresh React Query data.
      await queryClient.invalidateQueries({
        queryKey: [
          table === "tutors" ? "tutors" : "testimonials",
        ],
      });

      setEditing(null);

      await refresh();

      notify(`${config.title} saved successfully.`);

    } catch (error) {
      console.error("Save error:", error);
      notify(`Could not save item: ${error.message}`, true);
    } finally {
      setBusy(false);
    }
  }

  // Delete record
  async function remove(row) {
    if (
      !window.confirm(
        `Delete "${row.name || row.author}"?`
      )
    ) {
      return;
    }

    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", row.id);

    if (error) {
      notify(`Could not delete item: ${error.message}`, true);
      return;
    }

    if (table === "tutors") {
      clearTutorsCache();
    }

    await queryClient.invalidateQueries({
      queryKey: [
        table === "tutors" ? "tutors" : "testimonials",
      ],
    });

    await refresh();

    notify("Item deleted successfully.");
  }

  // Upload tutor photograph
  async function upload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    // Check file type.
    if (!file.type.startsWith("image/")) {
      notify("Please select a valid image file.", true);
      event.target.value = "";
      return;
    }

    // Maximum file size: 8 MB.
    if (file.size > 8 * 1024 * 1024) {
      notify("Image must be smaller than 8 MB.", true);
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      // Upload image to Supabase Storage.
      const uploadedUrl = await uploadWebsiteImage(file, "tutors");

      if (
        typeof uploadedUrl !== "string" ||
        !uploadedUrl.startsWith("https://")
      ) {
        throw new Error("Supabase did not return a valid public image URL.");
      }

      // Update editor with the newly uploaded URL.
      setEditing((old) => ({
        ...old,
        photoUrl: uploadedUrl,
      }));

      console.log("Uploaded tutor image URL:", uploadedUrl);

      notify("Tutor image uploaded successfully.");

    } catch (error) {
      console.error("Image upload error:", error);
      notify(`Image upload failed: ${error.message}`, true);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  if (!config) {
    return <p>Invalid admin section.</p>;
  }

  return (
    <section className="rounded-xl border border-border bg-card">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b p-5">
        <div>
          <h3 className="font-semibold">{config.title}</h3>

          <p className="text-sm text-muted-foreground">
            Edit records displayed on the public website.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditing({
              is_published: true,
              photoUrl: "",
            })
          }
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Existing Records */}
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex items-center justify-between gap-3 border-b p-4"
        >
          <div>
            <p className="font-medium">
              {row.name || row.author}
            </p>

            <p className="text-xs text-muted-foreground">
              {row.is_published ? "Published" : "Draft"}

              {table === "testimonials" &&
              !row.permission_granted
                ? " · Permission not confirmed"
                : ""}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditing({ ...row })}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => remove(row)}
              aria-label="Delete"
              className="rounded-lg border p-2 text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {/* Add / Edit Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
          onClick={closeEditor}
        >
          <form
            onSubmit={save}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-card p-6"
          >
            {/* Modal Header */}
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-xl font-bold">
                {editing.id ? "Edit" : "Add"}{" "}
                {table === "tutors" ? "tutor" : "story"}
              </h4>

              <button
                type="button"
                onClick={closeEditor}
                disabled={busy || uploading}
                className="rounded-lg border p-2"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              {config.fields
                .filter(
                  (field) =>
                    field !== "photoUrl" ||
                    table !== "tutors"
                )
                .map((field) => (
                  <label
                    key={field}
                    className={`text-sm font-medium ${
                      [
                        "intro",
                        "quote",
                        "programSlugs",
                      ].includes(field)
                        ? "sm:col-span-2"
                        : ""
                    }`}
                  >
                    {field
                      .replace(/[A-Z_]/g, (x) => ` ${x}`)
                      .replace(/^./, (x) => x.toUpperCase())}

                    {[
                      "intro",
                      "quote",
                      "programSlugs",
                    ].includes(field) ? (
                      <textarea
                        name={field}
                        rows={3}
                        defaultValue={
                          Array.isArray(editing[field])
                            ? editing[field].join(", ")
                            : editing[field] || ""
                        }
                        className="mt-1 w-full rounded-lg border bg-background p-2"
                      />
                    ) : (
                      <input
                        name={field}
                        defaultValue={editing[field] || ""}
                        className="mt-1 w-full rounded-lg border bg-background p-2"
                      />
                    )}
                  </label>
                ))}
            </div>

            {/* Tutor Image Upload */}
            {table === "tutors" && (
              <div className="mt-5">
                <label className="block text-sm font-medium">
                  Tutor Photograph
                </label>

                <div className="mt-2 rounded-xl border-2 border-dashed border-border p-5">

                  <label className="flex cursor-pointer flex-col items-center gap-2 text-center">
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />

                    <span className="font-medium">
                      Choose tutor image
                    </span>

                    <span className="text-xs text-muted-foreground">
                      JPG, PNG or WebP. Maximum 8 MB.
                    </span>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={upload}
                      disabled={uploading || busy}
                      className="mt-2 block w-full text-sm"
                    />
                  </label>

                  {uploading && (
                    <p className="mt-3 text-center text-sm text-primary">
                      Uploading image...
                    </p>
                  )}

                  {/* Uploaded Image Preview */}
                  {editing.photoUrl && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium">
                        Image Preview
                      </p>

                      <img
                        key={editing.photoUrl}
                        src={editing.photoUrl}
                        alt="Tutor preview"
                        className="h-40 w-32 rounded-xl border object-cover"
                        onError={() =>
                          notify(
                            "Image preview could not load. Please check the uploaded image URL.",
                            true
                          )
                        }
                      />

                      <p className="mt-2 break-all text-xs text-muted-foreground">
                        Image URL: {editing.photoUrl}
                      </p>
                    </div>
                  )}

                  {!editing.photoUrl && !uploading && (
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      No tutor photograph selected.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Testimonial Permission */}
            {table === "testimonials" && (
              <label className="mt-4 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="permission_granted"
                  defaultChecked={editing.permission_granted}
                />
                Parent/student permission to publish
              </label>
            )}

            {/* Publish */}
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={editing.is_published}
              />
              Published on website
            </label>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEditor}
                disabled={busy || uploading}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={busy || uploading}
                className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : busy
                    ? "Saving..."
                    : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
