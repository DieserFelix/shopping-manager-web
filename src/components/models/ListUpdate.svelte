<script lang="ts">
  import { navigate } from "svelte-navigator"
  import { ListEditor } from "."
  import {
    ApiError,
    ButtonContexts,
    ButtonTypes,
    getListRoute,
    IconNames,
    ShoppingList,
    useListDelete,
    useListUpdate,
  } from "../../lib"
  import { Button } from "../action"
  import { Card, CardBody, CardFooter } from "../card"
  import { Icon } from "../content"

  export let list: ShoppingList
  let apiError: ApiError

  const update = useListUpdate({
    list: list,
    setError: (error) => (apiError = error),
  })

  const remove = useListDelete({
    list: list,
    setError: (error) => (apiError = error),
  })

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
