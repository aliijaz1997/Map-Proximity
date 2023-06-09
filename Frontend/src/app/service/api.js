// Need to use the React-specific entry point to import createApi
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../common/baseQuery";

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Customers", "Customer", "Driver", "Drivers"],
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: () => {
        return {
          url: `customers`,
          method: "GET",
        };
      },
      providesTags: ["Customers"],
    }),
    getDrivers: builder.query({
      query: () => {
        return {
          url: `drivers`,
          method: "GET",
        };
      },
      providesTags: ["Drivers"],
    }),
    addCustomer: builder.mutation({
      query: (body) => ({
        url: `customers`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),
    addDriver: builder.mutation({
      query: (body) => ({
        url: `drivers`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Drivers"],
    }),
    updateCustomer: builder.mutation({
      query: ({ body }) => ({
        url: `customers`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),
    updateDriver: builder.mutation({
      query: ({ body }) => ({
        url: `drivers`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Driver"],
    }),
    deleteCustomer: builder.mutation({
      query: ({ id }) => ({
        url: `customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),
    deleteDriver: builder.mutation({
      query: ({ id }) => ({
        url: `drivers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Drivers"],
    }),
  }),
});

export const {
  useAddCustomerMutation,
  useGetCustomersQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useAddDriverMutation,
  useGetDriversQuery,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} = api;
