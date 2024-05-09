import { insertAccountsSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateAccount } from "../api/use-create-account";
import { useNewAccount } from "../hooks/use-new-account";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AccountForm from "./account-form";


const formSchema = insertAccountsSchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

const NewAccountSheet = () => {
  const {isOpen, onClose} = useNewAccount()

  const mutation = useCreateAccount()

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => onClose()
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Nova conta</SheetTitle>
          <SheetDescription>
            Adicione uma nova conta para começar a rastrear suas finanças.
          </SheetDescription>
        </SheetHeader>

        <AccountForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{name: ""}} />
      </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;
