export function eventId (event) {
  return `${event.target.id}-${event.channel}-${event.controller
    ? `controller-${event.controller.number}`
    : event.note
      ? `note-${event.note.number}`
      : ''}`
}
