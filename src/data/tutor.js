
import Papa from "papaparse";

let tutorsPromise;

export async function getTutors() {
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
