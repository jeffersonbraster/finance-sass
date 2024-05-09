import { toast } from 'sonner'
import { InferRequestType, InferResponseType } from 'hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/hono'


type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];
type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>


export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions[":id"]["$patch"]({
        json,
        param: { id }
      })
      return await response.json()
    },
    onSuccess: () => {
      toast.success('Transação editada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: () => {
      toast.error('Erro ao editar transação')
    }
  })

  return mutation
}