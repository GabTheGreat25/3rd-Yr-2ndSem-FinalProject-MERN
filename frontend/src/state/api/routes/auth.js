import { API, ROUTE } from "../../../constants/index";

export const login = (builder) => {
  return builder.mutation({
    query: (payload) => ({
      url: ROUTE.LOGIN_ROUTE,
      method: API.POST,
      body: payload,
    }),
  });
};

export default { login };
