<script>
import Note from './Note.svelte'

export let width
export let map
export let last
export let palette
export let min = 24
export let max = 48
export let margin = 24
export let low = 168

let items
let delta
let y
let distance
let y2
let height
const MAX = 127
const TONES = 12

$: delta = max - min
$: y = max + margin
$: distance = y * 2
$: y2 = y / 2
height = (max + margin) * 2 + low

$: items = (last, Object.values(map)
  .sort((a, b) => a.number - b.number)
  .map(({ event, number, value, deleted, id, order }, i, { length }) => ({
    id: order,
    x: width / 2 + (i - length / 2) * distance + y,
    y,
    size: (min * value / MAX) + delta,
    color: palette[number % TONES],
    deleted
  })))
</script>
<svg {width} {height}>
    {#each items as item (item.id)}
      <Note {...item} {low}/>
    {/each}
</svg>
