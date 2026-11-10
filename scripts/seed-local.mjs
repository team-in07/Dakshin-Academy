
import { readFile } from "node:fs/promises";

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

function asRows(result) {
  if (Array.isArray(result)) return result;
  return result?.items ?? result?.data ?? [];
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
    new URL(`../${filename}`, import.meta.url),
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

// Import tutors without creating duplicates.
const existingTutors = asRows(
  await base44.entities.Tutor.list("sortOrder", 100)
);

let tutorsAdded = 0;

for (const tutor of tutors) {
  if (existingTutors.some((row) => row.name === tutor.name)) {
    continue;
  }

  await base44.entities.Tutor.create(tutor);
  tutorsAdded++;
}

// Import testimonials without creating duplicates.
const existingStories = asRows(
  await base44.entities.Testimonial.list("sortOrder", 100)
);

let storiesAdded = 0;

for (const story of testimonials) {
  if (
    existingStories.some(
      (row) => row.quote === story.quote && row.author === story.author
    )
  ) {
    continue;
  }

  await base44.entities.Testimonial.create(story);
  storiesAdded++;
}

console.log("Local CSV import complete!");
console.log(`Tutors in CSV: ${tutors.length}`);
console.log(`Tutors added: ${tutorsAdded}`);
console.log(`Testimonials in CSV: ${testimonials.length}`);
console.log(`Testimonials added: ${storiesAdded}`);
console.log("Existing records were skipped to avoid duplicates.");
