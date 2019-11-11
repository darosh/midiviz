<script>
import Knob from './Knob.svelte'
import { initMidi, NOTE_OFF, NOTE_ON } from './midi'

let width
let last = 0
let current
let order = 0

let palette = [
  '#9c27b0', '#5964d5', '#2297e8', '#29a0a6',
  '#43ac74', '#82c161', '#bbd24e', '#eedf3c',
  '#ffd62c', '#ffc11d', '#f5753c', '#e91e63'
]

const knobs = {}
const colors = {}
let messages = []

initMidi(inputHandler)

function knobId (event) {
  return `${event.target.id}-${event.channel}-${event.controller
    ? `controller-${event.controller.number}`
    : event.note
      ? `note-${event.note.number}`
      : ''}`
}

function inputHandler (event) {
  if (event.type !== NOTE_OFF && event.type !== NOTE_ON) {
    return
  }

  const id = knobId(event)

  messages.unshift({
    event,
    id,
  })

  messages = messages

  const number = event.controller ? event.controller.number : event.note ? event.note.number : -1
  const value = event.value !== undefined ? event.value : event.rawVelocity !== undefined ? event.rawVelocity : 64

  if (event.type === NOTE_OFF) {
    if (knobs[id]) {
      knobs[id].deleted = true
    }

    setTimeout(() => {
      if (knobs[id] && knobs[id].deleted) {
        delete knobs[id]
        ++last
      }
    }, 1200)

    return
  }

  ++order
  knobs[id] = { event, number, value, deleted: false, order, id }

  if (event.type === NOTE_ON) {
    return
  }

  setTimeout(() => {
    if (knobs[id].event === event) {
      delete knobs[id]
      ++last
    }
  }, 0)
}

$: current = (last, Object.values(knobs)
  .sort((a, b) => a.number - b.number)
  .map(({ event, number, value, deleted, id, order }, i, { length }) => ({
    id: order,
    x: width / 2 + (i - length / 2) * (96 + 32) + 48 + 16,
    y: 96,
    size: (24 * value / 127) + 24,
    color: colors[id] = colors[id] || palette[number % 12],
    deleted
  })))

function spiral (index, length) {

}

function normalize (c) {
  // c.l = 0.75
  // c.s = 1

  return c.toString()
}

function hex (n) {
  return `${n < 16 ? '0' : ''}${n.toString(16)}`
}

function dat (m) {
  return Array.from(m.event.data).map(hex).join(' ')
}

</script>
<style>
:global(html, body) {
  color: #fff;
  background-color: #000;
  margin: 0;
  padding: 0;
}

.x-messages {
  position: absolute;
  height: 100vh;
  width: 64px;
  right: 0;
  top: 0;
  background-color: #666666;
  overflow: hidden;
  display: none;
}

svg {
  margin-top: calc(50vh - 168px);
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
}
</style>
<svelte:window bind:innerWidth={width}/>
<svg width={width} height="320">
    {#each current as tone (tone.id)}
      <Knob {...tone}/>
    {/each}
</svg>
<div class="x-messages">
    {#each messages.slice(0, 10) as m, index (index)}
      <div>{dat(m)}</div>
    {/each}
</div>
