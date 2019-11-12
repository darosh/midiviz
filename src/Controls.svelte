<script>
import Control from './Control.svelte'

export let map
export let width
export let palette
export let last

let items

$: items = (last, Object.values(map)
  .sort((a, b) => a.number - b.number)
  .map(({ event, number, value, deleted, id, order, active }, i, { length }) => ({
    id,
    x: width / 2 + (i - length / 2) * (96 + 32) + 48 + 16,
    y: 128,
    size: (24 * value / 127) + 24,
    value,
    color: palette[number % 12],
    deleted,
    active
  })))
</script>
<svg width={width} height="320">
    {#each items as item (item.id)}
      <Control {...item}/>
    {/each}
</svg>
