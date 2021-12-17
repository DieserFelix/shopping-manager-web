<script lang="ts">
  import { ButtonContexts, ButtonTypes, IconNames } from "../../lib"
  import { Button } from "../action"
  import { Icon } from "../content"

  export let errorMessage: string = ""
  export let dismiss: () => void
</script>

{#if errorMessage}
  <div class="alert">
    <h5>Attention!</h5>
    {errorMessage}
    <div class="dismiss">
      <Button
        type={ButtonTypes.BUTTON}
        context={ButtonContexts.NEUTRAL}
        action={dismiss}
      >
        <Icon>{IconNames.close}</Icon>
      </Button>
    </div>
  </div>
{/if}

<style>
  div.alert {
    position: relative;
    width: calc(100% - 30px);
    padding: 15px;
    min-height: 50px;
    color: var(--color-alert);
    background: var(--bg-alert);
    border: 1px solid var(--border-alert);
    border-radius: 8px;
    margin-bottom: 5px;
  }

  h5 {
    font-size: 1rem;
    color: var(--color-alert);
    margin-bottom: 0.5rem;
  }

  div.dismiss {
    position: absolute;
    right: 5px;
    top: 5px;
  }
</style>
