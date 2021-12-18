<script lang="ts">
  import { ButtonContexts, ButtonTypes } from "../../lib"
  import { Button } from "../action"

  export let action: () => void = () => {}
  export let cxtAction: () => void = () => {}
  export let buttonContext: ButtonContexts = ButtonContexts.ANCHOR
  export let active: boolean = false
</script>

<li>
  <Button
    type={ButtonTypes.BUTTON}
    context={buttonContext}
    action={action}
    cxtAction={cxtAction}
    active={active}
  >
    <slot />
  </Button>
</li>

<style>
  li {
    border-top: 1px solid var(--border-list);
    line-height: 1.5;
  }

  li:first-child {
    border-top: none;
  }
</style>
