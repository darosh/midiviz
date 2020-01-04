<script>
import Text from './Text.svelte'
import { renderable } from './Canvas.js'

let text = ''

let elapsed = 0
let frames = 0
let prevTime = performance.now()

renderable(() => {
  let time = performance.now()

  frames++

  if (time >= (prevTime + 1000)) {
    const fps = ((frames * 1000) / (time - prevTime))

    text = `${fps.toFixed(1)} FPS`
    prevTime = time
    frames = 0
  }
})
</script>
<Text
  {text}
  fontSize=16
  fontFamily='sans-serif'
  align='left'
  baseline='top'
  x={2}
  y={2}/>
<slot/>
