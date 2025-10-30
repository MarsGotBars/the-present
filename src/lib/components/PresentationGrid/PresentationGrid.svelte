<ul data-display="grid">
    <slot></slot>
</ul>

<style>
  [data-display="grid"] {
    display: inherit;
    grid-template-columns: subgrid;
    /* grid-auto-rows: minmax(auto, 300px); */
    gap: inherit;
    height: 100%;
  }
</style>
