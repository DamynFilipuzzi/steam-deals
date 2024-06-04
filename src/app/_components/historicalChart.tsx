"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dateFormatter, formatCurrency } from "~/lib/utils";

type PriceHistoryProps = {
  data: {
    id: number;
    steam_id: number;
    is_free: boolean | null;
    currency: string | null;
    original_price: number | null;
    discount_price: number | null;
    valid_from: Date;
    valid_to: Date;
  }[];
};

export function HistoricalPriceChart({ data }: PriceHistoryProps) {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          fill="#020817"
          vertical={false}
          opacity={0.7}
        />
        <XAxis
          dataKey="valid_from"
          tickFormatter={(dateTick) => dateFormatter(dateTick as Date)}
          name="Date"
          axisLine={false}
          tick={{ fill: "#94a3b8" }}
          tickMargin={10}
        />
        <YAxis
          tickFormatter={(tick) => formatCurrency(tick as number)}
          name="Price"
          axisLine={false}
          tick={{ fill: "#94a3b8" }}
        />
        <Tooltip
          formatter={(value) => formatCurrency(value as number)}
          labelFormatter={(date) => dateFormatter(date as Date)}
          contentStyle={{ backgroundColor: "black" }}
        />
        <Line
          dataKey="discount_price"
          type="step"
          dot={false}
          name="Price"
          stroke="#06b6d4"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
