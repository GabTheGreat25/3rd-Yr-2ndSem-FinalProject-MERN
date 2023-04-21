import { API, ROUTE } from "../../../constants/index";

export const authenticate = (builder) => {
  return builder.mutation({
    query: (payload) => ({
      url: ROUTE.LOGIN_ROUTE,
      method: API.POST,
      body: payload,
    }),
  });
};

export default { authenticate };
