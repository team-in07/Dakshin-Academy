

import Papa from "papaparse";
import { supabase } from "@/lib/supabase";

let tutorsPromise;

function normalizeTutor(tutor) {
  let programSlugs =
    tutor.programSlugs ?? tutor.program_slugs ?? [];

  if (typeof programSlugs === "string") {
    try {
      programSlugs = JSON.parse(programSlugs || "[]");
    } catch {
      programSlugs = [];
    }
  }

  if (Array.isArray(programSlugs) && programSlugs.includes("sat-ap-preparation")) {
    const subjectList = String(tutor.subjects ?? "");
    programSlugs = programSlugs.filter((slug) => slug !== "sat-ap-preparation");
    if (/\bSAT\b/i.test(subjectList)) programSlugs.push("sat-preparation");
    if (/\bAP\b/i.test(subjectList)) programSlugs.push("ap-exam-preparation");
  }

  return {
    ...tutor,
    sortOrder: Number(tutor.sortOrder ?? tutor.sort_order ?? 0),
    programSlugs: Array.isArray(programSlugs) ? programSlugs : [],
  };
}

async function loadTutors() {
  try {
    const { data, error } = await supabase
      .from("tutors")
      .select("*")
      .limit(200);

    if (error) throw error;

    if (data?.length) {
      return data
        .map(normalizeTutor)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }
  } catch (error) {
    console.info(
      "Using published tutor profiles from CSV.",
      error.message
    );
  }

  const response = await fetch("/data/tutors.csv");

  if (!response.ok) {
    throw new Error("Unable to load tutors.csv");
  }

  const csv = await response.text();

  const result = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length) {
    throw new Error("Error reading tutors CSV");
  }

  return result.data
    .map(normalizeTutor)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getTutors() {
  if (!tutorsPromise) {
    tutorsPromise = loadTutors().catch((error) => {
      tutorsPromise = null;
      throw error;
    });
  }

  return tutorsPromise;
}
