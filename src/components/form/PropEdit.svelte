<script lang="ts">
  import {
    ButtonContexts,
    ButtonTypes,
    IconNames,
    InputTypes,
    PaginationParams,
    useOutsideClick,
  } from "../../lib"
  import { Button } from "../action"
  import { Icon, Tooltip } from "../content"
  import { AutoComplete, Form, Input } from "./"

  export let label: string = ""
  export let icon: IconNames = IconNames.modeEdit
  export let permaEdit: boolean = false
  export let editHandler: (
    info: { id?: number; value: string },
    onSuccess: () => void,
  ) => void
  export let autoComplete: {
    queryKey: string
    queryString: (params: {
      id?: number
      pagination?: PaginationParams
    }) => string
    suggestionFormatter?: (suggestion: any) => string
  } = undefined
  let edit = false
  let focus = false
  $: value = label
  let suggestions: { id: number; name: string }[]

  const outsideClick = useOutsideClick(() => {
    edit = false
  })

  const submitHandler = () => {
    const suggestion = suggestions?.find(
      (currentSuggestion) =>
        currentSuggestion.name.toLowerCase() === value.toLowerCase(),
    )
    editHandler(
      suggestion ? { id: suggestion.id, value: suggestion.name } : { value },
      () => (edit = false),
    )
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
      <Icon>{icon}</Icon>
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
          bind:suggestions
          completionHandler={(suggestion) => {
            value = suggestion.name
            submitHandler()
          }}
          {...autoComplete}
        />
      </Tooltip>
    </Form>
  {/if}
</div>
