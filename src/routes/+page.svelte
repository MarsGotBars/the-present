<script>

	let { data } = $props();
    const { presentation } = data;
    console.log(presentation);
    
</script>

<h1>hi!</h1>
{#each presentation as item}
  <div>{item.title}</div>
{/each}
