<script lang="ts">
  import { useInfiniteQuery } from "@sveltestack/svelte-query"
  import { Button } from "./components/action"
  import Pager from "./components/action/Pager.svelte"
  import { Card, CardBody, Title } from "./components/card"
  import { Icon, Menu, Tooltip } from "./components/content"
  import Spinner from "./components/content/Spinner.svelte"
  import { PropEdit } from "./components/form"
  import { Bar, Container } from "./components/layout"
  import { ListGroup } from "./components/list"
  import ListGroupAction from "./components/list/ListGroupAction.svelte"
  import { ArticleCreateCard, ArticleUpdateCard } from "./components/models"
  import {
    ApiError,
    Article,
    ArticleColumns,
    authFetch,
    authToken,
    ButtonContexts,
    ButtonTypes,
    getArticlesApiRoute,
    IconNames,
  } from "./lib"

  let createArticle = false
  let setFilter = false
  let nameFilter = ""
  let setSortColumn = false
  let sortColumn = "updated_at"
  let asc = true
  let page = 1
  let limit = 5

  $: getArticles = useInfiniteQuery<Article[], ApiError>({
    queryKey: ["articles", nameFilter, sortColumn, asc],
    queryFn: ({ pageParam = page }) => {
      return authFetch<Article[]>({
        url: getArticlesApiRoute({
          pagination: {
            filter: nameFilter,
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

  $: articlePages = $getArticles.isLoading ? undefined : $getArticles.data.pages
  $: {
    if (!$getArticles.isLoading) {
      if (!$getArticles.data.pages.length) {
        createArticle = true
      }
    }
  }
</script>

<Bar title="Shopping Manager">
  <Menu />
</Bar>

<Container>
  <div class="content">
    <Title>Articles</Title>
    <div class="controls">
      <div style="float: left">
        <Button
          type={ButtonTypes.BUTTON}
          context={ButtonContexts.NEUTRAL}
          action={() => (createArticle = !createArticle)}
        >
          <Icon>{IconNames.add}</Icon>
        </Button>
      </div>
      <div style="float: right; display: flex; flex-direction: row;">
        {#if !setFilter}
          {nameFilter}
          <Button
            type={ButtonTypes.BUTTON}
            context={ButtonContexts.NEUTRAL}
            action={() => (setFilter = true)}
          >
            <Icon>{IconNames.search}</Icon>
          </Button>
        {:else}
          <PropEdit
            label={nameFilter}
            editHandler={(label) => {
              setFilter = false
              nameFilter = label
            }}
            permaEdit={true}
          />
        {/if}
        <Tooltip
          visible={setSortColumn}
          onClickOutside={() => (setSortColumn = false)}
        >
          <Button
            type={ButtonTypes.BUTTON}
            context={ButtonContexts.NEUTRAL}
            action={() => (setSortColumn = !setSortColumn)}
          >
            <Icon>{IconNames.filterAlt}</Icon></Button
          >
          <Card --width="200px" slot="content">
            <ListGroup>
              {#each Object.entries(ArticleColumns) as [label, column]}
                <ListGroupAction
                  buttonContext={ButtonContexts.ANCHOR}
                  action={() => {
                    setSortColumn = false
                    sortColumn = column
                  }}
                  active={sortColumn == column}
                >
                  {label}
                </ListGroupAction>
              {/each}
            </ListGroup>
          </Card>
        </Tooltip>
        <Button
          type={ButtonTypes.BUTTON}
          context={ButtonContexts.NEUTRAL}
          action={() => (asc = !asc)}
        >
          <Icon>{asc ? IconNames.trendingUp : IconNames.trendingDown}</Icon
          ></Button
        >
      </div>
    </div>
    {#if createArticle}
      <ArticleCreateCard
        successHandler={() => (createArticle = false)}
        slot="content"
      />
    {/if}
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
  </div>
</Container>

<style>
  div.content {
    width: 80%;
    color: white;
    margin-top: 15px;
  }

  div.controls {
    color: white;
    width: 100%;
    line-height: 30px;
    height: 30px;
    margin: 15px;
  }
</style>
