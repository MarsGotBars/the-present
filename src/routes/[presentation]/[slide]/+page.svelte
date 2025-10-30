<script>
  import { goto } from "$app/navigation";
  import { onNavigate } from "$app/navigation";

  let { data } = $props();

  let presentation = $derived(data.presentation);
  let slide = $derived(data.slide);
  let nextSlide = $derived(data.nextSlide);
  let prevSlide = $derived(data.prevSlide);

  let clickIndex = $state(0);
  let totalElements = $derived(slide.elementCount || 1);

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
    }
  }

  function handleRightClick(e) {
    e.preventDefault();

    if (clickIndex > 0) {
      clickIndex--;
    } else if (prevSlide) {
      goto(`/${presentation.slug}/${prevSlide.slug}?revealed=all`);
    } else {
      goto(`/${presentation.slug}`);
    }
  }

  console.log(data.slide?.prosConsBlocks);
  
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->

<div
  class="slide-wrapper"
  onclick={handleClick}
  oncontextmenu={handleRightClick}
  role="button"
  tabindex="0"
>
  <!-- Title (always visible first) -->
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
        <li>SolidJS</li>
        <li>LiquidJS + 11ty</li>
      </ul>
    </section>
  {/if}

  <!-- Content based on contentType -->
  <section class="custom-elements">
    {#if slide.contentType === "prosConsBlocks" && slide.prosConsBlocks}
      {#each slide.prosConsBlocks as block, i}
        <section class="pros-cons" class:visible={clickIndex >= i + 1}>
          <h2>{block.heading}</h2>
          <ul class="columns">
            <li class="pros">
              <h3>Pros</h3>
              <ul>
                {#each block.pros as pro}
                  <li>
                    <h4>{pro.listItem}</h4>
                    <p>{pro.description}</p>
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
                    <p>{con.description}</p>
                  </li>
                {/each}
              </ul>
            </li>
          </ul>
        </section>
      {/each}
    {:else if slide.contentType === "slideList" && slide.slideList}
      <ul class:visible={clickIndex >= 1}>
        {#each slide.slideList as linkedSlide}
          <li class="slide-list-item">
            <a href="/{presentation.slug}/{linkedSlide.slug}">
              {linkedSlide.title}
            </a>
          </li>
        {/each}
      </ul>
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
      </div>
    {/if}
  </section>
  <div
    style="position: fixed; top: 0; right: 0; background: white; padding: 1rem; z-index: 9999;"
  >
    <p>Click: {clickIndex} / {totalElements}</p>
    <p>Lists: {slide.lists?.length || 0}</p>
    <p>Content type: {slide.contentType}</p>
  </div>
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

<style>
  .slide-wrapper {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .custom-elements {
    height: 100%;
  }

  /* Fade-in animation for all elements */
  .slide-wrapper .custom-elements > *:not(.list-wrapper) {
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 0.4s ease,
      transform 0.4s ease;
  }

  .slide-wrapper .custom-elements > :global(.visible),
  .slide-wrapper .custom-elements > :global(.visible) {
    opacity: 1;
    transform: translateY(0);
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
  .pros-cons h2 {
    margin-bottom: 1rem;
  }

  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .pros h3 {
    color: green;
  }

  .cons h3 {
    color: red;
  }

  /* List styling */
  .list-wrapper {
    padding-left: 2rem;
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

  /* Slide list styling */
  .slide-list {
    list-style: none;
    padding: 0;
  }

  .slide-list li {
    margin: 1rem 0;
  }

  .slide-list a {
    font-size: 1.5rem;
    color: #0066cc;
    text-decoration: none;
  }

  .slide-list a:hover {
    text-decoration: underline;
  }

  /* Image gallery */
  .image-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  figure {
    margin: 0;
  }

  figure img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
  }

  figure.format-free img {
    aspect-ratio: auto;
    height: auto;
  }

  figcaption {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #666;
    text-align: center;
  }

  /* Video */
  video {
    width: 100%;
    max-width: 800px;
    border-radius: 8px;
  }
</style>
