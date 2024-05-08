import { insertCategoriesSchema } from "@/db/schema";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CategoryForm from "./category-form";
import { useNewCategory } from "../hooks/use-new-category";
import { useCreateCategory } from "../api/use-create-category";


const formSchema = insertCategoriesSchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

const NewCategorySheet = () => {
  const {isOpen, onClose} = useNewCategory()

  const mutation = useCreateCategory()

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => onClose()
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Nova categoria</SheetTitle>
          <SheetDescription>
            Adicione uma nova categoria para organizar suas transações
          </SheetDescription>
        </SheetHeader>

        <CategoryForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{name: ""}} />
      </SheetContent>
    </Sheet>
  );
};

export default NewCategorySheet;
