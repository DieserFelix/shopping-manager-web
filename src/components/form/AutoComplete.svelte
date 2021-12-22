<script lang="ts">
  import { ButtonContexts, PaginationParams, useRead } from "../../lib"
  import { Card } from "../card"
  import { ListGroup, ListGroupAction } from "../list"

  type Entity = $$Generic<{ id: number; name: string }>

  export let visible: boolean
  export let value: string
  export let queryKey: string = undefined
  export let queryString: (params: {
    id?: number
    pagination: PaginationParams
  }) => string = undefined
  export let completionHandler: (suggestion: Entity) => void = () => {}
  export let suggestionFormatter: (suggestion: any) => string = (
    suggestion: any,
  ) => suggestion.name

  $: query = useRead<Entity[], [string, string]>({
    key: [queryKey, value],
    urlFn: (k) =>
      queryString({
        pagination: {
          filter: k[1],
          limit: 3,
          sortBy: "name",
        },
      }),
    enabled: queryKey !== undefined,
  })

  export let suggestions: Entity[] = []
  $: suggestions = $query.isLoading ? undefined : $query.data
  let index: number = -1

  const keyHandler = (event: KeyboardEvent) => {
    if (visible && suggestions) {
      switch (event.key) {
        case "Down":
        case "ArrowDown":
          if (index < suggestions.length - 1) {
            index += 1
            event.preventDefault()
          }
          break

        case "Up":
        case "ArrowUp":
          if (index > 0) {
            index -= 1
            event.preventDefault()
          }
          break

        case "Right":
        case "ArrowRight":
          if (index != -1) {
            value = suggestions[index].name
            index = -1
            event.preventDefault()
          }
          break

        case "Enter":
        case "Tab":
          if (index != -1) {
            completionHandler(suggestions[index])
            index = -1
            event.preventDefault()
          }
          break

        case "Escape":
          index = -1
          break

        default:
          return
      }
    }
  }
</script>

<svelte:window on:keydown={keyHandler} />
{#if suggestions && !(suggestions.length == 1 && suggestions[0].name.toLowerCase() == value.toLowerCase())}
  <Card --margin="0">
    <ListGroup>
      {#each suggestions as suggestion}
        <ListGroupAction
          action={() => {
            completionHandler(suggestion)
          }}
          buttonContext={ButtonContexts.AUTO_COMPLETE}
          active={index > -1
            ? suggestion.name == suggestions[index].name
            : false}
        >
          {suggestionFormatter(suggestion)}
        </ListGroupAction>
      {/each}
    </ListGroup>
  </Card>
{/if}
