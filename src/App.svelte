<script>
import { initMidi, NOTE_OFF, NOTE_ON, PITCH_BEND } from './midi'
import Notes from './Notes.svelte'
import Controls from './Controls.svelte'
import { eventId } from './events'
import { palette } from './config'
import { paletteControls } from './config'

let width
let current
let last = 0
let order = 0

let messages = []
const notesMap = {}
const controlsMap = {}
let logs = []

initMidi(inputHandler, logHandler)

function logHandler (message) {
  logs = [...logs, message]
}

function raf () {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

async function inputHandler (event) {
  await raf()
  const id = eventId(event)
  messages = [...messages, { event, id }]
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

function dat ({ data }) {
  return Array.from(data).map(hex).join(' ')
}

let showMeta = true
let showMetaTimer = null

function mouseMoveHandler () {
  showMeta = true

  if (showMetaTimer) {
    clearTimeout(showMetaTimer)
  }

  showMetaTimer = setTimeout(() => {
    showMeta = false
    showMetaTimer = null
  }, 8000)
}

mouseMoveHandler()

</script>
<style>
:global(html, body) {
  color: #fff;
  background-color: #000;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

.x-messages {
  position: absolute;
  right: 0;
  top: 0;
  color: rgba(255, 255, 255, 0.75);
  background-color: rgba(128, 128, 128, 0.28);
  overflow: hidden;
  padding: 12px;
}

.x-messages > div {
  display: flex;
}

.x-messages > div > div {
  padding: 4px;
  overflow: hidden;
  flex: 1 1 auto;
  white-space: nowrap;
}

.x-messages > div > div:nth-child(3) {
  flex: 0 1 64px;
  text-align: right;
  font-family: monospace;
}

.x-logs {
  position: absolute;
  width: 288px;
  left: 0;
  top: 0;
  color: rgba(255, 255, 255, 0.75);
  background-color: rgba(128, 128, 128, 0.28);
  overflow: hidden;
  padding: 12px;
}

.x-logs > div {
  display: flex;
}

.x-logs > div > div {
  margin: 4px;
  overflow: hidden;
  flex: 1 1 40%;
}

.x-logs > div > div:nth-child(3) {
  flex: 1 0 auto;
  min-width: 0;
  text-align: right;
  white-space: nowrap;
}

.notes {
  position: absolute;
  top: calc(50vh - 248px + 48px + 16px);
}

.controls {
  position: absolute;
  bottom: 0;
}
</style>
<svelte:window bind:innerWidth={width}/>
<svelte:body on:mousemove={mouseMoveHandler}/>
<div class="notes">
  <Notes {width} {last} map={notesMap} {palette}/>
</div>
<div class="controls">
  <Controls map={controlsMap} {width} palette={paletteControls} {last}/>
</div>
{#if showMeta}
  <div class="x-messages">
      {#each messages.slice(Math.max(0, messages.length - 16)) as m, index (index)}
        <div>
          <div>{m.event.target.id}</div>
          <div>{m.event.channel}</div>
          <div>{dat(m.event)}</div>
        </div>
      {/each}
  </div>
  <div class="x-logs">
      {#each logs.slice(Math.max(0, logs.length - 16)) as item, index (index)}
        <div>
            {#each item as cell, index (index)}
              <div>{cell}</div>
            {/each}
        </div>
      {/each}
  </div>
{/if}
