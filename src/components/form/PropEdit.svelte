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
  import { AutoComplete, Form, Input } from "./"

  export let label: string
  export let permaEdit: boolean = false
  export let editHandler: (label: string, onSuccess: () => void) => void
  export let autoComplete: {
    queryKey: string
    queryString: (params: {
      id?: number
      name?: string
      sort_by?: string
      page?: number
      limit?: number
      asc?: boolean
    }) => string
  } = undefined
  let edit = false
  let focus = false
  let value = label

  const outsideClick = useOutsideClick(() => {
    edit = false
  })

  const submitHandler = () => {
    editHandler(value, () => (edit = false))
  }
</script>

<div class="propEditor" use:outsideClick>
  {#if !permaEdit && !edit}
    {label}
    <Button
      type={ButtonTypes.BUTTON}
      context={ButtonContexts.NEUTRAL}
      action={() => {
        setTimeout(() => {
          edit = true
        }, 10)
      }}
    >
      <Icon>{IconNames.modeEdit}</Icon>
    </Button>
  {/if}
  {#if edit || permaEdit}
    <Form submitHandler={submitHandler}>
      <Tooltip visible={focus}>
        <Input
          bind:value
          type={InputTypes.TEXT}
          bind:focus
          blurHandler={() => submitHandler()}
        />
        <AutoComplete
          slot="content"
          visible={focus && autoComplete !== undefined}
          bind:value
          completionHandler={(suggestion) => {
            value = suggestion
            submitHandler()
          }}
          {...autoComplete}
        />
      </Tooltip>
    </Form>
  {/if}
</div>
