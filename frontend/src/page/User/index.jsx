import React from "react";
import { DataTable, Button } from "@/component";
import { useGetUsersQuery, useDeleteUserMutation } from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";
import { ERROR } from "../../constants";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function () {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetUsersQuery();

  const [deleteUser, { isLoading: isDeleting, isError: isDeleteError }] =
    useDeleteUserMutation();

  const headers = ["ID", "User Name", "Email", "Roles", "Images"];
  const keys = [
    {
      key: "_id",
      operation: (value, row) => (
        <Link to={`/dashboard/user/${row._id}`} className="link">
          {row._id}
        </Link>
      ),
    },
    {
      key: "name",
    },
    {
      key: "email",
    },
    {
      key: "roles",
      operation: (value) => value.join(", "),
    },
    {
      key: "image",
      operation: (value) => {
        return value.map((image) => (
          <img
            style={{ padding: "0 .5rem" }}
            height={60}
            width={75}
            src={image.url}
            alt={image.originalname}
            key={image.public_id}
          />
        ));
      },
    },
  ];

  const handleDelete = (id) => {
    deleteUser(id);
  };

  const actions = [
    {
      onClick: handleDelete,
      title: "Delete",
    },
  ];

  return (
    <>
      <Button
        title="Add User"
        onClick={() => {
          navigate("/dashboard/user/create");
        }}
      />
      {isLoading || isDeleting ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_USERS_ERROR}</div>
      ) : isDeleteError ? (
        <div className="errorMessage">{ERROR.DELETE_USER_ERROR}</div>
      ) : (
        data && (
          <DataTable
            headers={headers}
            keys={keys}
            actions={actions}
            data={data.details}
          />
        )
      )}
    </>
  );
}