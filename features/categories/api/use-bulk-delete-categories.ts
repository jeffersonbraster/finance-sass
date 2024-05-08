import { toast } from 'sonner'
import { InferRequestType, InferResponseType } from 'hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/hono'


type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];
type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>


export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories["bulk-delete"]["$post"]({json})
      return await response.json()
    },
    onSuccess: () => {
      toast.success('Categoria(s) deletada(s) com sucesso')
      queryClient.invalidateQueries({queryKey: ['categories']})
    },
    onError: () => {
      toast.error('Erro ao deletar categoria(s)')
    }
  })

  return mutation
}