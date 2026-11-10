
import Papa from "papaparse";
import { base44 } from "@/api/base44Client";

let tutorsPromise;

export async function getTutors() {
  try {
    const result = await base44.entities.Tutor.list("sortOrder", 200);
    if (result?.items?.length) return result.items.map((tutor) => ({ ...tutor, programSlugs: Array.isArray(tutor.programSlugs) ? tutor.programSlugs : JSON.parse(tutor.programSlugs || "[]") })).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  } catch (error) {
    console.info("Using published tutor profiles until the content service is available.", error);
  }
  if (!tutorsPromise) {
    tutorsPromise = fetch("/data/tutors.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load tutors.csv");
        }
        return response.text();
      })
      .then((csv) => {
        const result = Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
        });

        if (result.errors.length) {
          throw new Error("Error reading tutors CSV");
        }

        return result.data
          .map((tutor) => ({
            ...tutor,
            sortOrder: Number(tutor.sortOrder) || 0,
            programSlugs: JSON.parse(tutor.programSlugs || "[]"),
          }))
          .sort((a, b) => a.sortOrder - b.sortOrder);
      })
      .catch((error) => {
        tutorsPromise = null;
        throw error;
      });
  }

  return tutorsPromise;
}
