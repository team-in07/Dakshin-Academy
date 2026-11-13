
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

// Reads a CSV file, including quoted fields and commas inside quotes.
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (insideQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        insideQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"' && field.length === 0) {
        insideQuotes = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (char !== "\r") {
        field += char;
      }
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [headerRow, ...dataRows] = rows;

  if (!headerRow) {
    throw new Error("The CSV file is empty.");
  }

  const headers = headerRow.map((header) =>
    header.replace(/^\uFEFF/, "").trim()
  );

  return dataRows
    .filter((values) => values.some((value) => value.trim() !== ""))
    .map((values) =>
      Object.fromEntries(
        headers.map((header, index) => [
          header,
          values[index] ?? "",
        ])
      )
    );
}

function parseNumber(value, fieldName) {
  const number = Number(value || 0);

  if (!Number.isFinite(number)) {
    throw new Error(`Invalid number in ${fieldName}: ${value}`);
  }

  return number;
}

async function readCSV(filename) {
  const text = await readFile(
    new URL(`../public/data/${filename}`, import.meta.url),
    "utf8"
  );

  return parseCSV(text);
}

// Read and prepare tutor records.
const tutorCSV = await readCSV("tutors.csv");

const tutors = tutorCSV.map((row, index) => {
  let programSlugs;

  try {
    programSlugs = JSON.parse(row.programSlugs || "[]");
  } catch {
    throw new Error(
      `Invalid programSlugs JSON in tutors.csv, data row ${index + 1}`
    );
  }

  if (!Array.isArray(programSlugs)) {
    throw new Error(
      `programSlugs must be an array in tutors.csv, data row ${index + 1}`
    );
  }

  return {
    name: row.name,
    qualifications: row.qualifications,
    experience: row.experience,
    subjects: row.subjects,
    grades: row.grades,
    intro: row.intro,
    photoUrl: row.photoUrl,
    programSlugs,
    sortOrder: parseNumber(row.sortOrder, "tutors.csv sortOrder"),
  };
});

// Read and prepare testimonial records.
const testimonialCSV = await readCSV("testimonials.csv");

const testimonials = testimonialCSV.map((row) => ({
  category: row.category,
  quote: row.quote,
  author: row.author,
  detail: row.detail,
  highlight: row.highlight,
  programSlug: row.programSlug,
  permissionGranted: ["true", "1", "yes"].includes(
    (row.permissionGranted || "").trim().toLowerCase()
  ),
  sortOrder: parseNumber(row.sortOrder, "testimonials.csv sortOrder"),
}));

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  throw new Error("Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this import.");
}
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const { data: existingTutors, error: tutorReadError } = await supabase.from("tutors").select("name");
if (tutorReadError) throw tutorReadError;
const tutorNames = new Set((existingTutors || []).map((row) => row.name));
const tutorRows = tutors.filter((row) => !tutorNames.has(row.name)).map((row) => ({ ...row, is_published: true }));
if (tutorRows.length) {
  const { error } = await supabase.from("tutors").insert(tutorRows);
  if (error) throw error;
}

const { data: existingStories, error: storyReadError } = await supabase.from("testimonials").select("author,quote");
if (storyReadError) throw storyReadError;
const storyKeys = new Set((existingStories || []).map((row) => `${row.author}\n${row.quote}`));
const storyRows = testimonials
  .filter((row) => !storyKeys.has(`${row.author}\n${row.quote}`))
  .map((row) => ({
    category: row.category,
    quote: row.quote,
    author: row.author,
    detail: row.detail,
    highlight: row.highlight,
    program_slug: row.programSlug,
    permission_granted: row.permissionGranted,
    sort_order: row.sortOrder,
    is_published: false,
  }));
if (storyRows.length) {
  const { error } = await supabase.from("testimonials").insert(storyRows);
  if (error) throw error;
}

console.log("Supabase CSV import complete.");
console.log(`Tutors added: ${tutorRows.length}`);
console.log(`Testimonial records added as drafts: ${storyRows.length}`);
