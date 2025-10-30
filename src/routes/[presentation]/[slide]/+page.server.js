import { client } from "$lib/client/sanityClient";

export async function load({ params }) {
  const { presentation, slide } = params;

  const presentationData = await client.fetch(
    `*[_type == "presentation" && slug.current == $presentation][0]{
      title,
      description,
      "slug": slug.current,
      slides[]->{
        title,
        "slug": slug.current,
      }
    }`,
    { presentation }
  );

  if (!presentationData) {
    throw new Error("Presentation not found");
  }

  // Find the correct slide by its slug
  const slideData = presentationData.slides.find((s) => s.slug === slide);

  if (!slideData) {
    throw new Error(`Slide "${slide}" not found`);
  }

  return {
    presentation: presentationData,
    slide: slideData,
  };
}
