<script lang="ts">
  import { Route, Router } from "svelte-navigator"
  import PrivateRoute from "./components/route/PrivateRoute.svelte"
  import Landing from "./Landing.svelte"
  import ListView from "./ListView.svelte"
</script>

<Router>
  <Route path="/">
    <Landing />
  </Route>
  <Route path="/dashboard">
    <PrivateRoute>
      <ListView />
    </PrivateRoute>
  </Route>
</Router>
