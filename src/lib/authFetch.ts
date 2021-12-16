export async function authFetch(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body: { [key: string]: any },
  token: string,
) {
  const response = await fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}
