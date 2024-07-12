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

type PricesArray = {
  price: number | null | undefined;
}[];

const getDaysArray = function (start: Date, end: Date) {
  const arr = [];
  for (
    const dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
};

export function HistoricalPriceChart({ data }: PriceHistoryProps) {
  const { resolvedTheme } = useTheme();
  const [hydrated, setHydrated] = useState(false);

  function getPricesDates() {
    const daysBetween = [];
    const pricesArray = [] as PricesArray;
    for (let i = 1; i < data.length; i++) {
      const left = data[i - 1]?.valid_from;
      const right = data[i]?.valid_from;
      if (left != null && right != null) {
        daysBetween.push({ dates: getDaysArray(left, right) });
      }
    }
    data.map((price) => {
      pricesArray.push({ price: price.discount_price });
    });
    // get today date, calculate diff and push to array
    const lastDate = data[data.length - 1]?.valid_from;
    if (lastDate != null && lastDate != undefined) {
      daysBetween.push({
        dates: getDaysArray(lastDate, new Date()),
      });
    }
    const dataFormated = [];
    for (let i = 0; i < daysBetween.length; i++) {
      const days = daysBetween[i]?.dates;
      if (days != undefined) {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let j = 0; j < days.length; j++) {
          dataFormated.push({
            date: days[j],
            price: pricesArray[i]?.price,
          });
        }
      }
    }
    return dataFormated;
  }

  useEffect(() => {
    // this forces a rerender
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // this returns null on first render, so the client and server match
    return null;
  }

  if (resolvedTheme === "dark") {
    const dataFormated = getPricesDates();
    return (
      <ResponsiveContainer width="100%" minHeight={300}>
        <LineChart
          data={dataFormated}
          // data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            fill="#0f172a"
            vertical={false}
            opacity={0.7}
          />
          <XAxis
            dataKey="date"
            // dataKey="valid_from"
            tickFormatter={(dateTick) => dateFormatter(dateTick as Date)}
            name="Date"
            type="category"
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
            dataKey="price"
            // dataKey="discount_price"
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
    const dataFormated = getPricesDates();
    return (
      <ResponsiveContainer width="100%" minHeight={300}>
        <LineChart
          // data={data}
          data={dataFormated}
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
            // dataKey="valid_from"
            dataKey="date"
            tickFormatter={(dateTick) => dateFormatter(dateTick as Date)}
            name="Date"
            type="category"
            axisLine={false}
            interval={10}
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
            // dataKey="discount_price"
            dataKey="price"
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
