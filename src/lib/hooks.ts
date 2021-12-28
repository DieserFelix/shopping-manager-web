import {
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@sveltestack/svelte-query"
import {
  ApiError,
  Article,
  ArticlePagination,
  authFetch,
  authToken,
  getArticlesApiRoute,
  getListItemsApiRoute,
  getListsApiRoute,
  ListPagination,
  ListsPagination,
  PaginationParams,
  ShoppingList,
  ShoppingListItem,
} from "."

export function useOutsideClick<T extends HTMLElement>(
  onClickOutside: () => void,
) {
  return (element: T) => {
    function onClick(event: MouseEvent) {
      if (!element.contains(event.target as Node)) {
        onClickOutside()
      }
    }
    document.body.addEventListener("click", onClick)
    return {
      destroy() {
        document.body.removeEventListener("click", onClick)
      },
    }
  }
}

export function useCreate<
  TData,
  TParam = Partial<TData>,
  TError = ApiError,
>(params: {
  url: string
  successHandler?: (data: TData) => void
  errorHandler?: (error: TError) => void
}) {
  const { url, successHandler, errorHandler } = params

  let token: string = ""
  authToken.subscribe((value) => (token = value))

  return useMutation<TData, TError, TParam>(
    (params) =>
      authFetch<TData>({
        url: url,
        method: "POST",
        token: token,
        body: params,
      }),
    {
      onSuccess: successHandler,
      onError: errorHandler,
    },
  )
}

export function useArticleCreate(params: {
  setArticle?: (article: Partial<Article>) => void
  setError?: (error?: ApiError) => void
}) {
  const setArticle = params.setArticle ?? (() => {})
  const setError = params.setError ?? (() => {})

  const queryClient = useQueryClient()

  return useCreate<Article>({
    url: getArticlesApiRoute({}),
    successHandler: () => {
      setError(undefined)
      setArticle({
        id: undefined,
        name: "",
        detail: "",
        store: "",
        category: "",
        brand: "",
        price: { price: 0, currency: "EUR" },
      })
      queryClient.refetchQueries("articles")
    },
    errorHandler: (error) => setError(error),
  })
}

export function useListCreate(params: {
  setList?: (list: Partial<ShoppingList>) => void
  setError?: (error?: ApiError) => void
}) {
  const setList = params.setList ?? (() => {})
  const setError = params.setError ?? (() => {})

  const queryClient = useQueryClient()

  return useCreate<ShoppingList>({
    url: getListsApiRoute({}),
    successHandler: () => {
      setError(undefined)
      setList({
        id: undefined,
        title: "",
        finalized: false,
      })
      queryClient.refetchQueries("lists")
    },
    errorHandler: (error) => setError(error),
  })
}

export function useListItemCreate(params: {
  list: ShoppingList
  setItem?: (item: Partial<ShoppingListItem>) => void
  setError?: (error?: ApiError) => void
}) {
  const { list } = params
  const listId = list.id
  const setItem = params.setItem ?? (() => {})
  const setError = params.setError ?? (() => {})

  const queryClient = useQueryClient()

  return useCreate<ShoppingListItem>({
    url: getListItemsApiRoute({ listId: listId }),
    successHandler: () => {
      setError(undefined)
      setItem({
        id: undefined,
        article_id: -1,
        amount: 1,
        price: { price: undefined, currency: "" },
      })
      queryClient.refetchQueries("lists")
      queryClient.refetchQueries("listItems")
      queryClient.refetchQueries(["list", listId])
    },
    errorHandler: (error) => setError(error),
  })
}

export function useUpdate<TData, TParam, TError = ApiError>(params: {
  url: string
  id: number
  successHandler?: (data: TData) => void
  errorHandler?: (error: TError) => void
}) {
  const { url, id, successHandler, errorHandler } = params

  let token: string = ""
  authToken.subscribe((value) => (token = value))

  return useMutation<TData, TError, TParam>(
    (params) =>
      authFetch<TData>({
        url: url,
        method: "PUT",
        token: token,
        body: {
          id: id,
          ...params,
        },
      }),
    {
      onSuccess: successHandler,
      onError: errorHandler,
    },
  )
}

export function useArticleUpdate(params: {
  article: Article
  setError?: (error?: ApiError) => void
}) {
  const { article } = params
  const articleId = article.id
  const setError = params.setError ?? (() => {})

  const queryClient = useQueryClient()

  return useUpdate<Article, Partial<Omit<Article, "id">>>({
    url: getArticlesApiRoute({}),
    id: articleId,
    successHandler: () => {
      setError(undefined)
      queryClient.refetchQueries("articles")
      queryClient.refetchQueries(["article", articleId])
      queryClient.refetchQueries(["prices", articleId])
    },
    errorHandler: (error) => {
      setError(error)
    },
  })
}

export function useListUpdate(params: {
  list?: ShoppingList
  listId?: number
  setError?: (error?: ApiError) => void
}) {
  const listId = params.listId ?? params.list.id
  const setError = params.setError ?? (() => {})

  const queryClient = useQueryClient()

  return useUpdate<ShoppingList, Partial<Omit<ShoppingList, "id">>>({
    url: getListsApiRoute({}),
    id: listId,
    successHandler: () => {
      setError(undefined)
      queryClient.refetchQueries(["list", listId])
      queryClient.refetchQueries("lists")
    },
    errorHandler: (error) => {
      setError(error)
    },
  })
}

export function useListItemUpdate(params: {
  item: ShoppingListItem
  setError?: (error?: ApiError) => void
}) {
  const { item } = params
  const listId = item.list_id
  const itemId = item.id
  const setError = params.setError ?? (() => {})

  const queryClient = useQueryClient()

  return useUpdate<ShoppingListItem, Partial<Omit<ShoppingListItem, "id">>>({
    url: getListItemsApiRoute({ listId: listId }),
    id: itemId,
    successHandler: () => {
      setError(undefined)
      queryClient.refetchQueries(["list", listId])
      queryClient.refetchQueries("listItems")
    },
    errorHandler: (error) => {
      setError(error)
    },
  })
}

export function useDelete<TError>(params: {
  url: string
  successHandler?: () => void
  errorHandler?: (error: TError) => void
}) {
  const { url, successHandler, errorHandler } = params

  let token: string = ""
  authToken.subscribe((value) => (token = value))

  return useMutation<void, TError>(
    () =>
      authFetch<void>({
        url: url,
        method: "DELETE",
        token: token,
      }),
    {
      onSuccess: successHandler,
      onError: errorHandler,
    },
  )
}

export function useArticleDelete(params: {
  article: Article
  setError?: (error?: ApiError) => void
}) {
  const { article } = params
  const articleId = article.id
  const setError = params.setError ?? (() => {})

  const queryClient = useQueryClient()

  return useDelete<ApiError>({
    url: getArticlesApiRoute({ id: articleId }),
    successHandler: () => {
      queryClient.refetchQueries("articles")
    },
    errorHandler: (error) => {
      setError(error)
    },
  })
}

export function useListDelete(params: {
  list: ShoppingList
  setError?: (error?: ApiError) => void
}) {
  const { list } = params
  const listId = list.id
  const setError = params.setError ?? (() => {})

  const queryClient = useQueryClient()

  return useDelete<ApiError>({
    url: getListsApiRoute({ id: listId }),
    successHandler: () => {
      queryClient.refetchQueries("lists")
    },
    errorHandler: (error) => {
      setError(error)
    },
  })
}

export function useListItemDelete(params: {
  item: ShoppingListItem
  setError?: (error?: ApiError) => void
}) {
  const { item } = params
  const listId = item.list_id
  const itemId = item.id
  const setError = params.setError ?? (() => {})

  const queryClient = useQueryClient()

  return useDelete<ApiError>({
    url: getListItemsApiRoute({ listId: listId, id: itemId }),
    successHandler: () => {
      queryClient.refetchQueries("lists")
      queryClient.refetchQueries("listItems")
      queryClient.refetchQueries(["list", listId])
    },
    errorHandler: (error) => {
      setError(error)
    },
  })
}

export function usePaginatedQuery<TData, TError = ApiError>(params: {
  key: string
  urlFn: (params: { pagination: PaginationParams }) => string
  pagination: PaginationParams
  enabled?: boolean
}) {
  const { key, urlFn, pagination, enabled } = params
  const { filter, sortBy, asc, page, limit } = pagination

  let token: string = ""
  authToken.subscribe((value) => (token = value))

  return useInfiniteQuery<TData[], TError>({
    queryKey: [key, filter, sortBy, asc],
    queryFn: ({ pageParam = page }) => {
      return authFetch<TData[]>({
        url: urlFn({
          pagination: {
            filter: filter,
            sortBy: sortBy,
            limit: limit,
            asc: asc,
            page: pageParam,
          },
        }),
        method: "GET",
        token: token,
      })
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length == limit) {
        return allPages.length + 1
      }
      return undefined
    },
    enabled: enabled,
  })
}

export function useRead<TData, TQueryKey extends QueryKey>(params: {
  key: TQueryKey
  urlFn: (k: TQueryKey) => string
  enabled?: boolean
}) {
  const { key, urlFn, enabled } = params

  let token: string = ""
  authToken.subscribe((value) => (token = value))

  return useQuery<TData, ApiError, TData, TQueryKey>(
    key,
    (p) => {
      return authFetch({
        url: urlFn(p.queryKey),
        method: "GET",
        token: token,
      })
    },
    { enabled: enabled },
  )
}

export function useArticle(params: { articleId: number }) {
  const { articleId } = params

  return useRead<Article, [string, number]>({
    key: ["article", articleId],
    urlFn: (k) => getArticlesApiRoute({ id: k[1] }),
  })
}

export function useList(params: { listId: number }) {
  const { listId } = params

  return useRead<ShoppingList, [string, number]>({
    key: ["list", listId],
    urlFn: (k) => getListsApiRoute({ id: k[1] }),
  })
}

export function useListExport(params: { listId: number }) {
  const { listId } = params

  return useRead<string, [string, number]>({
    key: ["markdown", listId],
    urlFn: (k) => `${getListsApiRoute({ id: k[1] })}/markdown`,
    enabled: false,
  })
}

export function useListItem(params: { listId: number; itemId: number }) {
  const { listId, itemId } = params

  return useRead<ShoppingListItem, [string, number]>({
    key: ["listItem", itemId],
    urlFn: (k) => getListItemsApiRoute({ listId: listId, id: k[1] }),
  })
}

function serializePagination(
  page: string,
  pagination: Required<PaginationParams>,
) {
  sessionStorage.setItem(page, JSON.stringify(pagination))
}

export function usePagination(page: string, fallback: PaginationParams) {
  const serializedPagination = sessionStorage.getItem(page)
  if (!serializedPagination) {
    return {
      ...fallback,
      serializePagination: (pagination: Required<PaginationParams>) =>
        serializePagination(page, pagination),
    }
  } else {
    const pagination: Required<PaginationParams> =
      JSON.parse(serializedPagination)
    return {
      ...pagination,
      serializePagination: (pagination: Required<PaginationParams>) =>
        serializePagination(page, pagination),
    }
  }
}

export function useArticlePagination() {
  return usePagination("articlePagination", ArticlePagination)
}

export function useListsPagination() {
  return usePagination("listsPagination", ListsPagination)
}

export function useListPagination(listId: number) {
  return usePagination(`listPagination-${listId}`, ListPagination)
}
