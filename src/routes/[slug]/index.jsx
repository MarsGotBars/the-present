import { client } from "~/sanityClient";

export async function load({ params }) {
  const { slug } = params;
  const presentation = await client.fetch(
    `*[_type == "presentation"]`,
    { slug }
  );
  if (!presentation) throw new Error("Presentation not found");
  return { presentation };
}


export default function Presentation({ data }) {
  return (
    <div>
      <h1>{data.presentation.title}</h1>
      <ul>
        {data.presentation.slides.map((slide) => (
          <li key={slide._key}>
            <a href={`/${data.presentation.slug.current}/${slide.slug}`}>
              {slide.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
