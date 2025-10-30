<script>
  import "$lib/components/Intro/Intro.svelte";
  import Intro from "$lib/components/Intro/Intro.svelte";
  import PresentationGrid from "$lib/components/PresentationGrid/PresentationGrid.svelte";
  import PresentationCard from "$lib/components/PresentationCard/PresentationCard.svelte";
  import "$lib/assets/styles/motion/home--motion.css";
  let { data } = $props();
  const { presentation } = data;
  console.log(presentation);
</script>

<Intro />
<PresentationGrid>
  {#each presentation as item}
    <PresentationCard title={item.title} description={item.description} slug={item.slug} />
  {/each}
</PresentationGrid>
