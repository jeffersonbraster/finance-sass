import { toast } from 'sonner'
import { InferRequestType, InferResponseType } from 'hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/hono'


type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];
type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>


export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts[":id"]["$patch"]({
        json,
        param: { id }
      })
      return await response.json()
    },
    onSuccess: () => {
      toast.success('Conta editada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['account', { id }] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: () => {
      toast.error('Erro ao editar conta')
    }
  })

  return mutation
}