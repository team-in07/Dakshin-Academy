
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";

let tutorsPromise = null;

// Clear cached tutor data after admin updates.
export function clearTutorsCache() {
  tutorsPromise = null;
}

// Normalize tutor data from Supabase or CSV.
function normalizeTutor(tutor) {
  let programSlugs =
    tutor.programSlugs ?? tutor.program_slugs ?? [];

  if (typeof programSlugs === "string") {
    try {
      programSlugs = JSON.parse(programSlugs || "[]");
    } catch {
      programSlugs = programSlugs
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  if (
    Array.isArray(programSlugs) &&
    programSlugs.includes("sat-ap-preparation")
  ) {
    const subjectList = String(tutor.subjects ?? "");

    programSlugs = programSlugs.filter(
      (slug) => slug !== "sat-ap-preparation"
    );

    if (/\bSAT\b/i.test(subjectList)) {
      programSlugs.push("sat-preparation");
    }

    if (/\bAP\b/i.test(subjectList)) {
      programSlugs.push("ap-exam-preparation");
    }
  }

  return {
    ...tutor,

    // Support both database image column formats.
    photoUrl:
      tutor.photoUrl ||
      tutor.photo_url ||
      tutor.imageUrl ||
      tutor.image_url ||
      "",

    sortOrder: Number(
      tutor.sortOrder ?? tutor.sort_order ?? 0
    ),

    programSlugs: Array.isArray(programSlugs)
      ? programSlugs
      : [],
  };
}

// Load tutors from Supabase.
async function loadTutors() {
  const { data, error } = await supabase
    .from("tutors")
    .select("*")
    .eq("is_published", true)
    .limit(200);

  if (error) {
    console.error("Supabase tutor loading failed:", error);

    // Use CSV only if Supabase is unavailable.
    console.info("Loading tutor profiles from CSV.");

    const response = await fetch("/data/tutors.csv");

    if (!response.ok) {
      throw new Error("Unable to load tutors from Supabase or CSV.");
    }

    const csv = await response.text();

    const result = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    if (result.errors.length) {
      throw new Error("Error reading tutors CSV.");
    }

    return result.data
      .map(normalizeTutor)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // If Supabase successfully returns no published tutors,
  // return an empty array instead of showing old CSV data.
  if (!data || data.length === 0) {
    console.info("No published tutors found in Supabase.");
    return [];
  }

  const tutors = data
    .map(normalizeTutor)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  console.log(
    "Tutors loaded from Supabase:",
    tutors.map((tutor) => ({
      name: tutor.name,
      photoUrl: tutor.photoUrl,
    }))
  );

  return tutors;
}

// Public function used by website pages.
export async function getTutors() {
  if (!tutorsPromise) {
    tutorsPromise = loadTutors().catch((error) => {
      tutorsPromise = null;
      throw error;
    });
  }

  return tutorsPromise;
}
