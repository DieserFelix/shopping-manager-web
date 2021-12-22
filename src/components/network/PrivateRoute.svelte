<script lang="ts">
  import jwt_decode, { JwtPayload } from "jwt-decode"
  import { navigate } from "svelte-navigator"
  import { authToken } from "../../lib"

  let token: string = ""
  authToken.subscribe((value) => (token = value))
  authToken.set(localStorage.getItem("authToken"))

  $: {
    if (token) {
      const decoded_token = jwt_decode<JwtPayload>(token)
      const expires_at = new Date(decoded_token.exp * 1000)
      if (expires_at.valueOf() <= new Date().valueOf()) {
        navigate("/")
      }
      authToken.set(token)
    } else {
      navigate("/")
    }
  }
</script>

{#if token}
  <slot />
{/if}
