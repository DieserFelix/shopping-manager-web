<script lang="ts">
  import {
    ApiError,
    Article,
    ButtonContexts,
    ButtonTypes,
    IconNames,
    useArticleCreate,
  } from "../../lib"
  import { Button } from "../action"
  import { Card, CardBody, CardFooter } from "../card"
  import { Icon } from "../content"
  import ArticleEditor from "./ArticleEditor.svelte"

  let article: Partial<Article> = {
    id: undefined,
    name: "",
    detail: "",
    store: "",
    category: "",
    brand: "",
    price: { price: 0, currency: "EUR" },
  }

  let apiError: ApiError

  const create = useArticleCreate({
    setArticle: (a) => (article = a),
    setError: (error) => (apiError = error),
  })

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
      <Icon>{IconNames.saveAlt}</Icon>
    </Button>
  </CardFooter>
</Card>
