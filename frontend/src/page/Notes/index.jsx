import React from "react";
import { DataTable, Button } from "@/component";
import { useGetNotesQuery, useDeleteNoteMutation } from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";
import { ERROR } from "../../constants";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function () {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError: isNotesError,
  } = useGetNotesQuery({
    populate: "user",
  });

  const [deleteNote, { isLoading: isDeleting, isError: isDeleteError }] =
    useDeleteNoteMutation();

  const headers = ["ID", "Title", "Text", "Completed", "Employee"];
  const keys = [
    {
      key: "_id",
      operation: (value, row) => (
        <Link to={`/dashboard/note/${row._id}`} className="link">
          {row._id}
        </Link>
      ),
    },
    {
      key: "title",
    },
    {
      key: "text",
    },
    {
      key: "completed",
      operation: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "user.name",
    },
  ];

  const handleDelete = (id) => {
    deleteNote(id);
  };

  const handleEdit = (id) => {
    navigate(`edit/${id}`);
  };

  const actions = [
    {
      onClick: handleEdit,
      title: "Edit",
    },
    {
      onClick: handleDelete,
      title: "Delete",
    },
  ];

  return (
    <>
      <Button
        title="Add Note"
        onClick={() => {
          navigate("/dashboard/note/create");
        }}
      />
      {isLoading || isDeleting ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isNotesError ? (
        <div className="errorMessage">{ERROR.GET_NOTES_ERROR}</div>
      ) : isDeleteError ? (
        <div className="errorMessage">{ERROR.DELETE_NOTE_ERROR}</div>
      ) : (
        data && (
          <DataTable
            headers={headers}
            keys={keys}
            actions={actions}
            data={data?.details}
          />
        )
      )}
    </>
  );
}
