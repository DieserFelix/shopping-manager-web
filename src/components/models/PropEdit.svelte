<script lang="ts">
  import {
    ButtonContexts,
    ButtonTypes,
    IconNames,
    InputTypes,
    useOutsideClick,
  } from "../../lib"
  import { Button } from "../action"
  import { Icon, Tooltip } from "../content"
  import { AutoComplete, Form, Input } from "../form"

  export let label: string
  export let options: { name: string }[] = []
  export let editHandler: (label: string, onSuccess: () => void) => void

  let edit: boolean = false
  let value = label

  const outsideClick = useOutsideClick(() => {
    edit = false
  })

  const submitHandler = () => {
    editHandler(value, () => (edit = false))
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
    <Form submitHandler={submitHandler}>
      <Tooltip visible={edit}>
        <Input bind:value type={InputTypes.TEXT} autofocus={edit} />
        <AutoComplete
          slot="content"
          visible={edit}
          options={options}
          bind:value
          completionHandler={(suggestion) => {
            value = suggestion
            submitHandler()
          }}
        />
      </Tooltip>
    </Form>
  </div>
</div>
