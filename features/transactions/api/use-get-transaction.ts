import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono"

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transaction", {id}],
    queryFn: async () => {
      const response = await client.api.transactions[":id"].$get({
        param: {id}
      })

      if (!response.ok) {
        throw new Error("Falha ao buscar transação")
      }

      const { data } = await response.json()
      return data
    }
  })

  return query
}