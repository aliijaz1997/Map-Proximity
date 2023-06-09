import moment from "moment";
import { useDispatch } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { useGetCustomersQuery } from "../../app/service/api";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openCustomerAddModal = () => {
    dispatch(
      openModal({
        title: "Add New Customer",
        bodyType: MODAL_BODY_TYPES.CUSTOMER_ADD_NEW,
      })
    );
  };

  return (
    <div className="inline-block float-right">
      <button
        className="btn px-6 btn-sm normal-case btn-primary"
        onClick={() => openCustomerAddModal()}
      >
        Add New
      </button>
    </div>
  );
};

function Customers() {
  const dispatch = useDispatch();

  const { data: customersList = [], isLoading } = useGetCustomersQuery();

  const deleteCurrentCustomer = (index) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this customer?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.CUSTOMER_DELETE,
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
        title="Customers"
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
              {customersList.map((customer, k) => {
                return (
                  <tr key={k}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={customer.imageUrl} alt="Avatar" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{customer.firstName}</div>
                          <div className="text-sm opacity-50">
                            {customer.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phoneNumber}</td>
                    <td>{moment(customer.createdAt).format("DD MMM YY")}</td>
                    <td>
                      {customer.status === "active" ? (
                        <div className="badge badge-primary">
                          {customer.status.toUpperCase()}
                        </div>
                      ) : (
                        <div className="badge badge-secondary">
                          {customer.status.toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => deleteCurrentCustomer(customer._id)}
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

export default Customers;
