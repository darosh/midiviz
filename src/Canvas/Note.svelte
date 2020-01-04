<script>
import { spring } from 'svelte/motion'
import Circle from './Circle.svelte'

export let id
export let x
export let y
export let size
export let color
export let deleted
export let low

let springX = spring(x, { stiffness: 0.06, damping: 0.5, precision: 0.5 })
let springY = spring(y, { stiffness: 0.6, damping: 0.7, precision: 0.5 })
let sizeSpring = spring(size, { stiffness: 0.025, damping: 1, precision: 0.5 })

$: springX.set(x)
$: springY.set(y + deleted ? low : 0)
$: sizeSpring.set(size)

$: if (deleted) {
  sizeSpring.set(0)
}

</script>

<Circle r={Math.max(0, $sizeSpring)} color={color} x={$springX} y={$springY} {id}/>
<slot />
