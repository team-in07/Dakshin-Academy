
import { supabase } from "@/lib/supabase";

let testimonialsPromise;

export async function getTestimonials() {
  if (!testimonialsPromise) {
    testimonialsPromise = supabase
      .from("testimonials")
      .select("*")
      .eq("permission_granted", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }

        return (data || [])
          .filter((item) => item.quote?.trim())
          .map((item) => ({
            ...item,
            programSlug:
              item.program_slug === "sat-ap-preparation"
                ? /\bAP\b/i.test(`${item.highlight || ""} ${item.quote || ""}`)
                  ? "ap-exam-preparation"
                  : "sat-preparation"
                : item.program_slug,
            sortOrder: Number(item.sort_order) || 0,
            isSample: item.is_sample === true,
          }));
      })
      .catch((error) => {
        testimonialsPromise = null;
        console.error("Unable to load testimonials:", error);
        throw error;
      });
  }

  return testimonialsPromise;
}
