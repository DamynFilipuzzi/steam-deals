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

// const d = [
//   { valid_from: new Date("2024-01-20T06:24:11.566Z"), discount_price: 1999 },
//   { valid_from: new Date("2024-02-20T06:24:11.566Z"), discount_price: 7999 },
//   { valid_from: new Date("2024-03-20T06:24:11.566Z"), discount_price: 4999 },
//   { valid_from: new Date("2024-04-20T06:24:11.566Z"), discount_price: 5999 },
//   { valid_from: new Date("2024-05-20T06:24:11.566Z"), discount_price: 2999 },
//   { valid_from: new Date("2024-06-20T06:24:11.566Z"), discount_price: 3999 },
//   { valid_from: new Date("2024-07-20T06:24:11.566Z"), discount_price: 5999 },
//   { valid_from: new Date("2024-08-20T06:24:11.566Z"), discount_price: 2999 },
//   { valid_from: new Date("2024-09-20T06:24:11.566Z"), discount_price: 1999 },
//   { valid_from: new Date("2024-10-20T06:24:11.566Z"), discount_price: null },
//   { valid_from: new Date("2024-11-20T06:24:11.566Z"), discount_price: 2999 },
//   { valid_from: new Date("2024-12-20T06:24:11.566Z"), discount_price: 3999 },
// ];

type PriceHistoryProps = {
  data: {
    id: number;
    steam_id: number;
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
