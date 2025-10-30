<script>
  const { children } = $props();
</script>
<section>
  <h2>Choose a presentation</h2>

  <ul data-display="grid" style="--vt-name: bg">
    {@render children?.()}
  </ul>
</section>

<style>
  section {
    display: inherit;
    grid-template-columns: subgrid;
    gap: inherit;

    h2 {
      font-size: clamp(1.25rem, 5vw - 1.5rem, 3.5rem);
    }
    > * {
      grid-column: 1 / -1;
    }

    [data-display="grid"] {
      padding: 1.5rem 2.5rem;
      background: var(--bg-color-700);
      corner-shape: squircle;
      border-radius:  2.75rem; 
      display: inherit;
      grid-template-columns: subgrid;
      gap: inherit;
    }
  }
</style>
