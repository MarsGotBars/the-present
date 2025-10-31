<script>
  import { goto } from "$app/navigation";
  import { onNavigate } from "$app/navigation";

  let { data } = $props();

  let presentation = $derived(data.presentation);
  let slide = $derived(data.slide);
  let nextSlide = $derived(data.nextSlide);
  let prevSlide = $derived(data.prevSlide);

  let clickIndex = $state(0);
  let totalElements = $derived(slide.elementCount || 0);

  // Reset to 0 or set to max when navigating
  $effect(() => {
    slide;
    const urlParams = new URLSearchParams(window.location.search);
    clickIndex = urlParams.get("revealed") === "all" ? totalElements : 0;
  });

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  function handleClick() {
    if (clickIndex < totalElements) {
      clickIndex++;
    } else if (nextSlide) {
      goto(`/${presentation.slug}/${nextSlide.slug}`);
    } else {
      goto(`/`);
    }
  }

  function handleRightClick(e) {
    if (clickIndex > 0) {
      clickIndex--;
    } else if (prevSlide) {
      goto(`/${presentation.slug}/${prevSlide.slug}?revealed=all`);
    } else {
      goto(`/${presentation.slug}`);
    }
    e.preventDefault();
  }
</script>

<svelte:head>
  <title>{slide.title} - {presentation.title}</title>
</svelte:head>

<!-- Can't get around this one obviously -->
<!-- svelte-ignore a11y_click_events_have_key_events -->

<div
  class="slide-wrapper"
  onclick={handleClick}
  oncontextmenu={handleRightClick}
  role="button"
  tabindex="0"
>
  <header>
    <h1>{slide.title}</h1>
    {#if slide.subtitle}
      <p class="subtitle">{slide.subtitle}</p>
    {/if}
  </header>
  {#if slide.slug === "intro"}
    <section class="frameworks">
      <h2>Frameworks</h2>
      <ul>
        <li>Enhance(.dev)</li>
        <li>LiquidJS + 11ty</li>
        <li>NextJS</li>
      </ul>
    </section>
  {/if}

  <!-- Content based on contentType -->
  <section class="custom-elements">
    {#if slide.contentType === "prosConsBlocks" && slide.prosConsBlocks}
      <div class="pros-cons-wrapper">
        {#each slide.prosConsBlocks as block, i}
          <section class="pros-cons" class:visible={clickIndex === i + 1}>
            <h2>{block.heading}</h2>
            <ul class="columns">
              <li class="pros">
                <h3>Pros</h3>
                <ul>
                  {#each block.pros as pro}
                    <li>
                      <h4>{pro.listItem}</h4>
                      {#if pro.image}
                        <img src={pro.image.url} alt="" class="inline-image" />
                      {:else if pro.description}
                        <p>{pro.description}</p>
                      {/if}
                    </li>
                  {/each}
                </ul>
              </li>
              <li class="cons">
                <h3>Cons</h3>
                <ul>
                  {#each block.cons as con}
                    <li>
                      <h4>{con.listItem}</h4>
                      {#if con.image}
                        <img src={con.image.url} alt="" class="inline-image" />
                      {:else if con.description}
                        <p>{con.description}</p>
                      {/if}
                    </li>
                  {/each}
                </ul>
              </li>
            </ul>
          </section>
        {/each}
      </div>
    {:else if slide.contentType === "slideList" && slide.slideList}
      <div class="slide-list-wrapper" class:visible={clickIndex >= 1}>
        <h2>Slides</h2>
        <ul class="slide-list">
          {#each slide.slideList as linkedSlide}
            <li class="slide-list-item">
              <a href="/{presentation.slug}/{linkedSlide.slug}">
                {linkedSlide.title}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {:else if slide.contentType === "lists" && slide.lists}
      <div class="list-wrapper">
        {#each slide.lists as list, i}
          <section class="list-section" class:visible={clickIndex === i + 1}>
            <h2>{list.listTitle}</h2>

            {#if list.contentType === "items" && list.items}
              <ul>
                {#each list.items as item}
                  <li>{item}</li>
                {/each}
              </ul>
            {:else if list.contentType === "images" && list.images}
              <div class="image-gallery">
                {#each list.images as imageItem}
                  <figure>
                    <img
                      src={imageItem.image.asset.url}
                      alt={imageItem.image.alt}
                    />
                    {#if imageItem.image.caption}
                      <figcaption>{imageItem.image.caption}</figcaption>
                    {/if}
                  </figure>
                {/each}
              </div>
            {/if}
          </section>
        {/each}
        <!-- Media (video or images) -->
        {#if slide.video}
          <aside class="media" class:visible={clickIndex >= totalElements}>
            <!-- Otherwise it gives a warning for missing captions but I obviously do not have those... -->
            <!-- svelte-ignore a11y_media_has_caption -->
            <video controls>
              <source src={slide.video.url} type="video/mp4" />
              Your browser doesn't support video.
            </video>
          </aside>
        {:else if slide.images && slide.mediaType === "images"}
          <aside class="media" class:visible={clickIndex >= totalElements}>
            <div class="image-gallery">
              {#each slide.images as image}
                <figure class:format-free={image.format === "free"}>
                  <img src={image.asset.url} alt={image.alt} />
                  {#if image.caption}
                    <figcaption>{image.caption}</figcaption>
                  {/if}
                </figure>
              {/each}
            </div>
          </aside>
        {/if}
      </div>
    {/if}
  </section>
</div>

<style>
  .slide-wrapper {
    cursor: none;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    gap: 2rem;

    &:has(.custom-elements:empty) {
      place-content: center;
      display: grid;
      text-align: center;
    }
  }

  .custom-elements {
    height: 100%;
  }

  /* Fade-in animation for all elements */
  .slide-wrapper .custom-elements > *:not(.list-wrapper, .pros-cons-wrapper) {
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 0.4s ease,
      transform 0.4s ease;
  }

  h1 {
    font-size: 3rem;
    margin: 0;
  }

  .subtitle {
    color: var(--tertiary-400);
    font-size: 1.5rem;
    margin-top: 0.5rem;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* Pros & Cons styling */
  .pros-cons {
    h2 {
      font-size: clamp(1.25rem, 7vw - 1rem, 3rem);
      margin-bottom: 1rem;
    }

    .columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;

      > li {
        background: var(--bg-color-700);
        padding: 2rem 1.75rem 4rem 3rem;
        border-radius: 10%;
        corner-shape: squircle;

        > * {
          max-width: 70ch;
        }
        &.pros {
          h3 {
            color: var(--text-color-200);
          }
        }

        &.cons {
          h3 {
            color: var(--bad-color-400);
          }
        }

        h3 {
          padding-left: 0.75rem;

          font-size: clamp(1.5rem, 7vw - 1rem, 4rem);
        }

        > ul {
          list-style: decimal;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          li {
            padding-left: 0.75rem;
            h4 {
              font-size: clamp(1.25rem, 3vw + 0.5rem, 2rem);

              + * {
                margin-top: 0.5rem;
              }
            }
            p {
              color: var(--tertiary-400);
              font-size: clamp(1.125rem, 2vw, 1.375rem);
            }

            img {
              border-radius: 10%;
              corner-shape: squircle;
            }
          }
        }
      }
    }
  }

  .slide-list-wrapper h2 {
    font-size: clamp(1.25rem, 3vw + 0.5rem, 2rem);
    margin-bottom: 1rem;
  }
  .slide-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: clamp(1.125rem, 10vw, 2.25rem);
    justify-content: space-between;

    .slide-list-item {
      text-align: center;
      padding: 2rem;
      background-color: var(--bg-color-700);
      border-radius: 10%;
      corner-shape: squircle;
      height: 33vh;
      display: grid;
      place-content: center;
      font-size: clamp(1.25rem, 3vw + 0.5rem, 2rem);
      position: relative;

      &:not(:last-child)::after {
        content: "";
        width: clamp(1.125rem, 10vw, 2.25rem);
        height: 0.5rem;
        position: absolute;
        top: 50%;
        right: calc(clamp(1.125rem, 10vw, 2.25rem) * -1);
        transform: translateY(-50%);
        background: var(--bg-color-700);
      }
    }
  }
  .list-section {
    h2 {
      margin-bottom: 1rem;
      font-size: clamp(1.25rem, 3vw + 0.5rem, 2rem);
    }
    ul {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: clamp(1.125rem, 10vw, 2.25rem);
      justify-content: space-between;
      li {
        text-align: center;
        padding: 2rem;
        background-color: var(--bg-color-700);
        border-radius: 10%;
        corner-shape: squircle;
        height: 33vh;
        display: grid;
        place-content: center;
        font-size: clamp(1.25rem, 3vw + 0.5rem, 2rem);
        position: relative;
      }
    }
  }
  .frameworks {
    h2 {
      font-size: clamp(1.25rem, 3vw + 0.5rem, 2rem);
      margin-bottom: 1rem;
    }
    ul {
      display: flex;
      gap: 0.75rem;
      li {
        padding: 0.25rem 1.25rem;
        border-radius: 10%;
        corner-shape: squircle;
        background: var(--tertiary-400);
        color: var(--bg-color-400);
        font-size: 1.25rem;
        letter-spacing: -0.05em;
      }
    }
  }

  /* List styling */
  .list-wrapper,
  .pros-cons-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr;

    > * {
      grid-column: 1 / -1;
      grid-row: 1;
      opacity: 0;
      transform: translateY(20px);
      transition:
        opacity 0.4s ease,
        transform 0.4s ease;
    }
  }

  /* Image gallery */
  .image-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  figure {
    margin: 0;
    width: fit-content;

    &:nth-of-type(2) {
      margin-left: auto;
    }
  }

  figure img {
    height: auto;
    max-height: 60vh;
    width: 100%;
    object-position: left;
    object-fit: contain;
    border-radius: 8px;
  }

  figure.format-free img {
    aspect-ratio: auto;
    height: auto;
  }

  figcaption {
    margin-top: 0.5rem;
    font-size: 1.125rem;
    color: var(--tertiary-400);
  }

  /* Video */
  video {
    width: 100%;
    max-width: 800px;
    border-radius: 8px;
  }

  .slide-wrapper .custom-elements > :global(.visible),
  .slide-wrapper .custom-elements > :global(.visible),
  .list-wrapper > :global(.visible),
  .pros-cons-wrapper > :global(.visible) {
    opacity: 1;
    transform: translateY(0);
  }
</style>
