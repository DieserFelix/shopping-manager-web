<script lang="ts">
  import { Button } from "."
  import {
    ButtonContexts,
    ButtonTypes,
    IconNames,
    useOutsideClick,
  } from "../../lib"
  import { Icon } from "../content"

  export let deletionHandler: () => void
  let askConfirmation: boolean = true

  const outsideClick = useOutsideClick(() => {
    askConfirmation = true
  })
</script>

<div
  class={askConfirmation ? "requestDelete" : "confirmDelete"}
  use:outsideClick
>
  <Button
    type={ButtonTypes.BUTTON}
    context={askConfirmation ? ButtonContexts.NEUTRAL : ButtonContexts.PRIMARY}
    action={() => {
      if (!askConfirmation) {
        deletionHandler()
      }
      askConfirmation = !askConfirmation
    }}
  >
    <span style={`display: ${askConfirmation ? "none" : "inline"}`}>
      Delete?
    </span>
    <span style={`display: ${askConfirmation ? "inline" : "none"}`}>
      <Icon>
        {IconNames.close}
      </Icon>
    </span>
  </Button>
</div>

<style>
  div {
    transition: all 0.5s ease-out;
    padding: 4px;
  }
  div.confirmDelete {
    width: 100px;
  }

  div.requestDelete {
    width: 24px;
  }
</style>
