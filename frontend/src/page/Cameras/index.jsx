import React from "react";
import { DataTable, Button } from "@/component";
import {
  useGetCamerasQuery,
  useDeleteCameraMutation,
} from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";
import { USER, ERROR } from "../../constants";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function () {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError: isCameraError,
  } = useGetCamerasQuery({
    populate: "user",
  });

  const [deleteCamera, { isLoading: isDeleting, isError: isDeleteError }] =
    useDeleteCameraMutation();

  const auth = useSelector((state) => state.auth);

  const headers = ["ID", "Name", "Text", "Price", "Image", "Owner"];
  const keys = [
    {
      key: "_id",
      operation: (value, row) => (
        <Link to={`/dashboard/camera/${row?._id}`} className="link">
          {row?._id}
        </Link>
      ),
    },
    {
      key: "name",
    },
    {
      key: "text",
    },
    {
      key: "price",
      operation: (value, row) => `₱${value}`,
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
    {
      key: "user",
      operation: (value) => (value ? value.name : ""),
    },
  ];

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure?")) {
        await deleteCamera(id).then((response) => {
          console.log("Response from API:", response);
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          };
          response?.data?.success === true
            ? toast.success("Camera deleted successfully!", toastProps)
            : toast.error("Failed to delete camera.", toastProps);
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete camera.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    }
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
      {auth?.user?.roles?.includes(USER.ADMIN) && (
        <Button
          title="Add Camera"
          onClick={() => {
            navigate("/dashboard/camera/create");
          }}
        />
      )}
      {isLoading || isDeleting ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isCameraError ? (
        <div className="errorMessage">{ERROR.GET_CAMERAS_ERROR}</div>
      ) : isDeleteError ? (
        <div className="errorMessage">{ERROR.DELETE_CAMERA_ERROR}</div>
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
