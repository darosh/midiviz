<script>
import { renderable } from './Canvas.js'

export let color = null

renderable(({ context }) => {
  const { width, height } = context.canvas
  context.clearRect(0, 0, width, height)

  if (color) {
    context.fillStyle = color
    context.fillRect(0, 0, width, height)
  }
})
</script>

<slot></slot>
