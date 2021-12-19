<script lang="ts">
  import { useQuery } from "@sveltestack/svelte-query"
  import { Button } from "./components/action"
  import { Card, CardBody } from "./components/card"
  import { Icon, Menu } from "./components/content"
  import Spinner from "./components/content/Spinner.svelte"
  import { Bar, Container } from "./components/layout"
  import { ArticleCreateCard, ArticleUpdateCard } from "./components/models"
  import {
    ApiError,
    Article,
    authFetch,
    authToken,
    ButtonContexts,
    ButtonTypes,
    getArticlesApiRoute,
    IconNames,
  } from "./lib"

  const getArticles = useQuery<Article[], ApiError>("articles", () =>
    authFetch<Article[]>({
      url: getArticlesApiRoute({
        sort_by: "name",
        asc: false,
      }),
      method: "GET",
      token: $authToken,
    }),
  )

  let createArticle = false

  $: articles = $getArticles.isLoading ? [] : $getArticles.data
  $: {
    if (articles.length == 0) {
      createArticle = true
    } else {
      createArticle = false
    }
  }
</script>

<Bar title="Shopping Manager">
  <Menu />
</Bar>

<Container>
  <div class="content">
    <h4>Articles</h4>
    {#if !articles}
      <Card --width="100%">
        <CardBody><Spinner /></CardBody>
      </Card>
    {:else}
      <div class="controls">
        <Button
          type={ButtonTypes.BUTTON}
          context={ButtonContexts.NEUTRAL}
          action={() => (createArticle = !createArticle)}
        >
          <Icon>{IconNames.add}</Icon>
        </Button>
        {#if createArticle}
          <ArticleCreateCard
            successHandler={() => (createArticle = false)}
            slot="content"
          />
        {/if}
      </div>
      {#if articles.length}
        {#each articles as article (`article-${article.id}`)}
          <ArticleUpdateCard article={article} />
        {/each}
      {/if}
    {/if}
  </div>
</Container>

<style>
  div.content {
    width: 80%;
  }

  div.controls {
    color: white;
  }

  h4 {
    margin: 15px;
    font-size: 1.25rem;
    font-weight: bolder;
    line-height: 1.2;
    color: white;
  }
</style>
