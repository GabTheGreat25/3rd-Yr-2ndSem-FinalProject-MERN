import { useState } from "react";
import { DataTable, Button } from "@/component";
import { useGetCamerasQuery, useDeleteCameraMutation } from "@api";
import { PacmanLoader } from "react-spinners";
import { USER, ERROR, TAGS, RESOURCE } from "@/constants";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function () {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCamerasQuery({
    populate: TAGS.USER,
  });

  const [isDeletingId, setIsDeletingId] = useState(null);

  const [deleteCamera, { isLoading: isDeleting, isError: isDeleteError }] =
    useDeleteCameraMutation();

  const auth = useSelector((state) => state.auth);

  const headers = ["ID", "Name", "Text", "Price", "Image", "Owner"];
  const keys = [
    {
      key: RESOURCE.ID,
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
      operation: (value, row) => `${value}${RESOURCE.PHP}`,
    },
    {
      key: "image",
      operation: (value, row) => {
        return value?.map((image) => (
          <img
            style={{ padding: "0 .5rem" }}
            height={RESOURCE.NUMBER.SIXTY}
            width={RESOURCE.NUMBER.SEVENTY_FIVE}
            src={image?.url}
            alt={image?.originalname}
            key={image?.public_id}
          />
        ));
      },
    },
    {
      key: TAGS.USER,
      operation: (value, row) => (value ? value?.name : ""),
    },
  ];

  const filteredData = data?.details?.filter(
    (camera) => camera?._id !== isDeletingId
  );

  const handleDelete = async (id) => {
    setIsDeletingId(id);
    if (window.confirm(RESOURCE.CONFIRM)) {
      const response = await deleteCamera(id);

      const toastProps = {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: RESOURCE.NUMBER.FIVE_THOUSAND,
      };
      if (response?.data?.success === true) {
        toast.success(`${response?.data?.message}`, toastProps);
        const newData = data?.details?.filter((camera) => camera?._id !== id);
        setData({ details: newData });
      } else
        toast.error(`${response?.error?.data?.error?.message}`, toastProps);
    }
  };

  const handleEdit = (id) => navigate(`edit/${id}`);

  const actions = auth?.user?.roles?.includes(USER.ADMIN)
    ? [
        {
          onClick: handleEdit,
          title: "Edit",
        },
        {
          onClick: handleDelete,
          title: "Delete",
        },
      ]
    : [];

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
          <PacmanLoader
            color="#2c3e50"
            loading={true}
            size={RESOURCE.NUMBER.FIFTY}
          />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_CAMERAS_ERROR}</div>
      ) : isDeleteError ? (
        <div className="errorMessage">{ERROR.DELETE_CAMERA_ERROR}</div>
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
