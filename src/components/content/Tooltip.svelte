<script lang="ts">
  import { useOutsideClick } from "../../lib"

  export let visible: boolean = false
  export let placement: "left" | "top" | "right" | "bottom" = "bottom"
  export let onClickOutside: () => void = () => {}

  let context: HTMLDivElement = undefined
  let tooltip: HTMLDivElement = undefined

  const positionTooltip = (visible: boolean) => {
    if (visible) {
      tooltip.style.display = "block"
      switch (placement) {
        case "left":
          tooltip.style.left =
            context.offsetLeft - tooltip.getBoundingClientRect().width + "px"
          tooltip.style.top = context.offsetTop + "px"
          break
        case "top":
          tooltip.style.left = context.offsetLeft + "px"
          tooltip.style.top =
            context.offsetTop - tooltip.getBoundingClientRect().height + "px"
          break
        case "right":
          tooltip.style.left =
            context.offsetLeft + context.getBoundingClientRect().width + "px"
          tooltip.style.top = context.offsetTop + "px"
          break
        default:
          tooltip.style.left = context.offsetLeft + "px"
          tooltip.style.top =
            context.offsetTop + context.getBoundingClientRect().height + "px"
          break
      }
    } else {
      tooltip.style.display = "none"
    }
  }

  const outsideClick = useOutsideClick(onClickOutside)

  $: {
    if (context && tooltip) {
      positionTooltip(visible)
    }
  }
</script>

<div class="tooltipContainer" use:outsideClick>
  <div class="context" bind:this={context}>
    <slot />
  </div>
  <div class="tooltip" bind:this={tooltip}>
    <slot name="content" />
  </div>
</div>

<style>
  div.tooltip {
    position: absolute;
    z-index: 9999;
    display: none;
  }
</style>
