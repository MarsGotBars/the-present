// routes/[slug]/index.jsx
import { createAsync } from "@solidjs/router";
import { useParams } from "@solidjs/router";
import { Show } from "solid-js";
import { client } from "~/sanityClient";

// Fetch single presentation by slug (runtime)
const getPresentation = async (slug) => {
  const presentation = await client.fetch(
    `*[_type == "presentation" && slug.current == $slug][0]{
      title,
      slug,
      // add any other fields you need
    }`,
    { slug }
  );
  return presentation;
};

// Generate static pages for each presentation
export const route = {
  prerender: async () => {
    console.log("🔍 Fetching presentations for prerender...");
    // Direct fetch at build time
    const presentations = await client.fetch(
      `*[_type == "presentation"]{ slug }`
    );
    console.log("📊 Found presentations:", presentations);

    if (!presentations || presentations.length === 0) {
      console.warn("⚠️ No presentations found for prerender!");
      return [];
    }

    // Map each presentation to a { slug: "value" } object
    const routes = presentations.map(pres => ({
      slug: pres.slug.current
    }));
    console.log("✅ Prerender routes:", routes);
    return routes;
  }
};

export default function PresentationPage() {
  const params = useParams();
  const presentation = createAsync(() => getPresentation(params.slug));

  return (
    <main>
      <Show when={presentation()} fallback={<p>Loading...</p>}>
        <h1>{presentation().title}</h1>
        {/* Render your presentation content here */}
      </Show>
    </main>
  );
}
