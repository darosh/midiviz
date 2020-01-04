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

let springX = spring(x, { stiffness: 0.06, damping: 0.5, precision: 1 })
let springY = spring(y, { stiffness: 0.1, damping: 0.25, precision: 1 })
let springOpacity = spring(0, { stiffness: 0.05, damping: 0.25, precision: 0.001 })
let sizeSpring = spring(size, { stiffness: 0.025, damping: 1, precision: 1 })

$: springX.set(x)
$: springY.set(y + deleted ? low : 0)
$: springOpacity.set(1)
$: sizeSpring.set(size)

$: if (deleted) {
  sizeSpring.set(0)
}

</script>

<Circle r={Math.max(0, $sizeSpring)} color={color} x={$springX} y={$springY} {id} opacity={Math.min(Math.max($springOpacity, 0), 1)}/>
<slot />
