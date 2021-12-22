<script lang="ts">
  import {
    ButtonContexts,
    ButtonTypes,
    IconNames,
    ShoppingList,
  } from "../../lib"
  import { Button, Deletion } from "../action"
  import { CardDismissal, Title } from "../card"
  import { Icon } from "../content"
  import { PropEdit } from "../form"
  import { Alert } from "../network"

  export let mode: "CREATE" | "UPDATE" = "UPDATE"
  export let list: Partial<ShoppingList>
  export let editHandler: (
    props: Partial<Omit<ShoppingList, "id">>,
    onSuccess: () => void,
  ) => void
  export let removalHandler: () => void = undefined
  export let alertHandler: () => void
  export let errorMessage: string

  let permaEdit = mode == "CREATE"
</script>

<CardDismissal>
  {#if removalHandler}
    <Deletion deletionHandler={removalHandler} />
  {/if}
</CardDismissal>
<Alert errorMessage={errorMessage} dismiss={alertHandler} />
<table>
  <tr>
    <td>
      <Title>
        <PropEdit
          label={list.title}
          editHandler={(title, onSuccess) =>
            editHandler({ title: title.value }, onSuccess)}
          permaEdit={permaEdit}
        />
      </Title>
    </td>
    <td>
      <Button
        type={ButtonTypes.BUTTON}
        context={ButtonContexts.NEUTRAL}
        action={() => {
          editHandler({ finalized: !list.finalized }, () => {})
        }}
      >
        <Icon>
          {list.finalized ? IconNames.lock : IconNames.lockOpen}
        </Icon>
      </Button>
    </td>
  </tr>
</table>

<style>
  table {
    width: 100%;
  }

  td:first-child {
    width: 94%;
    text-align: left;
  }

  td {
    width: 4%;
    margin: 5px;
    text-align: center;
  }
</style>
