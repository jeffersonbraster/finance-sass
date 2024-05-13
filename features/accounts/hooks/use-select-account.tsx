import { useRef, useState } from "react";
import { useGetAccounts } from "../api/use-get-accounts";
import { useCreateAccount } from "../api/use-create-account";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { title } from "process";
import { Select } from "@/components/select";

const UseSelectAccount = (): [() => JSX.Element, () => Promise<unknown>] => {
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();

  const onCreateAccount = (name: string) => accountMutation.mutate({ name });

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);

  const selectValue = useRef<string>();

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleCancel}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecione a conta</DialogTitle>
          <DialogDescription>
            Porfavor, selecione uma conta para continuar.
          </DialogDescription>
        </DialogHeader>
        <Select
          placeholder="Selecione uma conta"
          options={accountOptions}
          onCreate={onCreateAccount}
          onChange={(value) => (selectValue.current = value)}
          disabled={accountQuery.isLoading || accountMutation.isPending}
        />
        <DialogFooter className="pt-2">
          <Button variant={"outline"} onClick={handleCancel}>
            Cancelar
          </Button>

          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};

export default UseSelectAccount;
