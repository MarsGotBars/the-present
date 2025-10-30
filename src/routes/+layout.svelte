<script>
  import "$lib/assets/styles/general.css";
  import { page } from "$app/stores";

  import favicon from "$lib/assets/favicon.svg";

  import { onNavigate } from "$app/navigation";

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        console.log("View transition gestart!");
        resolve();
        await navigation.complete;
      });
    });
  });

  

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<main>
  {@render children?.()}
</main>

<style>
  main {    
    &:has(> :global(*:only-child)) {
      height: 100vh;
      grid-template-rows: 1fr;
    }
  }
</style>
