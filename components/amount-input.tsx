import CurrencyInput from "react-currency-input-field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { Info, MinusCircle, PlusCircle } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

const AmountInput = ({ value, onChange, placeholder, disabled }: Props) => {
  const parsedValue = parseFloat(value);
  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;

  const onReverseValue = () => {
    if (!value) return;

    onChange((parseFloat(value) * -1).toString());
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onReverseValue}
              className={cn(
                "bg-slate-400 hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition",
                isIncome && "bg-emerald-500 hover:bg-emerald-600",
                isExpense && "bg-rose-500 hover:bg-rose-600",
              )}
            >
              {!parsedValue && <Info className="size-3 text-white" />}
              {isIncome && <PlusCircle className="size-3 text-white" />}
              {isExpense && <MinusCircle className="size-3 text-white" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Use [+] para adicionar um valor de entrada e [-] para adicionar um
            valor de saída.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CurrencyInput
        intlConfig={{ locale: "pt-BR", currency: "BRL"}}
        className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        inputMode="decimal"
      />
      <p className="text-xs text-muted-foreground mt-2">
        {isIncome && ("Valor de entrada")}
        {isExpense && ("Valor de saída")}
      </p>
    </div>
  );
};

export default AmountInput;
