// src/routes/[slug]/+page.js
import { client } from "$lib/client/sanityClient";

export const prerender = true;

export async function load({ params }) {
  const query = `*[_type == "presentation"]`;

  const presentation = await client.fetch(query);

  if (!presentation) {
    return {
      status: 404,
      error: new Error('presentation not found')
    };
  }

  return { presentation };
}
