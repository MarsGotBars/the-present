<script>
  const { data } = $props();
  const { presentation, slide, items } = data;
  console.log(items);
</script>

<a href={`${slide.slug}`} class="wrapper">
  <h1>{slide.title}</h1>
</a>
