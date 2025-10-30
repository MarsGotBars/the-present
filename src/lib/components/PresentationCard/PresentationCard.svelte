<script>
  const { title = "None", description, slug } = $props();
</script>

<li class="grid-item" style="--vt-name: slide-{slug}">
  <a href={slug}>
    <article class="">
      <h2 style="--vt-name: {slug}" class="presentation-title">{title}</h2>
      <p style="--vt-name: {slug}-description">{description}</p>
    </article>
  </a>
</li>

<style>
  .grid-item {
    view-transition-name: var(--vt-name);
    color: var(--text-color-400);
    grid-column: 1 / -1;
    aspect-ratio: 16/9;
    background: var(--bg-color-400);
    border: 0.125rem solid var(--bg-color-200);
    corner-shape: squircle;
    border-radius: 10%;

    > * {
      text-decoration: none;
      color: inherit;
    }

    > a {
      display: inline-flex;
      width: 100%;
      height: 100%;
      padding-block: 4rem;
      align-items: center;
      > article {
        width: fit-content;
        margin: 0 auto;
        .presentation-title {
          view-transition-name: var(--vt-name);

          font-size: clamp(1.375rem, 4vw - 0.75rem, 3.5rem);
          margin-bottom: 0.5rem;
        }

        p {
          color: var(--tertiary-400);
          view-transition-name: var(--vt-name);
        }
      }
    }

    @media (min-width: 40rem) {
      grid-column: span 6;
    }
    /* 
    @media (min-width: 75rem) {
      grid-column: span 3;
    } */
  }
</style>
