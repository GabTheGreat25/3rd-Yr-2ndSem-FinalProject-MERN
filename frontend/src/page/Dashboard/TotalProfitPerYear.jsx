import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useGetTransactionsQuery } from "@/state/api/reducer";
import { ERROR } from "@/constants";
import { PacmanLoader } from "react-spinners";

export default function () {
  const { data, isLoading, isError } = useGetTransactionsQuery();

  const transactionsWithTotalSales =
    data?.details?.map((transaction) => {
      const totalSales = transaction.cameras.reduce((acc, camera) => {
        return acc + camera.price;
      }, 0);
      return { ...transaction, totalSales };
    }) || [];

  const groupedData = transactionsWithTotalSales.reduce((acc, transaction) => {
    const year = new Date(transaction.date).getFullYear();
    const sales = transaction.totalSales || 0;

    acc[year] = (acc[year] || 0) + sales;
    return acc;
  }, {});

  const chartData = Object.entries(groupedData)?.map(([year, sales]) => ({
    year,
    sales,
  }));

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_TRANSACTIONS_ERROR}</div>
      ) : groupedData.length === 0 || !data.success ? null : (
        <>
          <LineChart
            width={600}
            height={400}
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => ["$" + value, "Total Sales"]}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ strokeWidth: 0 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </>
      )}
    </>
  );
}
