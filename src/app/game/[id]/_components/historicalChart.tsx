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
import { dateFormatter, dateFormatterLong, formatCurrency } from "~/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
  const { resolvedTheme } = useTheme();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // this forces a rerender
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // this returns null on first render, so the client and server match
    return null;
  }

  if (resolvedTheme === "dark") {
    return (
      <ResponsiveContainer width="100%" minHeight={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            fill="#0f172a"
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
            labelFormatter={(date) => dateFormatterLong(date as Date)}
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
  if (resolvedTheme === "light") {
    return (
      <ResponsiveContainer width="100%" minHeight={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            fill="#cccccc"
            vertical={false}
            stroke="#525558"
            opacity={0.7}
          />
          <XAxis
            dataKey="valid_from"
            tickFormatter={(dateTick) => dateFormatter(dateTick as Date)}
            name="Date"
            axisLine={false}
            tick={{ fill: "#525558" }}
            tickMargin={10}
          />
          <YAxis
            tickFormatter={(tick) => formatCurrency(tick as number)}
            name="Price"
            axisLine={false}
            tick={{ fill: "#525558" }}
          />
          <Tooltip
            formatter={(value) => formatCurrency(value as number)}
            labelFormatter={(date) => dateFormatterLong(date as Date)}
            contentStyle={{
              backgroundColor: "white",
              color: "black",
            }}
            cursor={{ stroke: "#525558" }}
          />
          <Line
            dataKey="discount_price"
            type="step"
            dot={false}
            name="Price"
            stroke="#0e7490"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
