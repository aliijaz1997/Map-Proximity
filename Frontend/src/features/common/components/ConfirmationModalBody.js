import { useDispatch } from "react-redux";
import { CONFIRMATION_MODAL_CLOSE_TYPES } from "../../../utils/globalConstantUtil";
import { showNotification } from "../headerSlice";
import {
  useDeleteCustomerMutation,
  useDeleteDriverMutation,
} from "../../../app/service/api";

function ConfirmationModalBody({ extraObject, closeModal }) {
  const [
    deleteCustomer,
    {
      isError: isCustomerError,
      isLoading: isCustomerLoading,
      isSuccess: isCustomerSuccess,
    },
  ] = useDeleteCustomerMutation();
  const [
    deleteDriver,
    {
      isError: isDriverError,
      isLoading: isDriverDeleting,
      isSuccess: isDriverSuccess,
    },
  ] = useDeleteDriverMutation();

  const dispatch = useDispatch();

  const { message, type, index } = extraObject;

  const proceedWithYes = async () => {
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.CUSTOMER_DELETE) {
      await deleteCustomer({ id: index });
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.DRIVER_DELETE) {
      await deleteDriver({ id: index });
    }
  };

  if (isCustomerLoading || isDriverDeleting) {
    document.body.classList.add("loading-indicator");
  }
  if (isCustomerError) {
    document.body.classList.remove("loading-indicator");
    dispatch(
      showNotification({
        message: "Error Occurred while deleting customer",
        status: 2,
      })
    );
  }
  if (isDriverError) {
    document.body.classList.remove("loading-indicator");
    dispatch(
      showNotification({
        message: "Error Occurred while deleting driver",
        status: 2,
      })
    );
  }

  if (isCustomerSuccess) {
    document.body.classList.remove("loading-indicator");
    dispatch(showNotification({ message: "Customer Deleted!", status: 1 }));
    closeModal();
  }

  if (isDriverSuccess) {
    document.body.classList.remove("loading-indicator");
    dispatch(showNotification({ message: "Driver Deleted!", status: 1 }));
    closeModal();
  }

  return (
    <>
      <p className=" text-xl mt-8 text-center">{message}</p>

      <div className="modal-action mt-12">
        <button className="btn btn-outline   " onClick={() => closeModal()}>
          Cancel
        </button>

        <button
          className="btn btn-primary w-36"
          onClick={() => proceedWithYes()}
        >
          Yes
        </button>
      </div>
    </>
  );
}

export default ConfirmationModalBody;
