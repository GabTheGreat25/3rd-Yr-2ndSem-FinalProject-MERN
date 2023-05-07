import { useState } from "react";
import { DataTable, Button } from "@/component";
import { useGetNotesQuery, useDeleteNoteMutation } from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";
import { USER, ERROR } from "../../constants";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function () {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError: isNotesError,
  } = useGetNotesQuery({
    populate: "user",
  });

  const [isDeletingId, setIsDeletingId] = useState(null);

  const auth = useSelector((state) => state.auth);

  const [deleteNote, { isLoading: isDeleting, isError: isDeleteError }] =
    useDeleteNoteMutation();

  const headers = ["ID", "Title", "Text", "Completed", "Employee"];

  const keys = [
    {
      key: "_id",
      operation: (value, row) => (
        <Link to={`/dashboard/note/${row?._id}`} className="link">
          {row?._id}
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
      key: "user",
      operation: (value) => (value ? value?.name : ""),
    },
  ];

  const filteredData = data?.details?.filter(
    (note) => note?._id !== isDeletingId
  );

  const handleDelete = async (id) => {
    setIsDeletingId(id);
    if (window.confirm("Are you sure?")) {
      const response = await deleteNote(id);

      const toastProps = {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      };
      if (response?.data?.success === true) {
        toast.success(`${response?.data?.message}`, toastProps);
        const newData = data?.details?.filter((note) => note?._id !== id);
        setData({ details: newData });
      } else
        toast.error(`${response?.error?.data?.error?.message}`, toastProps);
    }
  };

  const handleEdit = (id) => {
    const task = data.details.find((task) => task._id === id);
    if (!task) {
      toast.error("Could not find task to edit.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      return;
    }
    const completed = task.completed === true;
    const isTaskOwner = auth?.user?._id === task.user._id;
    const isAdmin = auth?.user?.roles?.includes(USER.ADMIN);
    const isAdminOrEmployee =
      auth?.user?.roles?.includes(USER.ADMIN) &&
      auth?.user?.roles?.includes(USER.EMPLOYEE);
    const isEmployee =
      auth?.user?.roles?.includes(USER.EMPLOYEE) &&
      !auth?.user?.roles?.includes(USER.ADMIN);
    const isTaskCompleted = task.completed === true;

    if (isTaskCompleted && !isTaskOwner && isAdminOrEmployee) {
      toast.error(ERROR.COMPLETE_NOTE_ERROR, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    } else if (isTaskCompleted && isEmployee && !isTaskOwner) {
      toast.error(ERROR.EDIT_NOTE_ERROR, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    } else if (isTaskCompleted && !isAdminOrEmployee && !isTaskOwner) {
      toast.error(ERROR.COMPLETE_NOTE_ERROR, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    } else if (completed && isEmployee) {
      navigate(`edit/${id}`);
    } else if (!completed && isAdmin) {
      navigate(`edit/${id}`);
    } else if (!completed && isTaskOwner) {
      navigate(`edit/${id}`);
    } else if (!completed && !isTaskOwner && !isAdminOrEmployee) {
      toast.error(ERROR.EDIT_NOTE_ERROR, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    } else if (completed && !isEmployee && !isTaskOwner && !isAdminOrEmployee) {
      toast.error(ERROR.EDIT_NOTE_ERROR, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    } else navigate(`edit/${id}`);
  };

  const actions = [
    {
      onClick: handleEdit,
      title: "Edit",
    },
    ...(auth?.user?.roles?.includes(USER.ADMIN)
      ? [{ onClick: (id) => handleDelete(id), title: "Delete" }]
      : []),
  ];

  return (
    <>
      {auth?.user?.roles?.includes(USER.ADMIN) && (
        <Button
          title="Add Note"
          onClick={() => {
            navigate("/dashboard/note/create");
          }}
        />
      )}
      {isLoading || isDeleting ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isNotesError ? (
        <div className="errorMessage">{ERROR.GET_NOTES_ERROR}</div>
      ) : isDeleteError ? (
        <div className="errorMessage">{ERROR.DELETE_NOTE_ERROR}</div>
      ) : (
        filteredData && (
          <DataTable
            headers={headers}
            keys={keys}
            actions={actions}
            data={filteredData}
          />
        )
      )}
    </>
  );
}
