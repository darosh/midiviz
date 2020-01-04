<script>
import { renderable } from './Canvas.js'

export let id = 0
export let x = 0
export let y = 0
export let r = 100
export let color = 'hsl(180, 50%, 50%)'

renderable(({ context }) => {
  context.beginPath()
  context.arc(x, y, r, 0, 2 * Math.PI)

  // const grd = context.createRadialGradient(x, y, Math.max(0, r - 8), x, y, r)
  // grd.addColorStop(0, color)
  // grd.addColorStop(1, 'transparent')

  // context.fillStyle = grd
  context.fillStyle = color
  context.fill()
})

if (false) {
  console.log(id)
}
</script>

<slot/>
