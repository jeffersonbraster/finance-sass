import { useOpenCategory } from "@/features/categories/hooks/use-open-category"
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction"
import { cn } from "@/lib/utils"
import { TriangleAlert } from "lucide-react"


type Props = {
  id: string
  category: string | null
  categoryId: string | null
}

const CategoryColumns = ({id, category, categoryId}: Props) => {
  const {onOpen: onOpenAccount} = useOpenCategory()
  const {onOpen: onOpenTransaction} = useOpenTransaction()

  const handleOpenAccount = () => {
    if(categoryId) {
      onOpenAccount(categoryId)
    }else {
      onOpenTransaction(id)
    }
  }

  return (
    <div className={cn("flex items-center cursor-pointer hover:underline", !category && "text-rose-500")} onClick={handleOpenAccount}>
      {!category && <TriangleAlert className="mr-2 size-4 shrink-0" />}
      {category || "Sem categoria"}
    </div>
  )
}

export default CategoryColumns