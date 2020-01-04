<script>
import { renderable } from './Canvas.js'

export let color = 'hsl(0, 0%, 100%)'
export let align = 'center'
export let baseline = 'middle'

export let text = ''
export let x = 0
export let y = 0

export let fontSize = 16
export let fontFamily = 'sans-serif'

renderable(({ context }) => {
  if (!text) {
    return
  }

  context.fillStyle = color
  context.font = `${fontSize}px ${fontFamily}`
  context.textAlign = align
  context.textBaseline = baseline
  context.fillText(text, x, y)
})
</script>

<slot />
