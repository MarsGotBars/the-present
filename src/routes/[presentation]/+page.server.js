import { client } from '$lib/client/sanityClient';

export async function load({ params }) {
  const { presentation: presSlug } = params;

  const data = await client.fetch(
    `*[_type == "presentation" && slug.current == $presSlug][0]{
      title,
      description,
      "slug": slug.current,
      "nextSlide": slides[0]->{
        title,
        "slug": slug.current
      }
    }`,
    { presSlug }
  );

  if (!data) {
    return { status: 404, error: new Error('Presentation not found') };
  }

  return { presentation: data };
}
