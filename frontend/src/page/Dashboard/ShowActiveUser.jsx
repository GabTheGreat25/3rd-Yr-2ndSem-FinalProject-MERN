import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useGetUsersQuery } from "@api";
import { PacmanLoader } from "react-spinners";
import randomColor from "randomcolor";
import { RESOURCE } from "@/constants";

export default function () {
  const { data, isLoading } = useGetUsersQuery();

  const chartData = React.useMemo(() => {
    if (data?.details) {
      const activeCount = data?.details?.filter((user) => user?.active).length;
      const inactiveCount = data?.details?.length - activeCount;
      return [
        { name: RESOURCE.ACTIVE, quantity: activeCount },
        { name: RESOURCE.INACTIVE, quantity: inactiveCount },
      ];
    }
    return [];
  }, [data]);

  const COLORS = React.useMemo(() => {
    return randomColor({ count: chartData.length, luminosity: "bright" });
  }, [chartData]);

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
        chartData.length !== RESOURCE.NUMBER.ZERO && (
          <PieChart
            width={RESOURCE.NUMBER.FIVE_HUNDRED_FIFTY}
            height={RESOURCE.NUMBER.FOUR_HUNDRED}
          >
            <Pie
              data={chartData}
              dataKey="quantity"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={RESOURCE.NUMBER.HUNDRED_FIFTY}
              fill="#8884d8"
              label
            >
              {chartData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )
      )}
    </>
  );
}
