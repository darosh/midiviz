<script>
import { initMidi, NOTE_OFF, NOTE_ON } from './midi'
import Notes from './Notes.svelte'
import Controls from './Controls.svelte'
import { eventId } from './events'

let width
let last = 0
let current
let order = 0

let palette = [
  '#9c27b0', '#5964d5', '#2297e8', '#29a0a6',
  '#43ac74', '#82c161', '#bbd24e', '#eedf3c',
  '#ffd62c', '#ffc11d', '#f5753c', '#e91e63'
]

let messages = []
const notesMap = {}
const controlsMap = {}

initMidi(inputHandler)

function inputHandler (event) {
  const id = eventId(event)

  messages.unshift({
    event,
    id,
  })

  messages = messages

  const number = event.controller ? event.controller.number : event.note ? event.note.number : -1
  const value = event.value !== undefined ? event.value : event.rawVelocity !== undefined ? event.rawVelocity : 64

  if (event.type === NOTE_OFF) {
    if (notesMap[id]) {
      notesMap[id].deleted = true
    }

    setTimeout(() => {
      if (notesMap[id] && notesMap[id].deleted) {
        delete notesMap[id]
        ++last
      }
    }, 1200)

    return
  }

  ++order

  if (event.type === NOTE_ON) {
    notesMap[id] = { event, number, value, deleted: false, order, id }

    return
  }

  controlsMap[id] = { event, number, value, deleted: false, order, id, active: true }

  setTimeout(() => {
    if (controlsMap[id].event === event) {
      controlsMap[id].active = false
      ++last
    }
  }, 1200)

  setTimeout(() => {
    if (controlsMap[id].event === event) {
      delete controlsMap[id]
      ++last
    }
  }, 9600)
}

$: current = (last, Object.values(notesMap)
  .sort((a, b) => a.number - b.number)
  .map(({ event, number, value, deleted, id, order }, i, { length }) => ({
    id: order,
    x: width / 2 + (i - length / 2) * (96 + 32) + 48 + 16,
    y: 96,
    size: (24 * value / 127) + 24,
    color: palette[number % 12],
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

.notes {
  position: absolute;
  top: calc(50vh - 168px);
}

.controls {
  position: absolute;
  bottom: 0;
}
</style>
<svelte:window bind:innerWidth={width}/>
<div class="notes">
  <Notes items={current} {width}/>
</div>
<div class="controls">
  <Controls class=controls map={controlsMap} {width} {palette} {last}/>
</div>
<div class="x-messages">
    {#each messages.slice(0, 10) as m, index (index)}
      <div>{dat(m)}</div>
    {/each}
</div>
