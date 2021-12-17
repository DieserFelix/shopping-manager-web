<script lang="ts">
  import { useQuery } from "@sveltestack/svelte-query"
  import { Card, CardBody } from "./components/card"
  import { Menu } from "./components/content"
  import Spinner from "./components/content/Spinner.svelte"
  import { Bar, Container } from "./components/layout"
  import { Article as ArticleComponent } from "./components/models"
  import { Alert } from "./components/network"
  import {
    ApiError,
    Article,
    authFetch,
    authToken,
    getArticlesApiRoute,
  } from "./lib"

  let token: string = ""
  authToken.subscribe((value) => (token = value))

  let apiError: ApiError
  $: errorMessage = apiError ? apiError.message : ""

  const query = useQuery<Article[], ApiError>(
    ["articles", undefined],
    () =>
      authFetch<Article[]>({
        url: getArticlesApiRoute(),
        method: "GET",
        token: token,
      }),
    { onError: (error) => (apiError = error) },
  )
</script>

<Bar title="Shopping Manager">
  <Menu />
</Bar>

<Container>
  <div class="content">
    <Alert errorMessage={errorMessage} dismiss={() => (apiError = undefined)} />
    <h4>Articles</h4>
    {#if $query.isLoading}
      <Card>
        <CardBody><Spinner /></CardBody>
      </Card>
    {:else}
      {#each $query.data as article}
        <ArticleComponent articleId={article.id} />
      {/each}
    {/if}
  </div>
</Container>

<style>
  div.content {
    width: 80%;
  }

  h4 {
    margin: 15px;
    font-size: 1.25rem;
    font-weight: bolder;
    line-height: 1.2;
    color: white;
  }
</style>
