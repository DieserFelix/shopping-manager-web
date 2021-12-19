<script lang="ts">
  import { useQuery } from "@sveltestack/svelte-query"
  import { ApiError, authFetch, authToken, ButtonContexts } from "../../lib"
  import { Card } from "../card"
  import { ListGroup, ListGroupAction } from "../list"

  type Entity = $$Generic<{ id: number; name: string }>

  export let visible: boolean
  export let value: string
  export let queryKey: string = undefined
  export let queryString: (params: {
    id?: number
    name?: string
    sort_by?: string
    page?: number
    limit?: number
    asc?: boolean
  }) => string = undefined
  export let completionHandler: (suggestion: string) => void = () => {}

  $: query = useQuery<Entity[], ApiError>(
    [queryKey, value],
    (p) => {
      return authFetch<Entity[]>({
        url: queryString({
          name: p.queryKey[1] as string,
          limit: 3,
          sort_by: "name",
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
  let index: number = 0

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
            index = 0
            event.preventDefault()
          }
          break
        case "Enter":
          if (index != -1) {
            completionHandler(suggestions[index].name)
            index = 0
            event.preventDefault()
          }
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
