import Papa from "papaparse";
import { base44 } from "@/api/base44Client";

let testimonialsPromise;

export async function getTestimonials() {
  try {
    const result = await base44.entities.Testimonial.list("sortOrder", 200);
    if (result?.items?.length) return result.items.filter((item) => item.permissionGranted === true || String(item.permissionGranted).toLowerCase() === "true").map((item) => ({ ...item, isSample: false })).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  } catch (error) {
    console.info("Using published stories until the content service is available.", error);
  }
  if (!testimonialsPromise) {
    testimonialsPromise = fetch("/data/testimonials.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load testimonials.csv");
        }
        return response.text();
      })
      .then((csv) => {
        const result = Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
        });

        if (result.errors.length) {
          throw new Error("Error reading testimonials CSV");
        }

        return result.data
          .filter(
            (item) =>
              item.permissionGranted?.trim().toLowerCase() === "true" &&
              item.quote?.trim()
          )
          .map((item) => ({
            ...item,
            sortOrder: Number(item.sortOrder) || 0,
            isSample: item.is_sample?.trim().toLowerCase() === "true",
          }))
          .sort((a, b) => a.sortOrder - b.sortOrder);
      })
      .catch((error) => {
        testimonialsPromise = null;
        throw error;
      });
  }

  return testimonialsPromise;
}
