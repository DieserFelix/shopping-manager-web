<script lang="ts">
  import { navigate } from "svelte-navigator"
  import { Button, Pager } from "./components/action"
  import { Card, CardBody, Title } from "./components/card"
  import { Icon, PaginationControls, Spinner } from "./components/content"
  import { Page } from "./components/layout"
  import { ArticleCreateCard, ArticleUpdateCard } from "./components/models"
  import {
    Article,
    ArticleColumns,
    ButtonContexts,
    ButtonTypes,
    getArticlesApiRoute,
    IconNames,
    Routes,
    usePaginatedQuery,
  } from "./lib"

  let filter = ""
  let sortColumn = ArticleColumns.Name
  let asc = true
  let page = 1
  let limit = 5

  $: getArticles = usePaginatedQuery<Article>({
    key: "articles",
    urlFn: getArticlesApiRoute,
    pagination: {
      filter: filter,
      sortBy: sortColumn,
      asc: asc,
      page: page,
      limit: limit,
    },
  })

  $: articlePages = $getArticles.isLoading ? undefined : $getArticles.data.pages
</script>

<Page title="Shopping Manager - Articles">
  <Button
    type={ButtonTypes.BUTTON}
    context={ButtonContexts.NEUTRAL}
    action={() => navigate(Routes.DASHBOARD)}
    slot="back"
  >
    <Icon>{IconNames.arrowBack}</Icon>
  </Button>
  <Title>Articles</Title>
  <PaginationControls
    bind:filter
    bind:sortColumn
    bind:asc
    sortColumns={ArticleColumns}
  >
    <ArticleCreateCard />
  </PaginationControls>
  {#if !articlePages}
    <Card --width="100%">
      <CardBody><Spinner /></CardBody>
    </Card>
  {:else if articlePages}
    {#each articlePages as page}
      {#each page as article (`article-${article.id}`)}
        <ArticleUpdateCard article={article} />
      {/each}
    {/each}
    {#if $getArticles.hasNextPage}
      <Pager
        requestNextPage={() => {
          if (!$getArticles.isLoading) {
            $getArticles.fetchNextPage()
          }
        }}
      />
    {/if}
  {/if}
</Page>
