<script>
import Note from './Note.svelte'

export let width
export let items
</script>
<svg width={width} height="320">
    {#each items as item (item.id)}
      <Note {...item}/>
    {/each}
</svg>
