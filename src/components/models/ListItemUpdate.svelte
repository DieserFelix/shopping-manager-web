<script lang="ts">
  import { ListItemEditor } from "."
  import {
    ApiError,
    ShoppingListItem,
    useListItemDelete,
    useListItemUpdate,
  } from "../../lib"
  import { Card, CardBody } from "../card"

  export let item: ShoppingListItem
  let apiError: ApiError

  const update = useListItemUpdate({
    item: item,
    setError: (error) => (apiError = error),
  })

  const remove = useListItemDelete({
    item: item,
    setError: (error) => (apiError = error),
  })

  $: errorMessage = apiError ? apiError.message : ""
</script>

<Card --width="100%" --margin="15px">
  <CardBody>
    <ListItemEditor
      item={item}
      editHandler={(props, onSuccess) => {
        $update.mutate(props, { onSuccess: onSuccess })
      }}
      removalHandler={() => {
        $remove.mutate()
      }}
      alertHandler={() => (apiError = undefined)}
      errorMessage={errorMessage}
    />
  </CardBody>
</Card>
