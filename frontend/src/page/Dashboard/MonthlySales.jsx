import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetTransactionsQuery } from "@api";
import { PacmanLoader } from "react-spinners";
import { MONTHS, RESOURCE } from "@/constants";

export default function () {
  const { data, isLoading } = useGetTransactionsQuery();

  const groupedData = data?.details
    ? data?.details?.reduce((acc, transaction) => {
        if (
          transaction.status !== RESOURCE.PENDING &&
          transaction.status !== RESOURCE.CANCELLED &&
          transaction.status !== RESOURCE.NOT_PAID
        ) {
          const month = new Date(transaction?.date).getMonth();

          const totalCost = transaction?.cameras?.reduce(
            (sum, camera) => sum + camera?.price,
            RESOURCE.NUMBER.ZERO
          );

          acc[month] = (acc[month] || RESOURCE.NUMBER.ZERO) + totalCost;
        }
        return acc;
      }, {})
    : {};

  const chartData = MONTHS?.map((monthName, index) => ({
    month: monthName,
    sales: groupedData[index] || RESOURCE.NUMBER.ZERO,
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
            <AreaChart
              data={chartData}
              width={RESOURCE.NUMBER.THOUSAND_TWO_HUNDRED}
              height={RESOURCE.NUMBER.FOUR_HUNDRED}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#33B2DF"
                    stopOpacity={RESOURCE.NUMBER.ONE}
                  />
                  <stop
                    offset="95%"
                    stopColor="#33B2DF"
                    stopOpacity={RESOURCE.NUMBER.ZERO}
                  />
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
                fillOpacity={RESOURCE.NUMBER.ONE}
                fill="url(#colorSales)"
              />
            </AreaChart>
          )}
        </>
      )}
    </>
  );
}
