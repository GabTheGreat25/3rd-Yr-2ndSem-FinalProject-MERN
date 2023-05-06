import React from "react";
import ListData from "../../component/ListData";
import { PersonPin } from "@mui/icons-material";
import { useGetUsersQuery } from "@/state/api/reducer";
import { USER, ERROR } from "@/constants";
import { PacmanLoader } from "react-spinners";

export default function () {
  const { data, isLoading, isError } = useGetUsersQuery();
  const users = data?.details ?? [];
  const employees = users.filter((user) => user.roles.includes(USER.EMPLOYEE));
  const employeeCount = employees.length;

  return isLoading ? (
    <div className="loader">
      <PacmanLoader color="#2c3e50" loading={true} size={50} />
    </div>
  ) : isError ? (
    <div className="errorMessage">{ERROR.GET_USERS_ERROR}</div>
  ) : (
    <ListData
      title="Employee"
      data={employeeCount}
      icon={<PersonPin sx={{ fontSize: "8rem", color: "green" }} />}
    />
  );
}
