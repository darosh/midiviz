import { getContext, onMount } from 'svelte'

export const key = Symbol()

export const renderable = (render) => {
  const api = getContext(key)

  const element = {
    mounted: false,
    render
  }

  api.add(element)

  onMount(() => {
    element.mounted = true

    return () => {
      api.remove(element)
      element.mounted = false
    }
  })
}
