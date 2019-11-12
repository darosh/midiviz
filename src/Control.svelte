<script>
import { spring } from 'svelte/motion'
import { arc } from 'd3-shape'

export let id
export let x
export let y
export let size
export let value
export let color
export let active
export let deleted

import { tweened } from 'svelte/motion'
import { linear } from 'svelte/easing'

const progress = tweened(0, {
  duration: 200,
  easing: linear
})

const outer = tweened(48, {
  duration: 200,
  easing: linear
})

let arcGenerator = arc()
let path

let springX = spring(
  x,
  {
    stiffness: 0.06,
    damping: 0.5,
    precision: 1
  }
)

let springY = spring(
  y,
  {
    stiffness: 0.1,
    // damping: 0.333,
    damping: 0.25,
    precision: 0.1
  }
)

let valueSpring = spring(
  0,
  {
    stiffness: 1,
    damping: 0.1,
    precision: 0.1
  }
)

let activeSpring = spring(
  active ? 22 : 8,
  {
    stiffness: 0.1,
    damping: 0.5,
    precision: 0.1
  }
)

$: springX.set(x)
$: springY.set(y)
$: progress.set(value)
$: activeSpring.set(active ? 16 : 8)
$: outer.set(active ? 48 : 32)

// $: if (deleted) {
//   sizeSpring.set(4)
// }

$: path = arcGenerator({
  innerRadius: 24,
  outerRadius: $outer,
  startAngle: -Math.PI,
  endAngle: 2 * Math.PI * ($progress / 127) - Math.PI
})
</script>

<g fill={color} transform="translate({[$springX, $springY]})" data-id={id}>
  <circle r={$activeSpring}/>
  <path d={path}/>
</g>

<style>
g {
  transition: fill 200ms linear;
  will-change: transform, color;
}
</style>
