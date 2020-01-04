<script>
import Note from './Note.svelte'

export let width
export let map
export let last
export let palette
export let min = 24
export let max = 48
export let margin = 24
export let pad = 16
export let low = 168

let items
let delta
let y
let distance
let y2
let height
let values
let strip
let multiply

const MAX = 127
const TONES = 12

$: delta = max - min
$: y = max + pad
$: distance = max * 2 + margin
$: y2 = y / 2
$: height = (max + pad * 2) + low
$: values = (last, Object.values(map))
$: strip = values.length * distance + margin
$: multiply = strip > (width - 2 * margin) ? (width - 2 * margin) / strip : 1
$: items = values.sort((a, b) => a.number - b.number)
  .map(({ event, number, value, deleted, id, order }, i, { length }) => ({
    id: order,
    x: width / 2 + (i - length / 2 + 0.5) * distance * multiply,
    y,
    size: (min * 127 / MAX) + delta,
    color: palette[number % TONES],
    deleted
  }))
</script>

{#each items as item (item.id)}
  <Note {...item} {low} />
{/each}
<slot />
