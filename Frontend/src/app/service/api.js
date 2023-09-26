// Need to use the React-specific entry point to import createApi
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../common/baseQuery";

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Users", "Location"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ role }) => {
        return {
          url: `users/all/${role}`,
          method: "GET",
        };
      },
      providesTags: ["Users"],
    }),
    getLocation: builder.query({
      query: () => {
        return {
          url: "location",
          method: "GET",
        };
      },
      providesTags: ["Location"],
    }),
    getAllRides: builder.query({
      query: () => {
        return {
          url: "ride",
          method: "GET",
        };
      },
    }),
    getUserById: builder.query({
      query: ({ id }) => {
        return {
          url: `users/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Users", "User"],
    }),
    addUser: builder.mutation({
      query: (body) => ({
        url: `users`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User", "Users"],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    updateLocation: builder.mutation({
      query: (body) => ({
        url: `location`,
        method: "POST",
        body,
      }),
      invalidatesTags: [""],
    }),
    deleteLocation: builder.mutation({
      query: () => ({
        url: `location`,
        method: "DELETE",
      }),
      invalidatesTags: ["Location"],
    }),
    updateRide: builder.mutation({
      query: ({ id, body }) => ({
        url: `ride/${id}`,
        method: "PUT",
        body,
      }),
    }),
    triggerEvents: builder.mutation({
      query: (body) => ({
        url: "pusher",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useGetUsersQuery,
  useGetLocationQuery,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  useUpdateRideMutation,
  useGetAllRidesQuery,
  useTriggerEventsMutation,
} = api;
