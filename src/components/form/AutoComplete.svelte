<script lang="ts">
  import { ButtonContexts } from "../../lib"
  import { Card } from "../card"
  import { ListGroup, ListGroupAction } from "../list"

  export let options: { name: string }[] = []
  export let value: string
  export let completionHandler: (suggestion: string) => void = () => {}

  $: suggestions = options.filter((option) =>
    option.name.toLowerCase().includes(value.toLowerCase()),
  )

  $: index = suggestions.length * 0 - 1

  const keyHandler = (event: KeyboardEvent) => {
    if (options.length) {
      switch (event.key) {
        case "Down":
        case "ArrowDown":
          if (index < suggestions.length - 1) {
            index += 1
            console.log(suggestions[index])
            event.preventDefault()
          }
          break

        case "Up":
        case "ArrowUp":
          if (index > 0) {
            index -= 1
            console.log(suggestions[index])
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
          if (index != -1) {
            completionHandler(suggestions[index].name)
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

<Card --margin="0" slot="content">
  <ListGroup>
    {#each suggestions as suggestion}
      {#if suggestion.name.toLowerCase().includes(value.toLowerCase())}
        <ListGroupAction
          action={() => completionHandler(suggestion.name)}
          buttonContext={ButtonContexts.AUTO_COMPLETE}
          active={index > -1
            ? suggestion.name == suggestions[index].name
            : false}
        >
          {suggestion.name}
        </ListGroupAction>
      {/if}
    {/each}
  </ListGroup>
</Card>
