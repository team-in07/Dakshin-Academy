import Papa from "papaparse";

let testimonialsPromise;

export async function getTestimonials() {
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
