<script lang="ts">
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query"
  import { ListItemEditor } from "."
  import {
    ApiError,
    authFetch,
    authToken,
    getListItemsApiRoute,
    ShoppingListItem,
  } from "../../lib"
  import { Card, CardBody } from "../card"

  export let item: ShoppingListItem

  const queryClient = useQueryClient()

  const update = useMutation<
    ShoppingListItem,
    ApiError,
    Partial<Omit<ShoppingListItem, "id">>
  >(
    (params) =>
      authFetch<ShoppingListItem>({
        url: getListItemsApiRoute({ listId: item.list_id }),
        method: "PUT",
        token: $authToken,
        body: {
          id: item.id,
          ...params,
        },
      }),
    {
      onSuccess: (data) => {
        apiError = undefined
        queryClient.refetchQueries("list")
        queryClient.refetchQueries("lists")
        queryClient.refetchQueries("listItems")
      },
      onError: (error) => {
        if (error.statusCode != 404) {
          apiError = error
        }
        queryClient.invalidateQueries("listItems")
      },
    },
  )

  const remove = useMutation<void, ApiError>(
    () =>
      authFetch<void>({
        url: getListItemsApiRoute({ listId: item.list_id, id: item.id }),
        method: "DELETE",
        token: $authToken,
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries("lists")
        queryClient.refetchQueries("list")
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
