<script lang="ts">
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query"
  import {
    ApiError,
    Article,
    authFetch,
    authToken,
    getArticlesApiRoute,
    getCategoriesApiRoute,
    getStoresApiRoute,
  } from "../../lib"
  import { Deletion } from "../action/"
  import { Card, CardBody, Subtitle, Title } from "../card"
  import CardDismissal from "../card/CardDismissal.svelte"
  import { PropEdit, Selector } from "../form"
  import { Alert } from "../network"

  export let article: Article

  let token: string = ""
  authToken.subscribe((value) => (token = value))

  let apiError: ApiError
  const queryClient = useQueryClient()

  const mutation = useMutation<Article, ApiError, Partial<Omit<Article, "id">>>(
    (params) =>
      authFetch<Article>({
        url: getArticlesApiRoute(),
        method: "PUT",
        token: token,
        body: {
          id: article.id,
          ...params,
        },
      }),
    {
      onSuccess: (data) => {
        apiError = undefined
        queryClient.invalidateQueries("articles")
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
        url: getArticlesApiRoute(article.id),
        method: "DELETE",
        token: token,
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

  $: errorMessage = apiError ? apiError.message : ""

  /*
  TODO: 
    - Implement CREATE functionality
    - Implement pagination
    - Implement price history with ChartJS (learn how to do in Svelte)
  */
</script>

<Card --width="100%" --margin="15px">
  <CardBody>
    <CardDismissal>
      <Deletion
        deletionHandler={() => {
          $remove.mutate()
        }}
      />
    </CardDismissal>
    <Alert errorMessage={errorMessage} dismiss={() => (apiError = undefined)} />
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
