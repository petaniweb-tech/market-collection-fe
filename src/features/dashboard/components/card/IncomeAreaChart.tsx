/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Sample data - replace with your actual data
const data = [
  { date: "Senin", income: 4000000 },
  { date: "Selasa", income: 3000000 },
  { date: "Rabu", income: 2000000 },
  { date: "Kamis", income: 2780000 },
  { date: "Jumat", income: 1890000 },
  { date: "Sabtu", income: 2390000 },
  { date: "Minggu", income: 3490000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 border rounded-lg shadow-sm bg-background">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(payload[0].value)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function IncomeAreaChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ED3400" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ED3400" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-muted"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            className="text-sm text-muted-foreground"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            className="text-sm text-muted-foreground"
            tickFormatter={(value) =>
              new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
                .format(value)
                .replace("Rp", "")
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#FF4B26"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorIncome)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
