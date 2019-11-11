<script>
  import { spring } from "svelte/motion";

  export let id;
  export let x;
  export let y;
  export let size = 0;
  export let color;
  export let deleted;

  let springX = spring(
    x,
    {
      stiffness: 0.06,
      damping: 0.5,
      precision: 1
    }
  );

  let springY = spring(
    y,
    {
      stiffness: 0.1,
      // damping: 0.333,
      damping: 0.25,
      precision: 0.1
    }
  );

  let sizeSpring = spring(
    size,
    {
      stiffness: 0.025,
      damping: 1,
      precision: 1
    }
  );

  $: springX.set(x)
  $: springY.set(y + deleted ? 168 : 0)
  $: sizeSpring.set(size)

  $: if (deleted) {
    // color = '#000'
    sizeSpring.set(0)
  }
</script>

<g fill={color} transform="translate({[$springX, $springY]})" data-id={id}>
  <circle r={Math.max(0, $sizeSpring)} />
</g>

<style>
g {
  transition: fill 200ms linear;
  will-change: transform, color;
}
</style>
