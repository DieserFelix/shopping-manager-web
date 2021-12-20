<script lang="ts">
  import { useQuery } from "@sveltestack/svelte-query"
  import {
    ApiError,
    authFetch,
    authToken,
    ButtonContexts,
    PaginationParams,
  } from "../../lib"
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
  export let completionHandler: (suggestion: string) => void = () => {}

  $: query = useQuery<Entity[], ApiError>(
    [queryKey, value],
    (p) => {
      return authFetch<Entity[]>({
        url: queryString({
          pagination: {
            filter: p.queryKey[1] as string,
            limit: 3,
            sortBy: "name",
          },
        }),
        method: "GET",
        token: $authToken,
      })
    },
    {
      enabled: queryKey !== undefined,
    },
  )

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
            completionHandler(suggestions[index].name)
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
            completionHandler(suggestion.name)
          }}
          buttonContext={ButtonContexts.AUTO_COMPLETE}
          active={index > -1
            ? suggestion.name == suggestions[index].name
            : false}
        >
          {suggestion.name}
        </ListGroupAction>
      {/each}
    </ListGroup>
  </Card>
{/if}
