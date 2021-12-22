<script lang="ts">
  import { useMutation } from "@sveltestack/svelte-query"
  import jwt_decode, { JwtPayload } from "jwt-decode"
  import { Icon } from "."
  import {
    ApiError,
    authFetch,
    authToken,
    ButtonContexts,
    ButtonTypes,
    errorMessage,
    FetchParams,
    getLogoutApiRoute,
    IconNames,
  } from "../../lib"
  import { Button } from "../action"

  $: username = jwt_decode<JwtPayload>($authToken).sub

  const mutation = useMutation<void, ApiError, FetchParams>(
    (params) => authFetch<void>(params),
    {
      onSuccess: () => {
        localStorage.removeItem("authToken")
        authToken.set("")
      },
      onError: (error) => {
        errorMessage.set(error.message)
      },
    },
  )

  const logout = () => {
    $mutation.mutate({
      url: getLogoutApiRoute(),
      method: "POST",
      token: $authToken,
    })
  }
</script>

<Button
  type={ButtonTypes.BUTTON}
  context={ButtonContexts.NEUTRAL}
  action={() => logout()}
>
  <Icon>{IconNames.logout}</Icon>
</Button>
{username}
