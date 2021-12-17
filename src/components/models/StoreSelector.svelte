<script lang="ts">
  import { useQuery } from "@sveltestack/svelte-query"
  import { PropEdit } from "."
  import {
    ApiError,
    authFetch,
    authToken,
    getStoresApiRoute,
    Store,
  } from "../../lib"
  import { Spinner } from "../content"

  export let storeId: number
  export let select: (storeId: number, onSuccess: () => void) => void
  export let setError: (error: ApiError) => void = () => {}

  let token: string = ""
  authToken.subscribe((value) => (token = value))

  const storesQuery = useQuery<Store[], ApiError>(
    "stores",
    () =>
      authFetch<Store[]>({
        url: getStoresApiRoute({}),
        method: "GET",
        token: token,
      }),
    { onError: setError },
  )

  $: store = !$storesQuery.isLoading
    ? $storesQuery.data.find((currentStore) => currentStore.id == storeId)
    : undefined
</script>

{#if $storesQuery.isLoading}
  <Spinner size="25px" />
{:else}
  <h5>Store</h5>
  <PropEdit
    label={store.name}
    suggestions={$storesQuery.data}
    editHandler={(name, onSuccess) => {
      const store = $storesQuery.data.find(
        (currentStore) =>
          currentStore.name.toLowerCase() === name.toLowerCase(),
      )
      if (!store) {
        setError(new ApiError(404, `No such store: ${name}`))
      }
      if (store) {
        select(store.id, onSuccess)
      }
    }}
  />
{/if}

<style>
  h5 {
    font-size: 1.1rem;
    font-weight: bold;
  }
</style>
