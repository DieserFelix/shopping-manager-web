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
    getArticlesApiRoute,
  } from "../../lib"
  import { Card, CardTitle } from "../card"
  import CardBody from "../card/CardBody.svelte"
  import { Spinner } from "../content"
  import { Alert } from "../network"
  import PropEdit from "./PropEdit.svelte"

  export let articleId: number

  let token: string = ""
  authToken.subscribe((value) => (token = value))

  let article: Article
  let apiError: ApiError
  const queryClient = useQueryClient()
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
      onError: (error) => (apiError = error),
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
        apiError = undefined
      },
      onError: (error) => {
        apiError = error
      },
      onMutate: () => {
        queryClient.invalidateQueries(["articles", article.id])
      },
    },
  )

  $: errorMessage = apiError ? apiError.message : ""

  /*
  TODO: 
    - Implement CategorySelector, add PropEdit for Price
    - Display StoreSelector, CategorySelector, Price PropEdit in one row, 30% each
    - Rework AutoCompletion into its own Component with keyboard controls (maybe rethink Tooltip approach)
    - Implement DELETE functionality (CardDismiss possibly)
    - Implement CREATE functionality
    - Implement pagination
  */
</script>

<Card --width="100%" --margin="15px">
  <CardBody>
    {#if $query.isLoading}
      <Spinner size="50px" />
    {:else}
      <Alert
        errorMessage={errorMessage}
        dismiss={() => (apiError = undefined)}
      />
      <CardTitle>
        <PropEdit
          label={article.name}
          editHandler={(name, onSuccess) => {
            $mutation.mutate(
              {
                name: name,
              },
              { onSuccess },
            )
          }}
        />
      </CardTitle>
      <PropEdit
        label={article.detail}
        editHandler={async (detail, onSuccess) => {
          $mutation.mutate(
            {
              detail: detail,
            },
            { onSuccess },
          )
        }}
      />
      <StoreSelector
        storeId={article.store_id}
        select={(storeId, onSuccess) => {
          $mutation.mutate(
            {
              store_id: storeId,
            },
            { onSuccess },
          )
        }}
        setError={(error) => {
          apiError = error
        }}
      />
    {/if}
  </CardBody>
</Card>
