<script lang="ts">
  import { useQuery } from "@sveltestack/svelte-query"
  import { PropEdit } from "."
  import { ApiError, authFetch, authToken } from "../../lib"
  import { Subtitle } from "../card"
  import { Spinner } from "../content"

  type EntityType = $$Generic<{ id: number; name: string }>

  export let title: string
  export let entityId: number
  export let queryString: (params: { id?: number; name?: string }) => string
  export let queryKey: any[]
  export let select: (entityId: number, onSuccess: () => void) => void
  export let setError: (error: ApiError) => void = () => {}

  let token: string = ""
  authToken.subscribe((value) => (token = value))

  const query = useQuery<EntityType[], ApiError>(
    queryKey,
    () =>
      authFetch<EntityType[]>({
        url: queryString({}),
        method: "GET",
        token: token,
      }),
    { onError: setError },
  )

  $: entity = !$query.isLoading
    ? $query.data.find((currentEntity) => currentEntity.id == entityId)
    : undefined
</script>

{#if $query.isLoading}
  <Spinner size="25px" />
{:else}
  <Subtitle>{title}</Subtitle>
  <PropEdit
    label={entity.name}
    options={$query.data}
    editHandler={(name, onSuccess) => {
      const entity = $query.data.find(
        (currentEntity) =>
          currentEntity.name.toLowerCase() === name.toLowerCase(),
      )
      if (!entity) {
        setError(new ApiError(404, `No such entity: ${name}`))
      }
      if (entity) {
        select(entity.id, onSuccess)
      }
    }}
  />
{/if}
