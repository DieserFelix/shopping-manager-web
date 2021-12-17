<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@sveltestack/svelte-query"
  import { Route, Router } from "svelte-navigator"
  import Articles from "./Articles.svelte"
  import PrivateRoute from "./components/network/PrivateRoute.svelte"
  import Dashboard from "./Dashboard.svelte"
  import Landing from "./Landing.svelte"
  import { Routes } from "./lib"

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
  </Router>
</QueryClientProvider>
