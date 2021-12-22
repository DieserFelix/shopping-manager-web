<script lang="ts">
  import { ListEditor } from "."
  import {
    ApiError,
    ButtonContexts,
    ButtonTypes,
    IconNames,
    ShoppingList,
    useListCreate,
  } from "../../lib"
  import { Button } from "../action"
  import { Card, CardBody, CardFooter } from "../card"
  import { Icon } from "../content"

  let list: Partial<ShoppingList> = {
    id: undefined,
    title: "",
    finalized: false,
  }

  let apiError: ApiError

  const create = useListCreate({
    setList: (l) => (list = l),
    setError: (error) => (apiError = error),
  })

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
