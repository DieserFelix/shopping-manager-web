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
      const { width: contextWidth, height: contextHeight } =
        context.getBoundingClientRect()
      const { height: tooltipHeight } = tooltip.getBoundingClientRect()
      tooltip.style.width = contextWidth + "px"

      switch (placement) {
        case "left":
          tooltip.style.left = -contextWidth - 1 + "px"
          tooltip.style.top = 0 + "px"
          break
        case "top":
          tooltip.style.left = contextWidth + "px"
          tooltip.style.top = -tooltipHeight - 1 + "px"
          break
        case "right":
          tooltip.style.left = contextWidth + 1 + "px"
          tooltip.style.top = 0 + "px"
          break
        default:
          tooltip.style.left = 0 + "px"
          tooltip.style.top = contextHeight + 1 + "px"
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
  div.tooltipContainer {
    position: relative;
  }
  div.tooltip {
    position: absolute;
    z-index: 9999;
    display: none;
  }
</style>
