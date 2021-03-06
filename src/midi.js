import WebMidi from 'webmidi'

export const CHANNEL_AFTERTOUCH = 'channelaftertouch'
export const CHANNEL_MODE = 'channelmode'
export const CONTROL_CHANGE = 'controlchange'
export const KEY_AFTERTOUCH = 'keyaftertouch'
export const NOTE_OFF = 'noteoff'
export const NOTE_ON = 'noteon'
export const NRPN = 'nrpn'
export const PITCH_BEND = 'pitchbend'
export const PROGRAM_CHANGE = 'programchange'

export function initMidi (inputHandler, logHandler) {
  WebMidi.enable(function (err) {
    if (err) {
      console.error('WebMidi could not be enabled.', err)
    }

    WebMidi.inputs.forEach((input) => {
      const { id, name } = input
      logHandler([id, name, 'on'])
      initInput(input, inputHandler)
    })

    WebMidi.interface.addEventListener('statechange', event => {
      const { id, type, state, name } = event.port

      if (type !== 'input') {
        return
      }

      logHandler([id, name, state])

      WebMidi.inputs.forEach((input) => {
        if (!input.hasListener(NOTE_OFF, 'all', inputHandler)) {
          logHandler([id, name, 'on'])
          initInput(input, inputHandler)
        }
      })
    })
  })
}

function initInput (input, inputHandler) {
  // input.addListener(CHANNEL_AFTERTOUCH, 'all', inputHandler)
  // input.addListener(CHANNEL_MODE, 'all', inputHandler)
  input.addListener(CONTROL_CHANGE, 'all', inputHandler)
  // input.addListener(KEY_AFTERTOUCH, 'all', inputHandler)
  input.addListener(NOTE_OFF, 'all', inputHandler)
  input.addListener(NOTE_ON, 'all', inputHandler)
  // input.addListener(NRPN, 'all', inputHandler)
  input.addListener(PITCH_BEND, 'all', inputHandler)
  // input.addListener(PROGRAM_CHANGE, 'all', inputHandler)
}
