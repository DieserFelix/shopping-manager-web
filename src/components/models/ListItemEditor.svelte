<script lang="ts">
  import { useQuery } from "@sveltestack/svelte-query"
  import {
    ApiError,
    Article,
    authFetch,
    authToken,
    getArticlesApiRoute,
    ShoppingListItem,
  } from "../../lib"
  import { Deletion } from "../action"
  import { CardDismissal, Subtitle, Title } from "../card"
  import { PropEdit } from "../form"
  import { Alert } from "../network"

  export let mode: "CREATE" | "UPDATE" = "UPDATE"
  export let item: Partial<ShoppingListItem>
  export let editHandler: (
    props: Partial<Omit<ShoppingListItem, "id">>,
    onSuccess: () => void,
  ) => void
  export let removalHandler: () => void = undefined
  export let alertHandler: () => void
  export let errorMessage: string

  let permaEdit = mode == "CREATE"

  $: getArticle = useQuery<Article, ApiError, Article, [string, number]>(
    ["article", item.article_id],
    (p) => {
      return authFetch({
        url: getArticlesApiRoute({ id: p.queryKey[1] }),
        method: "GET",
        token: $authToken,
      })
    },
  )

  $: article = $getArticle.isLoading ? undefined : $getArticle.data
</script>

<CardDismissal>
  {#if removalHandler}
    <Deletion deletionHandler={removalHandler} />
  {/if}
</CardDismissal>
<Alert errorMessage={errorMessage} dismiss={alertHandler} />
<Title>
  <PropEdit
    label={article?.name ?? ""}
    editHandler={(article) =>
      editHandler({ article_id: article.id ?? -1 }, () => {
        if (article.id) {
          item.article_id = article.id
        }
      })}
    permaEdit={permaEdit}
    autoComplete={{
      queryKey: "articles",
      queryString: getArticlesApiRoute,
      suggestionFormatter: (suggestion) => {
        const details = [
          suggestion.store,
          suggestion.category,
          suggestion.brand,
        ]
        return `${suggestion.name}${
          suggestion.detail ? `, ${suggestion.detail} ` : ""
        } 
         @ ${details.reduce(
           (prev, detail) => `${prev}${detail ? `${detail} | ` : ""}`,
           "",
         )}
         ${suggestion.price.price} ${suggestion.price.currency}
        `
      },
    }}
  />
</Title>
{#if article}
  {#if article.detail}
    {article.detail}
  {:else}
    <br />
  {/if}
  <table>
    <tr>
      <td>
        <Subtitle>Cost</Subtitle>
      </td>
      <td>
        <Subtitle>Store</Subtitle>
      </td>
      <td>
        <Subtitle>Category</Subtitle>
      </td>
      <td>
        <Subtitle>Brand</Subtitle>
      </td>
    </tr>
    <tr>
      <td>
        <div class="priceEditor">
          <div class="propEditor">
            <PropEdit
              label={`${item.amount}`}
              editHandler={(amount, onSuccess) =>
                editHandler({ amount: parseFloat(amount.value) }, onSuccess)}
              permaEdit={permaEdit}
            />
          </div>
          &times;
          <div class="propEditor">
            <PropEdit
              label={`${item?.price?.price ?? article?.price.price}`}
              editHandler={(amount, onSuccess) =>
                editHandler(
                  {
                    price: {
                      price: parseFloat(amount.value),
                      currency: article.price.currency,
                    },
                  },
                  onSuccess,
                )}
              permaEdit={permaEdit}
            />
          </div>
          =
          {Math.round(
            (item.amount * article.price.price + Number.EPSILON) * 100,
          ) / 100}
          {article.price.currency}
        </div>
      </td>
      <td>
        {#if article.store}
          {article.store}
        {:else}
          ---
        {/if}
      </td>
      <td>
        {#if article.category}
          {article.category}
        {:else}
          ---
        {/if}
      </td>
      <td>
        {#if article.brand}
          {article.brand}
        {:else}
          ---
        {/if}
      </td>
    </tr>
  </table>
{/if}

<style>
  table {
    width: 100%;
  }

  td {
    width: 24%;
    margin: 5px;
  }

  div.priceEditor {
    display: flex;
    flex-direction: row;
  }

  div.propEditor {
    max-width: 65px;
    margin-right: 5px;
  }
</style>
