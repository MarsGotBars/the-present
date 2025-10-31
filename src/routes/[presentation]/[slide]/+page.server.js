import { client } from "$lib/client/sanityClient";

export async function load({ params }) {
  const { presentation, slide } = params;

  const data = await client.fetch(
    `{
      "presentation": *[_type == "presentation" && slug.current == $presentation][0]{
        title,
        description,
        "slug": slug.current,
        "slideRefs": slides[]._ref
      },
      "slide": *[_type == "slide" && slug.current == $slide][0]{
        _id,
        title,
        "slug": slug.current,
        subtitle,
        contentType,
        mediaType,
        notes,
        
        // Conditional fields based on contentType
        contentType == "prosConsBlocks" => {
          "prosConsBlocks": prosConsBlocks[]{
            heading,
            "pros": pros[]{
              _key,
              _type,
              selection,
              listItem,
              description,
              _type == "pro" && defined(image) => {
                "image": image.asset->{
                  _id,
                  url
                }
              }
            },
            "cons": cons[]{
              _key,
              _type,
              selection,
              listItem,
              description,
              _type == "con" && defined(image) => {
                "image": image.asset->{
                  _id,
                  url
                }
              }
            }
          }
        },
        contentType == "slideList" => {
          "slideList": slideList[]->{
            title,
            "slug": slug.current
          }
        },
        
        contentType == "lists" => {
          "lists": lists[]{
            listTitle,
            contentType,
            contentType == "items" => {
              items
            },
            contentType == "images" => {
              "images": images[]{
                title,
                "image": image{
                  asset->{
                    _id,
                    url
                  },
                  alt,
                  caption,
                  hotspot,
                  crop
                }
              }
            }
          }
        },
        
        // Conditional fields based on mediaType
        mediaType == "video" => {
          "video": video.asset->{
            _id,
            url
          }
        },
        
        mediaType == "images" => {
          "images": images[]{
            "asset": asset->{
              _id,
              url
            },
            alt,
            caption,
            format,
            hotspot,
            crop
          }
        }
      }
    }`,
    { presentation, slide }
  );

  if (!data.presentation || !data.slide) {
    throw new Error("Presentation or slide not found");
  }

  // Find current slide index and get next/prev slides
  const currentIndex = data.presentation.slideRefs.indexOf(data.slide._id);
  const nextSlideRef = data.presentation.slideRefs[currentIndex + 1] || null;
  const prevSlideRef = data.presentation.slideRefs[currentIndex - 1] || null;

  // Fetch next slide if it exists
  let nextSlide = null;
  if (nextSlideRef) {
    const nextSlideData = await client.fetch(
      `*[_id == $nextSlideRef][0]{
        title,
        "slug": slug.current
      }`,
      { nextSlideRef }
    );
    nextSlide = nextSlideData;
  }

  // Fetch prev slide if it exists
  let prevSlide = null;
  if (prevSlideRef) {
    const prevSlideData = await client.fetch(
      `*[_id == $prevSlideRef][0]{
        title,
        "slug": slug.current
      }`,
      { prevSlideRef }
    );
    prevSlide = prevSlideData;
  }

  // Calculate element count based on content type
  let elementCount = 0;

  if (
    data.slide.contentType === "prosConsBlocks" &&
    data.slide.prosConsBlocks
  ) {
    elementCount += data.slide.prosConsBlocks.length;
  } else if (data.slide.contentType === "lists" && data.slide.lists) {
    elementCount += data.slide.lists.length;
  } else if (data.slide.contentType === "slideList" && data.slide.slideList) {
    elementCount++;
  }

  // Add media element if exists
  if (data.slide.video || data.slide.images) {
    elementCount += 1;
  }

  return {
    presentation: data.presentation,
    slide: {
      ...data.slide,
      elementCount,
    },
    nextSlide,
    prevSlide,
  };
}
