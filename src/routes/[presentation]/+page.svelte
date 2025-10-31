<script>
  import Intro from "$lib/components/Intro/Intro.svelte";
  import { goto } from "$app/navigation";

  const { data } = $props();
  const { presentation } = data;

  function handleRightClick(e) {
    goto("/");
    e.preventDefault();
  }

  console.log("data here", presentation);
</script>

<svelte:head>
  <title>The present - {presentation.title}</title>
</svelte:head>

<a
  oncontextmenu={handleRightClick}
  style="--vt-name: slide-{presentation.slug}"
  href={`${presentation.slug}/${presentation.nextSlide?.slug}`}
  class="wrapper"
>
  <Intro>
    <h1 style="--vt-name: {presentation.slug}">{presentation.title}</h1>
    <p style="--vt-name: {presentation.slug}-description">
      {presentation.description}
    </p>
  </Intro>
</a>

<style>
  a.wrapper {
    view-transition-name: var(--vt-name);

    place-content: center;
    place-items: center;
    cursor: none;
    border: 0.125rem solid var(--bg-color-200);
    corner-shape: squircle;
    border-radius: 10%;
  }

  h1 {
    view-transition-name: var(--vt-name);
  }

  p {
    view-transition-name: var(--vt-name);
  }
</style>
