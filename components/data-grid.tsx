"use client";

import { useSearchParams } from "next/navigation";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import DataCard, { DataCardLoading } from "./data-card";
import { formatDateRange } from "@/lib/utils";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const DataGrid = () => {
  const { data, isLoading } = useGetSummary();

  const params = useSearchParams();
  const to = params.get("to") || "";
  const from = params.get("from") || "";

  const dateRangeLabel = formatDateRange({ to, from });

  if(isLoading) {
    return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCardLoading />
      <DataCardLoading />
      <DataCardLoading />
    </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard
        title="Restante"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        variant="default"
        dateRange={dateRangeLabel}
      />

      <DataCard
        title="Renda"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        variant="default"
        dateRange={dateRangeLabel}
      />

      <DataCard
        title="Despesas"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        variant="default"
        dateRange={dateRangeLabel}
      />
    </div>
  );
};

export default DataGrid;
