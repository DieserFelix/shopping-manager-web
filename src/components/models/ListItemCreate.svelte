<script lang="ts">
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query"
  import { ListItemEditor } from "."
  import {
    ApiError,
    authFetch,
    authToken,
    ButtonContexts,
    ButtonTypes,
    getListItemsApiRoute,
    IconNames,
    ShoppingList,
    ShoppingListItem,
  } from "../../lib"
  import { Button } from "../action"
  import { Card, CardBody, CardFooter } from "../card"
  import { Icon } from "../content"

  export let list: ShoppingList

  let item: Partial<ShoppingListItem> = {
    id: undefined,
    article_id: -1,
    amount: 1,
    price: undefined,
  }

  const queryClient = useQueryClient()

  const create = useMutation<
    ShoppingListItem,
    ApiError,
    Partial<ShoppingListItem>
  >(
    (params) =>
      authFetch<ShoppingListItem>({
        url: getListItemsApiRoute({ listId: list.id }),
        method: "POST",
        token: $authToken,
        body: params,
      }),
    {
      onSuccess: (data) => {
        apiError = undefined
        item = {
          id: undefined,
          article_id: -1,
          amount: 1,
          price: undefined,
        }
        queryClient.refetchQueries("list")
        queryClient.refetchQueries("lists")
        queryClient.refetchQueries("listItems")
      },
      onError: (error) => {
        apiError = error
      },
    },
  )

  let apiError: ApiError
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
