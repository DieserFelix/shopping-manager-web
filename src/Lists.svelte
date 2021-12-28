<script lang="ts">
  import { navigate } from "svelte-navigator"
  import { Button, Pager } from "./components/action"
  import { Card, CardBody, Title } from "./components/card"
  import { Icon, PaginationControls, Spinner } from "./components/content"
  import { Page } from "./components/layout"
  import { ListCreateCard, ListUpdateCard } from "./components/models"
  import {
    ButtonContexts,
    ButtonTypes,
    getListsApiRoute,
    IconNames,
    ListColumns,
    Routes,
    ShoppingList,
    useListsPagination,
    usePaginatedQuery,
  } from "./lib"

  let {
    filter,
    sortBy: sortColumn,
    asc,
    page,
    limit,
    serializePagination,
  } = useListsPagination()

  $: {
    serializePagination({
      filter,
      sortBy: sortColumn,
      asc,
      page,
      limit,
    })
  }

  $: getLists = usePaginatedQuery<ShoppingList>({
    key: "lists",
    urlFn: getListsApiRoute,
    pagination: {
      filter: filter,
      sortBy: sortColumn,
      asc: asc,
      page: page,
      limit: limit,
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
