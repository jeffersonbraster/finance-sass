import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import TableHeadSelect from "./table-head-select";

type Props = {
  header: string[];
  body: string[][];
  selectedColumns: Record<string, string | null>;
  onTableHeadSelectedChange: (
    columnIndex: number,
    value: string | null
  ) => void;
};

const ImportTable = ({
  header,
  body,
  selectedColumns,
  onTableHeadSelectedChange,
}: Props) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            {header.map((_item, index) => (
              <TableHead key={index}>
                <TableHeadSelect columnIndex={index} selectedColumns={selectedColumns} onChange={onTableHeadSelectedChange} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {body.map((row: string[], index) => (
            <TableRow key={index}>
              {row.map((cell, index) => (
                <TableCell key={index}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ImportTable;
