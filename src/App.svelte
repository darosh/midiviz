<script>
import { initMidi, NOTE_OFF, NOTE_ON, PITCH_BEND } from './midi'
import Notes from './Notes.svelte'
import Controls from './Controls.svelte'
import { eventId } from './events'
import { palette } from './config'

let width
let current
let last = 0
let order = 0

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
  const value = event.type === PITCH_BEND ? 127 * (event.value + 1) / 2 : event.value !== undefined ? event.value : event.rawVelocity !== undefined ? event.rawVelocity : 64

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
  <Notes {width} {last} map={notesMap} {palette}/>
</div>
<div class="controls">
  <Controls map={controlsMap} {width} {palette} {last}/>
</div>
<div class="x-messages">
    {#each messages.slice(0, 10) as m, index (index)}
      <div>{dat(m)}</div>
    {/each}
</div>
