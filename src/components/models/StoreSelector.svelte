<script lang="ts">
  import { useQuery } from "@sveltestack/svelte-query"
  import { PropEdit } from "."
  import {
    ApiError,
    authFetch,
    authToken,
    errorMessage,
    getStoresApiRoute,
    Store,
  } from "../../lib"
  import { Spinner } from "../content"

  export let storeId: number
  export let selectStore: (storeId: number) => void

  let token: string = ""
  authToken.subscribe((value) => (token = value))

  let store: Store
  const storeQuery = useQuery<Store, ApiError>(
    ["stores", storeId],
    () =>
      authFetch<Store>({
        url: getStoresApiRoute({ storeId: storeId }),
        method: "GET",
        token: token,
      }),
    {
      onSuccess: (data) => (store = data),
      onError: (error) => errorMessage.set(error.message),
    },
  )
  let edit: boolean = false
  const storeListQuery = useQuery<Store[], ApiError>(
    "stores",
    () =>
      authFetch<Store[]>({
        url: getStoresApiRoute({}),
        method: "GET",
        token: token,
      }),
    { onError: (error) => errorMessage.set(error.message) },
  )

  let filter: string = ""
</script>

{#if $storeQuery.isLoading || $storeListQuery.isLoading}
  <Spinner size="25px" />
{:else}
  <h5>Store</h5>
  <PropEdit
    label={store.name}
    suggestions={$storeListQuery.data}
    editHandler={(name) => {
      const store = $storeListQuery.data.find(
        (currentStore) =>
          currentStore.name.toLowerCase() === name.toLowerCase(),
      )
      selectStore(store.id)
      return store.name
    }}
  />
{/if}

<style>
  h5 {
    font-size: 1.1rem;
    font-weight: bold;
  }
</style>
