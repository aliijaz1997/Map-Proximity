import React from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import { useGetUsersQuery } from "../../app/service/api";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openUserAddModal = () => {
    dispatch(
      openModal({
        title: "Add New User",
        bodyType: MODAL_BODY_TYPES.USER_ADD_NEW,
      })
    );
  };

  return (
    <div className="inline-block float-right">
      <button
        className="btn px-6 btn-sm normal-case btn-primary"
        onClick={() => openUserAddModal()}
      >
        Add New
      </button>
    </div>
  );
};

function Users() {
  const dispatch = useDispatch();

  const { data: usersList = [], isLoading } = useGetUsersQuery({
    role: "admin",
  });

  const deleteCurrentUser = (index) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this user?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.USER_DELETE,
          index,
        },
      })
    );
  };
  const editUserModalOpen = (index) => {
    dispatch(
      openModal({
        title: "Edit User",
        bodyType: MODAL_BODY_TYPES.EDIT_USER,
        extraObject: {
          index,
        },
      })
    );
  };

  if (isLoading) {
    document.body.classList.add("loading-indicator");
  }
  if (!isLoading) {
    document.body.classList.remove("loading-indicator");
  }

  return (
    <>
      <TitleCard
        title="Users"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email Id</th>
                <th>Phone No.</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user, k) => {
                return (
                  <tr key={k}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={user.imageUrl} alt="Avatar" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.firstName}</div>
                          <div className="text-sm opacity-50">
                            {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{moment(user.createdAt).format("DD MMM YY")}</td>
                    <td>
                      {user.status === "active" ? (
                        <div className="badge badge-primary">
                          {user.status.toUpperCase()}
                        </div>
                      ) : (
                        <div className="badge badge-secondary">
                          {user.status.toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => editUserModalOpen(user._id)}
                      >
                        <PencilIcon className="w-5" />
                      </button>
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => deleteCurrentUser(user._id)}
                      >
                        <TrashIcon className="w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
}

export default Users;
