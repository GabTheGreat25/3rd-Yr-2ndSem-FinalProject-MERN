import { ROUTE, TAGS } from "../../../constants";

export const get = (builder) => {
  return builder.query({
    query: () => `${ROUTE.USERS_ROUTE}`,
    method: "GET",
    providesTags: [TAGS.USERS],
  });
};

export const getById = (builder) => {
  return builder.query({
    query: (id) => `${ROUTE.USER_ID_ROUTE.replace(":id", id)}`,
    method: "GET",
    providesTags: [TAGS.USERS],
  });
};

export const add = (builder) => {
  return builder.mutation({
    query: (payload) => ({
      url: `${ROUTE.USERS_ROUTE}`,
      method: "POST",
      body: payload,
    }),
    invalidatesTags: [TAGS.USERS],
  });
};

export const updateById = (builder) => {
  return builder.mutation({
    query: ({ id, payload }) => {
      return {
        url: `${ROUTE.EDIT_USER_ID.replace(":id", id)}`,
        method: "PATCH",
        body: payload,
      };
    },
    invalidatesTags: [TAGS.USERS],
  });
};

export const deleteById = (builder) => {
  return builder.mutation({
    query: (id) => ({
      url: `${ROUTE.USER_ID_ROUTE.replace(":id", id)}`,
      method: "DELETE",
    }),
    invalidatesTags: [TAGS.USERS],
  });
};

export default { get, getById, add, updateById, deleteById };
