<script lang="ts">
  import { useQuery } from "@sveltestack/svelte-query"
  import type { ChartData, ChartOptions } from "chart.js"
  import Line from "svelte-chartjs/src/Line.svelte"
  import {
    ApiError,
    Article,
    authFetch,
    authToken,
    ButtonContexts,
    ButtonTypes,
    getPricesApiRoute,
    IconNames,
    Price,
  } from "../../lib"
  import { Button } from "../action"
  import { Icon, Spinner } from "../content"

  export let article: Article

  let token: string = ""
  authToken.subscribe((value) => (token = value))

  let apiError: ApiError
  const query = useQuery<Price[], ApiError>(
    ["prices", article.id],
    () =>
      authFetch<Price[]>({
        url: getPricesApiRoute(article.id),
        method: "GET",
        token: token,
      }),
    { onError: (error) => (apiError = error) },
  )

  let history: ChartData<"line">
  $: {
    if (!$query.isLoading) {
      history = {
        labels: $query.data.map((price) => {
          const date = new Date(price.valid_at)
          return `${date.toLocaleDateString()}`
        }),
        datasets: [
          {
            fill: true,
            backgroundColor: "rgba(210, 100, 20, 0.3)",
            borderColor: "rgb(210, 100, 20)",
            pointBorderColor: "rgb(20, 25, 55);",
            pointBackgroundColor: "rgb(40, 60, 115)",
            pointBorderWidth: 2,
            data: $query.data.map((price) => price.price),
          },
        ],
      }
    }
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  let displayHistory: boolean = false
</script>

{#if $query.isLoading}
  <Spinner size="25px" />
{:else if displayHistory}
  <div style={`height: ${displayHistory ? "150px" : "40px"}`}>
    <Line data={history} options={options} />
  </div>
{/if}
<Button
  type={ButtonTypes.BUTTON}
  context={ButtonContexts.TRANSPARENT}
  action={() => (displayHistory = !displayHistory)}
>
  <Icon>
    {displayHistory ? IconNames.expandLess : IconNames.expandMore}
  </Icon>
</Button>

<style>
  div {
    width: 100%;
  }
</style>
