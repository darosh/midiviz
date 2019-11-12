<script>
import { spring } from 'svelte/motion'
import { tweened } from 'svelte/motion'
import { linear } from 'svelte/easing'

import { arc } from 'd3-shape'

export let id
export let x
export let y
export let value
export let color
export let active
export let sizeInactive = [32, 24, 8]
export let size = [48, 32, 16]

const x_ = spring(x, { stiffness: 0.06, damping: 0.5, precision: 1 })
const y_ = spring(y, { stiffness: 0.1, damping: 0.25, precision: 0.1 })
const value_ = tweened(value, { duration: 0, easing: linear })
const outer_ = tweened(size[0], { duration: 200, easing: linear })
const inner_ = tweened(size[1], { duration: 200, easing: linear })
const dot_ = spring(size[2], { stiffness: 0.1, damping: 0.5, precision: 0.1 })
const arcGenerator = arc()

let path

$: x_.set(x)
$: y_.set(y)
$: value_.set(value)
$: outer_.set(active ? size[0] : sizeInactive[0])
$: inner_.set(active ? size[1] : sizeInactive[1])
$: dot_.set(active ? size[2] : sizeInactive[2])

$: path = arcGenerator({
  innerRadius: $inner_,
  outerRadius: $outer_,
  startAngle: -Math.PI,
  endAngle: 2 * Math.PI * ($value_ / 127) - Math.PI
})
</script>

<g fill={color} transform="translate({[$x_, $y_]})" data-id={id}>
  <circle r={$dot_}/>
  <path d={path}/>
</g>

<style>
g {
  transition: fill 200ms linear;
  will-change: transform, color;
}
</style>
