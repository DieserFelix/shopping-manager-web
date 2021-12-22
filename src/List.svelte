<script lang="ts">
  import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
  } from "@sveltestack/svelte-query"
  import { navigate } from "svelte-navigator"
  import { Button, Pager } from "./components/action"
  import { Card, CardBody, Title } from "./components/card"
  import {
    Icon,
    PaginationControls,
    Spinner,
    Tooltip,
  } from "./components/content"
  import { PropEdit, TextArea } from "./components/form"
  import { Page } from "./components/layout"
  import { ListItemCreateCard, ListItemUpdateCard } from "./components/models"
  import {
    ApiError,
    authFetch,
    authToken,
    ButtonContexts,
    ButtonTypes,
    getListItemsApiRoute,
    getListsApiRoute,
    IconNames,
    ListItemColumns,
    Routes,
    ShoppingList,
    ShoppingListItem,
  } from "./lib"

  export let listId: number
  let filter = ""
  let sortColumn = "updated_at"
  let asc = false
  let page = 1
  let limit = 10
  let showMarkdown = false

  const queryClient = useQueryClient()

  $: getList = useQuery<ShoppingList, ApiError, ShoppingList, [string, number]>(
    ["list", listId],
    (p) => {
      return authFetch<ShoppingList>({
        url: getListsApiRoute({ id: p.queryKey[1] }),
        method: "GET",
        token: $authToken,
      })
    },
  )

  $: getMarkdown = useQuery<string, ApiError, string, [string, number]>(
    ["markdown", listId],
    (p) => {
      return authFetch<string>({
        url: getListsApiRoute({ id: p.queryKey[1] }) + "/markdown",
        method: "GET",
        token: $authToken,
      })
    },
    { enabled: false },
  )

  $: list = $getList.isLoading ? undefined : $getList.data

  $: getListItems = useInfiniteQuery<ShoppingListItem[], ApiError>({
    queryKey: ["listItems", filter, sortColumn, asc],
    queryFn: ({ pageParam = page }) => {
      return authFetch<ShoppingListItem[]>({
        url: getListItemsApiRoute({
          listId: list.id,
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
    enabled: list !== undefined,
  })

  const update = useMutation<
    ShoppingList,
    ApiError,
    Partial<Omit<ShoppingList, "id">>
  >(
    (params) =>
      authFetch<ShoppingList>({
        url: getListsApiRoute({}),
        method: "PUT",
        token: $authToken,
        body: {
          id: list.id,
          ...params,
        },
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("lists")
        queryClient.invalidateQueries(["list", data.id])
      },
    },
  )

  $: listItemPages = $getListItems.isLoading
    ? undefined
    : $getListItems.data?.pages
</script>

<Page title="Shopping Manager - {list?.title}">
  <Button
    type={ButtonTypes.BUTTON}
    context={ButtonContexts.NEUTRAL}
    action={() => navigate(Routes.LISTS)}
    slot="back"
  >
    <Icon>{IconNames.arrowBack}</Icon>
  </Button>
  {#if !list}
    <Card --width="100%">
      <CardBody><Spinner /></CardBody>
    </Card>
  {:else}
    <table style="width: 100%;">
      <tr>
        <td style="width: 30px;">
          <Button
            type={ButtonTypes.BUTTON}
            context={ButtonContexts.NEUTRAL}
            action={() => {
              $update.mutate({ finalized: !list.finalized })
            }}
          >
            <Icon>
              {list.finalized ? IconNames.lock : IconNames.lockOpen}
            </Icon>
          </Button>
        </td>
        <td>
          <Title>
            <PropEdit
              label={list.title}
              editHandler={(title, onSuccess) =>
                $update.mutate({ title: title.value }, { onSuccess })}
            />
          </Title>
        </td>
        <td style="width: 30px;">
          <Tooltip
            visible={showMarkdown}
            resizeContent={false}
            onClickOutside={() => (showMarkdown = false)}
            placement={"left"}
          >
            <Button
              type={ButtonTypes.BUTTON}
              context={ButtonContexts.NEUTRAL}
              action={() => {
                showMarkdown = !showMarkdown
                if (showMarkdown) {
                  $getMarkdown.refetch()
                }
              }}
            >
              <Icon>
                {IconNames.fileDownload}
              </Icon>
            </Button>
            <Card --width="500px" slot="content">
              <CardBody>
                {#if $getMarkdown.isLoading}
                  <Spinner size="100px" />
                {:else}
                  <TextArea value={$getMarkdown.data} />
                {/if}
              </CardBody>
            </Card>
          </Tooltip>
        </td>
      </tr>
    </table>
    <PaginationControls
      bind:filter
      bind:sortColumn
      bind:asc
      sortColumns={ListItemColumns}
    >
      <span slot="info">
        {Math.round((list.cost.price + Number.EPSILON) * 100) / 100}
        {list.cost.currency}
      </span>
      <ListItemCreateCard list={list} />
    </PaginationControls>
    {#if !listItemPages}
      <Card --width="100%">
        <CardBody><Spinner /></CardBody>
      </Card>
    {:else if listItemPages}
      {#each listItemPages as page}
        {#each page as item (`item-${item.id}`)}
          <ListItemUpdateCard item={item} />
        {/each}
      {/each}
      {#if $getListItems.hasNextPage}
        <Pager
          requestNextPage={() => {
            if (!$getListItems.isLoading) {
              $getListItems.fetchNextPage()
            }
          }}
        />
      {/if}
    {/if}
  {/if}
</Page>
