<script lang="ts">
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query"
  import { ListEditor } from "."
  import {
    ApiError,
    authFetch,
    authToken,
    ButtonContexts,
    ButtonTypes,
    getListsApiRoute,
    IconNames,
    ShoppingList,
  } from "../../lib"
  import { Button } from "../action"
  import { Card, CardBody, CardFooter } from "../card"
  import { Icon } from "../content"

  let list: Partial<ShoppingList> = {
    id: undefined,
    title: "",
    finalized: false,
  }

  const queryClient = useQueryClient()

  const create = useMutation<ShoppingList, ApiError, Partial<ShoppingList>>(
    (params) =>
      authFetch<ShoppingList>({
        url: getListsApiRoute({}),
        method: "POST",
        token: $authToken,
        body: params,
      }),
    {
      onSuccess: () => {
        apiError = undefined
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
      mode="CREATE"
      list={list}
      editHandler={(props) => {
        Object.entries(props).forEach(([prop, value]) => {
          list[prop] = value
        })
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
        setTimeout(() => $create.mutate(list), 400)
      }}
    >
      <Icon>{IconNames.saveAlt}</Icon>
    </Button>
  </CardFooter>
</Card>
