import React from "react";
import { ListData } from "@/component";
import { AccountCircle } from "@mui/icons-material";
import { useGetUsersQuery } from "@api";
import { PacmanLoader } from "react-spinners";
import { ERROR, RESOURCE } from "@/constants";

export default function () {
  const { data, isLoading, isError } = useGetUsersQuery();
  const users = data?.details ?? [];
  const usersCount = users.length;

  return isLoading ? (
    <div className="loader">
      <PacmanLoader
        color="#2c3e50"
        loading={true}
        size={RESOURCE.NUMBER.FIFTY}
      />
    </div>
  ) : isError ? (
    <div className="errorMessage">{ERROR.GET_USERS_ERROR}</div>
  ) : (
    <ListData
      title="Users"
      data={usersCount}
      icon={<AccountCircle sx={{ fontSize: "8rem", color: "blue" }} />}
    />
  );
}
