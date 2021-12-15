<script lang="ts">
  import { Route, Router } from "svelte-navigator"
  import Landing from "./Landing.svelte"
</script>

<Router>
  <Route path="/">
    <Landing />
  </Route>
  <Route path="/dashboard">
    <h1>JA MOIN</h1>
  </Route>
</Router>
