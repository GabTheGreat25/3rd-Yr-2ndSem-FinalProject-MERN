import React from "react";
import { DataTable } from "@/component";
import {
  useGetCommentsQuery,
  useDeleteCommentMutation,
} from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";
import { ERROR } from "../../constants";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function () {
  const { data, isLoading, isError } = useGetCommentsQuery({
    populate: "transaction",
  });
  const [deleteComment, { isLoading: isDeleting, isError: isDeleteError }] =
    useDeleteCommentMutation();

  const headers = ["ID", "TransService", "Text", "Ratings", "Transaction"];

  const keys = [
    {
      key: "_id",
      operation: (value, row) => (
        <Link to={`/dashboard/comment/${row._id}`} className="link">
          {row._id}
        </Link>
      ),
    },
    {
      key: "transService",
    },
    {
      key: "text",
    },
    {
      key: "ratings",
      operation: (value, row) => `${value} stars`,
    },
    {
      key: "transaction",
      operation: (value) => (value ? value.status : ""),
    },
  ];

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure?")) {
        await deleteComment(id).then((response) => {
          console.log("Response from API:", response);
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          };
          response?.data?.success === true
            ? toast.success("Comment deleted successfully!", toastProps)
            : toast.error("Failed to delete comment.", toastProps);
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete comment.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    }
  };

  const actions = [
    {
      onClick: handleDelete,
      title: "Delete",
    },
  ];

  return (
    <>
      {isLoading || isDeleting ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_COMMENTS_ERROR}</div>
      ) : isDeleteError ? (
        <div className="errorMessage">{ERROR.DELETE_COMMENT_ERROR}</div>
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
