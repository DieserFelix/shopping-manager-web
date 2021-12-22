<script lang="ts">
  import { ListItemEditor } from "."
  import {
    ApiError,
    ButtonContexts,
    ButtonTypes,
    IconNames,
    ShoppingList,
    ShoppingListItem,
    useListItemCreate,
  } from "../../lib"
  import { Button } from "../action"
  import { Card, CardBody, CardFooter } from "../card"
  import { Icon } from "../content"

  export let list: ShoppingList
  let item: Partial<ShoppingListItem> = {
    id: undefined,
    article_id: -1,
    amount: 1,
    price: { price: undefined, currency: undefined },
  }

  let apiError: ApiError

  const create = useListItemCreate({
    list: list,
    setItem: (i) => (item = i),
    setError: (error) => (apiError = error),
  })

  $: errorMessage = apiError ? apiError.message : ""
</script>

<Card --width="100%" --margin="15px">
  <CardBody>
    <ListItemEditor
      mode="CREATE"
      item={item}
      editHandler={(props, onSuccess) => {
        Object.entries(props).forEach(([prop, value]) => {
          item[prop] = value
        })
        onSuccess()
      }}
      alertHandler={() => (apiError = undefined)}
      errorMessage={errorMessage}
    />
  </CardBody>
  <CardFooter>
    <Button
      type={ButtonTypes.BUTTON}
      context={ButtonContexts.TRANSPARENT}
      action={() => {
        setTimeout(() => $create.mutate(item), 400)
      }}
    >
      <Icon>{IconNames.saveAlt}</Icon>
    </Button>
  </CardFooter>
</Card>
