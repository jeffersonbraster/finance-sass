import { insertCategoriesSchema } from "@/db/schema";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import UseConfirm from "@/hooks/use-confirm";
import CategoryForm from "./category-form";
import { useGetCategory } from "../api/use-get-category";
import { useOpenCategory } from "../hooks/use-open-category";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";


const formSchema = insertCategoriesSchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();

  const [ConfirmDialog, confirm] = UseConfirm(
    "Você tem certeza?",
    "Você irá deletar essa categoria permanentemente"
  )

  const categoryQuery = useGetCategory(id);
  const editMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id)

  const isPending = editMutation.isPending || deleteMutation.isPending
  const isLoading = categoryQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => onClose(),
    });
  };

  const onDelete = async () => {
    const ok = await confirm()

    if(ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose()
        }
      })
    }
  }

  const defaultValues = categoryQuery.data
    ? {
        name: categoryQuery.data.name,
      }
    : {
        name: "",
      };

  return (
    <>
    <ConfirmDialog />
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Editar categoria</SheetTitle>
          <SheetDescription>
            Edite uma categoria existente, para organizar suas transações
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <CategoryForm
            id={id}
            onSubmit={onSubmit}
            disabled={isPending}
            defaultValues={defaultValues}
            onDelete={onDelete}
          />
        )}
      </SheetContent>
    </Sheet>
    </>
  );
};

export default EditCategorySheet;
