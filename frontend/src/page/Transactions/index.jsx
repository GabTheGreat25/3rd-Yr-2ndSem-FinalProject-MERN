import React from "react";
import { DataTable } from "@/component";
import { useGetTransactionsQuery } from "@api";
import { PacmanLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { ERROR, TAGS, RESOURCE } from "@/constants";

export default function () {
  const auth = useSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetTransactionsQuery({
    populate: [TAGS.USER, TAGS.CAMERA],
  });

  const filteredTransactions = data?.details?.filter(
    (detail) => detail?.user?._id === auth?.user?._id
  );

  const headers = ["ID", "Customer", "Cameras", "Status", "Date"];

  const keys = [
    {
      key: RESOURCE.ID,
      operation: (value, row) => (
        <Link to={`/dashboard/transaction/${row?._id}`} className="link">
          {row?._id}
        </Link>
      ),
    },
    {
      key: TAGS.USER,
      operation: (value, row) => (value ? value?.name : ""),
    },
    {
      key: TAGS.CAMERA,
      operation: (value, row) =>
        value?.map((camera) => camera?.name).join(", "),
    },
    {
      key: "status",
    },
    {
      key: "date",
      operation: (value, row) =>
        moment(value).tz("Asia/Manila").format("YYYY-MM-DD"),
    },
  ];

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader
            color="#2c3e50"
            loading={true}
            size={RESOURCE.NUMBER.FIFTY}
          />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_TRANSACTIONS_ERROR}</div>
      ) : (
        filteredTransactions && (
          <DataTable
            headers={headers}
            keys={keys}
            data={filteredTransactions}
          />
        )
      )}
    </>
  );
}
