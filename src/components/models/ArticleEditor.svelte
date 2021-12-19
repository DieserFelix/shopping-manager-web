<script lang="ts">
  import { Article, getCategoriesApiRoute, getStoresApiRoute } from "../../lib"
  import { Deletion } from "../action"
  import { CardDismissal, Subtitle, Title } from "../card"
  import { PropEdit } from "../form"
  import { Alert } from "../network"

  export let mode: "CREATE" | "UPDATE" = "UPDATE"
  export let article: Partial<Article>
  export let editHandler: (
    props: Partial<Omit<Article, "id">>,
    onSuccess: () => void,
  ) => void
  export let removalHandler: () => void = undefined
  export let alertHandler: () => void
  export let errorMessage: string

  let permaEdit = mode == "CREATE"
</script>

<CardDismissal>
  {#if removalHandler}
    <Deletion deletionHandler={removalHandler} />
  {/if}
</CardDismissal>
<Alert errorMessage={errorMessage} dismiss={alertHandler} />
<Title>
  <PropEdit
    label={article.name}
    editHandler={(name, onSuccess) => editHandler({ name: name }, onSuccess)}
    permaEdit={permaEdit}
  />
</Title>
<PropEdit
  label={article.detail}
  editHandler={(detail, onSuccess) =>
    editHandler({ detail: detail }, onSuccess)}
  permaEdit={permaEdit}
/>
<table>
  <tr>
    <td>
      <Subtitle>Store</Subtitle>
      <PropEdit
        label={`${article.store}`}
        editHandler={(store, onSuccess) =>
          editHandler(
            {
              store: store,
            },
            onSuccess,
          )}
        permaEdit={permaEdit}
        autoComplete={{ queryKey: "stores", queryString: getStoresApiRoute }}
      />
    </td>
    <td>
      <Subtitle>Category</Subtitle>
      <PropEdit
        label={`${article.category}`}
        editHandler={(category, onSuccess) =>
          editHandler(
            {
              category: category,
            },
            onSuccess,
          )}
        permaEdit={permaEdit}
        autoComplete={{
          queryKey: "categories",
          queryString: getCategoriesApiRoute,
        }}
      />
    </td>
    <td>
      <Subtitle>Price ({article.price.currency})</Subtitle>
      <PropEdit
        label={`${article.price.price}`}
        editHandler={(price, onSuccess) =>
          editHandler(
            {
              price: {
                price: parseFloat(price),
                currency: article.price.currency,
              },
            },
            onSuccess,
          )}
        permaEdit={permaEdit}
      />
    </td>
  </tr>
</table>

<style>
  table {
    width: 100%;
  }

  td {
    width: 30%;
    margin: 5px;
  }
</style>
