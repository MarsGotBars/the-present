<script>
  import Intro from "$lib/components/Intro/Intro.svelte";
  import PresentationGrid from "$lib/components/PresentationGrid/PresentationGrid.svelte";
  import PresentationCard from "$lib/components/PresentationCard/PresentationCard.svelte";
  import "$lib/assets/styles/motion/motion.css";

  let { data } = $props();
  const { presentation } = data;
</script>

<Intro>
  <h1 class="title">
    Welcome to <span>the <span>present</span></span>
  </h1>
  <p>Create, present, and captivate - in the moment.</p>
</Intro>
<PresentationGrid>
  {#each presentation as item}
    <PresentationCard
      title={item.title}
      description={item.description}
      slug={item.slug}
    />
  {/each}
</PresentationGrid>
