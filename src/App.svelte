<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@sveltestack/svelte-query"
  import { Route, Router } from "svelte-navigator"
  import Articles from "./Articles.svelte"
  import PrivateRoute from "./components/network/PrivateRoute.svelte"
  import Dashboard from "./Dashboard.svelte"
  import Landing from "./Landing.svelte"
  import { Routes } from "./lib"
  import List from "./List.svelte"
  import Lists from "./Lists.svelte"

  const queryClient = new QueryClient()
</script>

<QueryClientProvider client={queryClient}>
  <Router>
    <Route path={Routes.LOGIN}>
      <Landing />
    </Route>
    <Route path={Routes.DASHBOARD}>
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    </Route>
    <Route path={Routes.ARTICLES}>
      <PrivateRoute>
        <Articles />
      </PrivateRoute>
    </Route>
    <Route path={Routes.LISTS}>
      <PrivateRoute>
        <Lists />
      </PrivateRoute>
    </Route>
    <Route path={`${Routes.LISTS}/:id`} let:params>
      <PrivateRoute>
        <List listId={+params.id} />
      </PrivateRoute>
    </Route>
  </Router>
</QueryClientProvider>
