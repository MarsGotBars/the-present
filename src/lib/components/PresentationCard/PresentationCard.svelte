<script>
  const { title = "None", description, slug } = $props();
</script>

<li class="grid-item">
  <a href={slug.current}>
    <article class="">
      <h2 class="presentation-title">{title}</h2>
      <p>{description}</p>
    </article>
  </a>
</li>

<style>
  .grid-item {
    color: var(--bg-color-100);
    grid-column: 1 / -1;
    aspect-ratio: 16/9;
    background: var(--secondary-700);
    border: 0.125rem solid var(--bg-color-300);
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
          font-size: clamp(1.375rem, 4vw - 0.75rem, 3.5rem);
          margin-bottom: 0.5rem;
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
