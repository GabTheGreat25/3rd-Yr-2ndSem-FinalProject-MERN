import React from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Cell,
} from "recharts";
import { Typography, Box } from "@mui/material";
import { groupBy } from "lodash";
import { useGetCamerasQuery } from "@api";
import randomColor from "randomcolor";
import { PacmanLoader } from "react-spinners";
import { RESOURCE } from "@/constants";

export default function () {
  const { data, isLoading } = useGetCamerasQuery();

  const groupedData = React.useMemo(() => {
    if (!data) return [];
    const grouped = groupBy(data?.details, (value) => value?.user?.name);
    const result = Object.keys(grouped)?.map((name, index) => {
      const userCameras = grouped[name];
      const cameraNames = userCameras?.map((camera) => camera?.name);
      return {
        name,
        cameras: cameraNames,
        totalCameras: userCameras?.filter(
          (camera) => camera?.status !== RESOURCE.NUMBER.ONE
        ).length,
        color: randomColor({ luminosity: "bright" }),
      };
    });
    return result;
  }, [data]);

  const maxCameras = React.useMemo(() => {
    if (groupedData.length === RESOURCE.NUMBER.ZERO)
      return RESOURCE.NUMBER.ZERO;
    return Math.max(...groupedData.map((item) => item?.totalCameras));
  }, [groupedData]);

  const renderCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const cameras =
        payload[RESOURCE.NUMBER.ZERO]?.payload?.cameras.join(", ");
      return (
        <Box sx={{ backgroundColor: "white" }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              paddingTop: ".25rem",
              paddingX: ".5rem",
            }}
          >{`User: ${label} has ${
            payload[RESOURCE.NUMBER.ZERO].value
          } camera(s)`}</Typography>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", padding: "0 2rem", textAlign: "center" }}
          >{`Camera: ${cameras}`}</Typography>
        </Box>
      );
    }
    return null;
  };

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
            <BarChart
              width={RESOURCE.NUMBER.SIX_HUNDRED}
              height={RESOURCE.NUMBER.FOUR_HUNDRED}
              data={groupedData}
              margin={{
                top: RESOURCE.NUMBER.TWENTY,
                right: RESOURCE.NUMBER.THIRTY,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[RESOURCE.NUMBER.ZERO, maxCameras]} />
              <Tooltip content={renderCustomTooltip} />
              <Bar dataKey="totalCameras" fill="#8884d8">
                {groupedData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </>
      )}
    </>
  );
}
