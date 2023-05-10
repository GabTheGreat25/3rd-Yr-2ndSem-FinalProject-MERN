import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useGetTransactionsQuery } from "@api";
import { PacmanLoader } from "react-spinners";
import { RESOURCE } from "@/constants";

export default function () {
  const { data, isLoading } = useGetTransactionsQuery();

  const transactionsWithTotalSales =
    data?.details
      ?.map((transaction) => {
        if (
          transaction.status !== RESOURCE.PENDING &&
          transaction.status !== RESOURCE.CANCELLED &&
          transaction.status !== RESOURCE.NOT_PAID
        ) {
          const totalSales = transaction?.cameras?.reduce((acc, camera) => {
            return acc + camera?.price;
          }, RESOURCE.NUMBER.ZERO);
          return { ...transaction, totalSales };
        }
        return null;
      })
      .filter(Boolean) || [];

  const groupedData = transactionsWithTotalSales?.reduce((acc, transaction) => {
    const year = new Date(transaction.date).getFullYear();
    const sales = transaction.totalSales || RESOURCE.NUMBER.ZERO;

    acc[year] = (acc[year] || RESOURCE.NUMBER.ZERO) + sales;
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
          <PacmanLoader
            color="#2c3e50"
            loading={true}
            size={RESOURCE.NUMBER.FIFTY}
          />
        </div>
      ) : !data ? null : (
        <>
          {groupedData.length !== RESOURCE.NUMBER.ZERO && (
            <LineChart
              width={RESOURCE.NUMBER.SIX_HUNDRED}
              height={RESOURCE.NUMBER.FOUR_HUNDRED}
              data={chartData}
              margin={{
                top: RESOURCE.NUMBER.FIVE,
                right: RESOURCE.NUMBER.THIRTY,
                left: RESOURCE.NUMBER.TWENTY,
                bottom: RESOURCE.NUMBER.FIVE,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  value + RESOURCE.PHP,
                  "Total Sales",
                ]}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                strokeWidth={RESOURCE.NUMBER.TWO}
                dot={{ strokeWidth: RESOURCE.NUMBER.ZERO }}
                activeDot={{ r: RESOURCE.NUMBER.EIGHT }}
              />
            </LineChart>
          )}
        </>
      )}
    </>
  );
}
