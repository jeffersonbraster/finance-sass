import { format } from "date-fns";
import {
  XAxis,
  ResponsiveContainer,
  Tooltip, 
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import CustomTooltip from './custom-tooltip'
import { ptBR } from "date-fns/locale";

type Props = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

const LineVariant = ({data}: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, "dd MMM", { locale: ptBR })}
          style={{ fontSize: "12px" }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line dot={false} dataKey="income" stroke="#3d82f6" strokeWidth={2} className="drop-shadow-sm" />
        <Line dot={false} dataKey="expenses" stroke="#f43f5e" strokeWidth={2} className="drop-shadow-sm" />
      </LineChart> 
    </ResponsiveContainer>
  )
}

export default LineVariant