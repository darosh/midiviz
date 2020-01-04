<script>
import { onMount, setContext } from 'svelte'
import { writable } from 'svelte/store'
import { key } from './Canvas.js'

export const pixelRatio = writable(window.devicePixelRatio)
export const time = writable(0)
export const context = writable()

export let killLoopOnError = true
export let attributes = {}
export let width = 200
export let height = 200

let listeners = []
let canvas
let frame

onMount(() => {
  context.set(canvas.getContext('2d', attributes))

  listeners.forEach(async entity => {
    if (entity.setup) {
      let p = entity.setup()

      if (p && p.then) {
        await p
      }
    }

    entity.ready = true
  })

  return createLoop((elapsed, dt) => {
    time.set(elapsed)
    render(dt)
  })
})

setContext(key, {
  add (fn) {
    this.remove(fn)
    listeners.push(fn)
  },
  remove (fn) {
    const idx = listeners.indexOf(fn)

    if (idx >= 0) {
      listeners.splice(idx, 1)
    }
  }
})

function render (dt) {
  $context.save()
  $context.scale($pixelRatio, $pixelRatio)

  for (const { render, mounted } of listeners) {
    try {
      if (mounted && render) {
        render({ context: $context }, dt)
      }
    } catch (err) {
      console.error(err)

      if (killLoopOnError) {
        cancelAnimationFrame(frame)
        console.warn('Animation loop stopped due to an error')
      }
    }
  }

  $context.restore()
}

function handleResize () {
  pixelRatio.set(window.devicePixelRatio)
}

function createLoop (fn) {
  let elapsed = 0
  let lastTime = performance.now();

  (function loop () {
    frame = requestAnimationFrame(loop)
    const beginTime = performance.now()
    const dt = (beginTime - lastTime) / 1000
    lastTime = beginTime
    elapsed += dt
    fn(elapsed, dt)
  })()

  return () => { cancelAnimationFrame(frame) }
}
</script>

<svelte:window on:resize|passive={handleResize}/>

<canvas
  bind:this={canvas}
  width={width * $pixelRatio}
  height={height * $pixelRatio}
  style="width: {width}px; height: {height}px; display: block;"/>
<slot />
