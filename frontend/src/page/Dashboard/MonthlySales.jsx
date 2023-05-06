import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetTransactionsQuery } from "@/state/api/reducer";
import { ERROR } from "@/constants";
import { PacmanLoader } from "react-spinners";

export default function MonthlySalesChart() {
  const { data, isLoading, isError } = useGetTransactionsQuery();

  const monthNames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const groupedData = data?.details
    ? data.details.reduce((acc, transaction) => {
        const month = new Date(transaction?.date).getMonth();

        const totalCost = transaction.cameras.reduce(
          (sum, camera) => sum + camera.price,
          0
        );

        acc[month] = (acc[month] || 0) + totalCost;
        return acc;
      }, {})
    : {};

  const chartData = monthNames?.map((monthName, index) => ({
    month: monthName,
    sales: groupedData[index] || 0,
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
          <AreaChart data={chartData} width={1200} height={400}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#33B2DF" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#33B2DF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#33B2DF"
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </AreaChart>
        </>
      )}
    </>
  );
}
