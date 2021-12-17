<script lang="ts">
  import {
    useMutation,
    useQuery,
    useQueryClient,
  } from "@sveltestack/svelte-query"
  import { StoreSelector } from "."
  import {
    ApiError,
    Article,
    authFetch,
    authToken,
    errorMessage,
    getArticlesApiRoute,
  } from "../../lib"
  import { Card, CardTitle } from "../card"
  import CardBody from "../card/CardBody.svelte"
  import { Spinner } from "../content"
  import PropEdit from "./PropEdit.svelte"

  export let articleId: number

  let token: string = ""
  authToken.subscribe((value) => (token = value))

  const queryClient = useQueryClient()
  let article: Article
  const query = useQuery<Article, ApiError>(
    ["articles", articleId],
    () =>
      authFetch<Article>({
        url: getArticlesApiRoute(articleId),
        method: "GET",
        token: token,
      }),
    {
      onSuccess: (data) => (article = data),
      onError: (error) => errorMessage.set(error.message),
    },
  )

  const mutation = useMutation<Article, ApiError, Partial<Omit<Article, "id">>>(
    (params) =>
      authFetch<Article>({
        url: getArticlesApiRoute(),
        method: "PUT",
        token: token,
        body: {
          id: articleId,
          ...params,
        },
      }),
    {
      onSuccess: (data) => {
        article = data
      },
      onError: (error) => errorMessage.set(error.message),
    },
  )
</script>

<Card --width="100%" --margin="15px">
  <CardBody>
    {#if $query.isLoading}
      <Spinner size="50px" />
    {:else}
      <CardTitle>
        <PropEdit
          label={article.name}
          editHandler={(name) => {
            $mutation.mutate({
              name: name,
            })
          }}
        />
      </CardTitle>
      <PropEdit
        label={article.detail}
        editHandler={(detail) => {
          $mutation.mutate({
            detail: detail,
          })
        }}
      />
      <StoreSelector
        storeId={article.store_id}
        selectStore={(storeId) => {
          $mutation.mutate({
            store_id: storeId,
          })
        }}
      />
    {/if}
  </CardBody>
</Card>
