<script lang="ts">
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query"
  import { navigate } from "svelte-navigator"
  import { ListEditor } from "."
  import {
    ApiError,
    authFetch,
    authToken,
    ButtonContexts,
    ButtonTypes,
    getListRoute,
    getListsApiRoute,
    IconNames,
    ShoppingList,
  } from "../../lib"
  import { Button } from "../action"
  import { Card, CardBody, CardFooter } from "../card"
  import { Icon } from "../content"

  export let list: ShoppingList

  const queryClient = useQueryClient()

  const update = useMutation<
    ShoppingList,
    ApiError,
    Partial<Omit<ShoppingList, "id">>
  >(
    (params) =>
      authFetch<ShoppingList>({
        url: getListsApiRoute({}),
        method: "PUT",
        token: $authToken,
        body: {
          id: list.id,
          ...params,
        },
      }),
    {
      onSuccess: (data) => {
        apiError = undefined
        queryClient.invalidateQueries("lists")
      },
      onError: (error) => {
        apiError = error
        queryClient.invalidateQueries("lists")
      },
    },
  )

  const remove = useMutation<void, ApiError>(
    () =>
      authFetch<void>({
        url: getListsApiRoute({ id: list.id }),
        method: "DELETE",
        token: $authToken,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("lists")
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
    <ListEditor
      list={list}
      editHandler={(props, onSuccess) => {
        $update.mutate(props, { onSuccess: onSuccess })
      }}
      removalHandler={() => {
        $remove.mutate()
      }}
      alertHandler={() => (apiError = undefined)}
      errorMessage={errorMessage}
    />
    <span>
      Total cost: {Math.round((list.cost.price + Number.EPSILON) * 100) / 100}
    </span>
  </CardBody>
  <CardFooter>
    <Button
      type={ButtonTypes.BUTTON}
      context={ButtonContexts.TRANSPARENT}
      action={() => navigate(getListRoute(list.id))}
    >
      <Icon>
        {IconNames.expandMore}
      </Icon>
    </Button>
  </CardFooter>
</Card>

<style>
  span {
    float: right;
    font-size: 10pt;
  }
</style>
