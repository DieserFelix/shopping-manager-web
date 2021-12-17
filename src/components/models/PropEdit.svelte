<script lang="ts">
  import {
    ButtonContexts,
    ButtonTypes,
    IconNames,
    InputTypes,
    useOutsideClick,
  } from "../../lib"
  import { Button } from "../action"
  import { Card } from "../card"
  import { Icon, Tooltip } from "../content"
  import { Form, Input } from "../form"
  import { ListGroup, ListGroupAction } from "../list"

  export let label: string
  export let suggestions: { name: string }[] = []
  export let editHandler: (label: string) => void

  let edit: boolean = false
  let value = label

  const outsideClick = useOutsideClick(() => {
    edit = false
  })

  const submitHandler = () => {
    label = editHandler(value)
    edit = false
  }
</script>

<div
  class="propEditor"
  use:outsideClick
  style={`--editMode:${edit ? "block" : "none"}`}
>
  <div class="showcase" style={`display: ${edit ? "none" : "block"}`}>
    {label}
    <Button
      type={ButtonTypes.BUTTON}
      context={ButtonContexts.NEUTRAL}
      action={() => (edit = true)}
    >
      <Icon>{IconNames.modeEdit}</Icon>
    </Button>
  </div>
  <div class="editor" style={`display: ${edit ? "block" : "none"}`}>
    <Form submitHandler={submitHandler} slot="content">
      <Tooltip visible={edit}>
        <Input bind:value type={InputTypes.TEXT} autofocus={true} />
        {#if suggestions.length}
          <Card --width="100%" slot="content">
            <ListGroup>
              {#each suggestions as suggestion}
                {#if suggestion.name
                  .toLowerCase()
                  .includes(value.toLowerCase())}
                  <ListGroupAction
                    action={() => {
                      value = suggestion.name
                      submitHandler()
                    }}
                  >
                    {suggestion.name}
                  </ListGroupAction>
                {/if}
              {/each}
            </ListGroup>
          </Card>
        {/if}
      </Tooltip>
    </Form>
  </div>
</div>

<style>
</style>
