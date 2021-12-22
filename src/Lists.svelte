<script lang="ts">
  import { useInfiniteQuery } from "@sveltestack/svelte-query"
  import { navigate } from "svelte-navigator"
  import { Button, Pager } from "./components/action"
  import { Card, CardBody, Title } from "./components/card"
  import { Icon, PaginationControls, Spinner } from "./components/content"
  import { Page } from "./components/layout"
  import { ListCreateCard, ListUpdateCard } from "./components/models"
  import {
    ApiError,
    authFetch,
    authToken,
    ButtonContexts,
    ButtonTypes,
    getListsApiRoute,
    IconNames,
    ListColumns,
    Routes,
    ShoppingList,
  } from "./lib"

  let filter = ""
  let sortColumn = "updated_at"
  let asc = false
  let page = 1
  let limit = 10

  $: getLists = useInfiniteQuery<ShoppingList[], ApiError>({
    queryKey: ["lists", filter, sortColumn, asc],
    queryFn: ({ pageParam = page }) => {
      return authFetch<ShoppingList[]>({
        url: getListsApiRoute({
          pagination: {
            filter: filter,
            sortBy: sortColumn,
            limit: limit,
            asc: asc,
            page: pageParam,
          },
        }),
        method: "GET",
        token: $authToken,
      })
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length == limit) {
        return allPages.length + 1
      }
      return undefined
    },
  })

  $: listPages = $getLists.isLoading ? undefined : $getLists.data.pages
</script>

<Page title="Shopping Manager - Shopping Lists">
  <Button
    type={ButtonTypes.BUTTON}
    context={ButtonContexts.NEUTRAL}
    action={() => navigate(Routes.DASHBOARD)}
    slot="back"
  >
    <Icon>{IconNames.arrowBack}</Icon>
  </Button>
  <Title>Shopping Lists</Title>
  <PaginationControls
    bind:filter
    bind:sortColumn
    bind:asc
    sortColumns={ListColumns}
  >
    <ListCreateCard />
  </PaginationControls>
  {#if !listPages}
    <Card --width="100%">
      <CardBody><Spinner /></CardBody>
    </Card>
  {:else if listPages}
    {#each listPages as page}
      {#each page as list (`list-${list.id}`)}
        <ListUpdateCard list={list} />
      {/each}
    {/each}
    {#if $getLists.hasNextPage}
      <Pager
        requestNextPage={() => {
          if (!$getLists.isLoading) {
            $getLists.fetchNextPage()
          }
        }}
      />
    {/if}
  {/if}
</Page>
