<script lang="ts">
  import { ButtonContexts, ButtonTypes } from "../../lib"
  import { Button } from "../action"

  export let action: () => void = () => {}
  export let cxtAction: () => void = () => {}
</script>

<li>
  <Button
    type={ButtonTypes.BUTTON}
    context={ButtonContexts.ANCHOR}
    action={action}
    cxtAction={cxtAction}
  >
    <slot />
  </Button>
</li>

<style>
  li {
    border-top: 1px solid var(--border-list);
    line-height: 1.5;
  }
</style>
