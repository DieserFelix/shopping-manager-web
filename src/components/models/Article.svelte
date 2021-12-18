<script lang="ts">
  import {
    useMutation,
    useQuery,
    useQueryClient,
  } from "@sveltestack/svelte-query"
  import { Selector } from "."
  import {
    ApiError,
    Article,
    authFetch,
    authToken,
    getArticlesApiRoute,
    getCategoriesApiRoute,
    getStoresApiRoute,
  } from "../../lib"
  import { Card, Subtitle, Title } from "../card"
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
    - Rework AutoCompletion into its own Component with keyboard controls (maybe rethink Tooltip approach)
    - Implement DELETE functionality (CardDismiss possibly)
    - Implement CREATE functionality
    - Implement pagination
    - Implement price history with ChartJS (learn how to do in Svelte)
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
      <Title>
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
      </Title>
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
      <table>
        <tr>
          <td>
            <Selector
              entityId={article.store_id}
              title={"Store"}
              queryString={getStoresApiRoute}
              queryKey={["stores", undefined]}
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
          </td>
          <td>
            <Selector
              entityId={article.category_id}
              title={"Category"}
              queryString={getCategoriesApiRoute}
              queryKey={["categories", undefined]}
              select={(categoryId, onSuccess) => {
                $mutation.mutate(
                  {
                    category_id: categoryId,
                  },
                  { onSuccess },
                )
              }}
              setError={(error) => {
                apiError = error
              }}
            />
          </td>
          <td>
            <Subtitle>Price ({article.price.currency})</Subtitle>
            <PropEdit
              label={`${article.price.price}`}
              editHandler={async (price, onSuccess) => {
                $mutation.mutate(
                  {
                    price: {
                      price: parseFloat(price),
                      currency: article.price.currency,
                    },
                  },
                  { onSuccess },
                )
              }}
            />
          </td>
        </tr>
      </table>
    {/if}
  </CardBody>
</Card>

<style>
  table {
    width: 100%;
  }

  td {
    width: 30%;
    margin: 5px;
  }
</style>
