<script lang="ts">
  import { afterUpdate } from "svelte"
  import { Spinner } from "../content"

  export let requestNextPage: () => void
  let pagerRef: HTMLDivElement

  afterUpdate(() => {
    let observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        requestNextPage()
      }
    })
    observer.observe(pagerRef)
    return () => observer.unobserve(pagerRef)
  })
</script>

<div bind:this={pagerRef}>
  <Spinner size="50px" />
</div>

<style>
  div {
    width: 100%;
    margin: 15px;
  }
</style>
