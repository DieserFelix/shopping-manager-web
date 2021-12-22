<script lang="ts">
  import { ButtonContexts, ButtonTypes, IconNames } from "../../lib"
  import { Button } from "../action"
  import { Icon } from "../content"

  export let value: string = ""
  let textarea: HTMLTextAreaElement

  const copyToClipboard = () => {
    textarea.select()
    navigator.clipboard.writeText(textarea.value)
    setTimeout(() => textarea.setSelectionRange(0, 0), 100)
  }
</script>

<textarea bind:this={textarea}>{value}</textarea>
<Button
  type={ButtonTypes.BUTTON}
  context={ButtonContexts.TRANSPARENT}
  action={copyToClipboard}
>
  <Icon>
    {IconNames.contentCopy}
  </Icon>
</Button>

<style>
  textarea {
    width: 100%;
    min-height: 450px;
    font-size: 1rem;
    background: var(--bg-input);
    border: 1px solid var(--border-main);
    border-radius: 5px;
  }

  textarea:focus {
    outline: none !important;
    border: 2px solid var(--border-secondary);
  }
</style>
