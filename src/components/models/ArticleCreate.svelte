<script lang="ts">
  import { useMutation, useQueryClient } from "@sveltestack/svelte-query"
  import {
    ApiError,
    Article,
    authFetch,
    authToken,
    ButtonContexts,
    ButtonTypes,
    getArticlesApiRoute,
    IconNames,
  } from "../../lib"
  import { Button } from "../action"
  import { Card, CardBody, CardFooter } from "../card"
  import { Icon } from "../content"
  import ArticleEditor from "./ArticleEditor.svelte"

  export let successHandler: () => void

  let article: Partial<Article> = {
    id: undefined,
    name: "",
    detail: "",
    store: "",
    category: "",
    brand: "",
    price: { price: 0, currency: "EUR" },
  }

  const queryClient = useQueryClient()

  const create = useMutation<Article, ApiError, Partial<Article>>(
    (params) =>
      authFetch<Article>({
        url: getArticlesApiRoute({}),
        method: "POST",
        token: $authToken,
        body: params,
      }),
    {
      onSuccess: () => {
        apiError = undefined
        article = {
          id: undefined,
          name: "",
          detail: "",
          store: "",
          category: "",
          brand: "",
          price: { price: 0, currency: "EUR" },
        }
        successHandler()
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
      mode="CREATE"
      article={article}
      editHandler={(props) => {
        Object.entries(props).forEach(([prop, value]) => {
          article[prop] = value
        })
      }}
      alertHandler={() => (apiError = undefined)}
      errorMessage={errorMessage}
    />
  </CardBody>
  <CardFooter>
    <Button
      type={ButtonTypes.BUTTON}
      context={ButtonContexts.TRANSPARENT}
      action={() => {
        setTimeout(() => $create.mutate(article), 400)
      }}
    >
      <Icon>{IconNames.noteAdd}</Icon>
    </Button>
  </CardFooter>
</Card>
