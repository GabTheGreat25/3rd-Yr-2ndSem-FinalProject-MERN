import React from "react";
import { DataTable, Button } from "@/component";
import {
  useGetCamerasQuery,
  useDeleteCameraMutation,
} from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";
import { ERROR } from "../../constants";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function () {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError: isCameraError,
  } = useGetCamerasQuery({
    populate: "user",
  });

  const [deleteCameras, { isLoading: isDeleting, isError: isDeleteError }] =
    useDeleteCameraMutation();

  const headers = ["ID", "Name", "Text", "Price", "Image", "Owner"];
  const keys = [
    {
      key: "_id",
      operation: (value, row) => (
        <Link to={`/dashboard/camera/${row._id}`} className="link">
          {row._id}
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
      key: "user.name",
    },
  ];

  const handleDelete = (id) => {
    deleteCameras(id);
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
        title="Add Camera"
        onClick={() => {
          navigate("/dashboard/camera/create");
        }}
      />
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
