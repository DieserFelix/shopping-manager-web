<script lang="ts">
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query"
  import { PriceHistory } from "."
  import {
    ApiError,
    Article,
    authFetch,
    authToken,
    getArticlesApiRoute,
  } from "../../lib"
  import { Card, CardBody, CardFooter } from "../card"
  import ArticleEditor from "./ArticleEditor.svelte"

  export let article: Article

  const queryClient = useQueryClient()

  const update = useMutation<Article, ApiError, Partial<Omit<Article, "id">>>(
    (params) =>
      authFetch<Article>({
        url: getArticlesApiRoute(),
        method: "PUT",
        token: $authToken,
        body: {
          id: article.id,
          ...params,
        },
      }),
    {
      onSuccess: (data) => {
        apiError = undefined
        queryClient.invalidateQueries("articles")
        queryClient.invalidateQueries(["prices", data.id])
      },
      onError: (error) => {
        apiError = error
        queryClient.invalidateQueries("articles")
      },
    },
  )

  const remove = useMutation<void, ApiError>(
    () =>
      authFetch<void>({
        url: getArticlesApiRoute({ id: article.id }),
        method: "DELETE",
        token: $authToken,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("articles")
      },
      onError: (error) => {
        apiError = error
      },
    },
  )

  let apiError: ApiError
  $: errorMessage = apiError ? apiError.message : ""
</script>

<Card --width="100%" --margin="15px">
  <CardBody>
    <ArticleEditor
      article={article}
      editHandler={(props, onSuccess) => {
        $update.mutate(props, { onSuccess: onSuccess })
      }}
      removalHandler={() => {
        $remove.mutate()
      }}
      alertHandler={() => (apiError = undefined)}
      errorMessage={errorMessage}
    />
  </CardBody>
  <CardFooter>
    <PriceHistory article={article} />
  </CardFooter>
</Card>
