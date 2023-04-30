import React from "react";
import { DataTable, Button } from "@/component";
import {
  useGetTransactionsQuery,
  useGetCommentsQuery,
} from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";
import { ERROR } from "../../constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function () {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const {
    data: dataTransaction,
    isLoading: transactionIsLoading,
    isError: transactionIsError,
  } = useGetTransactionsQuery({
    populate: "transaction",
  });

  const userArray = dataTransaction?.details?.flatMap((detail) =>
    detail?.transactions?.map((transaction) => transaction.user)
  );

  const filteredData = userArray?.filter(
    (user) => user?._id === auth.user?._id
  );

  console.log(filteredData);

  const { data, isLoading, isError } = useGetCommentsQuery({
    populate: "transaction",
  });

  console.log(data?.details);

  const headers = [];
  const keys = [];

  const handleEdit = (id) => {
    navigate(`edit/${id}`);
  };

  const actions = [
    {
      onClick: handleEdit,
      title: "Edit",
    },
  ];

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_COMMENTS_ERROR}</div>
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
