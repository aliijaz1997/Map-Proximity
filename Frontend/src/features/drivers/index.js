import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import { useGetDriversQuery, useGetUsersQuery } from "../../app/service/api";
import { openModal } from "../common/modalSlice";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";

const TopSideButtons = ({}) => {
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();

  const openDriverAddModal = () => {
    dispatch(
      openModal({
        title: "Add New Driver",
        bodyType: MODAL_BODY_TYPES.DRIVER_ADD_NEW,
      })
    );
  };
  return (
    <div className="inline-block float-right">
      <SearchBar
        searchText={searchText}
        styleClass="mr-4"
        setSearchText={setSearchText}
      />
      <button
        className="btn px-6 btn-sm normal-case btn-info"
        onClick={() => openDriverAddModal()}
      >
        Add New
      </button>
    </div>
  );
};

function Drivers() {
  const dispatch = useDispatch();

  const { data: driversList = [], isLoading } = useGetUsersQuery({
    role: "driver",
  });

  const deleteCurrentDriver = (index) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this driver?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.DRIVER_DELETE,
          index,
        },
      })
    );
  };
  const openEditModal = (index) => {
    dispatch(
      openModal({
        title: "Edit Driver",
        bodyType: MODAL_BODY_TYPES.EDIT_DRIVER,
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
        title="Drivers"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        {/* Team Member list in table format loaded constant */}
        <div className="overflow-x-auto w-full">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email Id</th>
                <th className="px-4 py-2">Phone No.</th>
                <th className="px-4 py-2">Car Name</th>
                <th className="px-4 py-2">Car Number</th>
                <th className="px-4 py-2">Car Image</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {driversList.map((driver, k) => {
                return (
                  <tr key={k}>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={driver.imageUrl} alt="Avatar" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{driver.firstName}</div>
                          <div className="text-sm text-gray-500">
                            {driver.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">{driver.email}</td>
                    <td className="px-4 py-2">{driver.phoneNumber}</td>
                    <td className="px-4 py-2">{driver.carName}</td>
                    <td className="px-4 py-2">{driver.carNumber}</td>
                    <td className="px-4 py-2">
                      <img
                        src={driver.carImage}
                        alt="Car"
                        className="w-12 h-12"
                      />
                    </td>
                    <td className="px-4 py-2">
                      {moment(driver.createdAt).format("DD MMM YY")}
                    </td>
                    <td className="px-4 py-2">
                      {driver.status === "active" ? (
                        <span className="badge badge-primary">
                          {driver.status.toUpperCase()}
                        </span>
                      ) : (
                        <span className="badge badge-secondary">
                          {driver.status.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => openEditModal(driver._id)}
                      >
                        <PencilIcon className="w-5" />
                      </button>
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => deleteCurrentDriver(driver._id)}
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

export default Drivers;
