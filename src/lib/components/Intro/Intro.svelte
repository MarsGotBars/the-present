<script>
  const { title = "", children } = $props();
</script>

<section class="intro">
  {@render children?.()}
</section>

<style>
  .intro {
    font-size: var(--xxl-text);
    > :global(:first-child) {
      font-size: inherit;
      width: fit-content;
      margin-bottom: 0.75rem;

      &:hover :global(span) {
        color: var(--quaternary-400);
      }

      :global(span) {
        color: var(--tertiary-400);
        transition: color 0.2s ease-out;

        > :global(span) {
          position: relative;
          display: inline-block;
          margin-top: 0.5ch;

          @media (min-width: 47.5rem) {
            margin: unset;
          }

          &:global(::after) {
            content: "";
            position: absolute;
            width: 1em;
            height: 1em;
            top: -0.3em;
            right: -1.5ch;
            corner-shape: superellipse(-1.5);
            border-radius: 5rem;
            background-color: currentColor;
          }
        }
      }
    }
    > :global(:last-child) {
      color: var(--tertiary-400);
      font-size: clamp(1rem, 3vw, 1.5rem);
    }
  }
</style>
