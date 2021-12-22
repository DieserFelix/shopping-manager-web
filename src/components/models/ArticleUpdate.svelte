<script lang="ts">
  import { PriceHistory } from "."
  import {
    ApiError,
    Article,
    useArticleDelete,
    useArticleUpdate,
  } from "../../lib"
  import { Card, CardBody, CardFooter } from "../card"
  import ArticleEditor from "./ArticleEditor.svelte"

  export let article: Article
  let apiError: ApiError

  const update = useArticleUpdate({
    article: article,
    setError: (error) => (apiError = error),
  })

  const remove = useArticleDelete({
    article: article,
    setError: (error) => (apiError = error),
  })

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
