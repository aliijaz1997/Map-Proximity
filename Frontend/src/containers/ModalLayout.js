import { MODAL_BODY_TYPES } from "../utils/globalConstantUtil";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../features/common/modalSlice";
import AddCustomerModalBody from "../features/customers/components/AddCustomerModalBody";
import ConfirmationModalBody from "../features/common/components/ConfirmationModalBody";
import AddDriverModalBody from "../features/drivers/components/AddDriverModalBody";
import EditDriverModalBody from "../features/drivers/components/EditDriverModalBody";
import EditCustomerModal from "../features/customers/components/EditCustomerModal";
import AddUserModal from "../features/users/components/AddUserModalBody";
import EditUserModal from "../features/users/components/EditUserModalBody";
import FindingDriverModal from "../components/Map/FindingDriverModal";
import NoRideFoundModal from "../components/Map/NoRideFoundModal";
import PreStartRideDriverModal from "../features/Client/PreStartRideDriverModal";
import StartRideModal from "../features/Client/StartRideModal";
import RideEndedModal from "../components/Map/RideEndedModal";

function ModalLayout() {
  const { isOpen, bodyType, size, extraObject, title } = useSelector(
    (state) => state.modal
  );
  const dispatch = useDispatch();

  const close = (e) => {
    dispatch(closeModal(e));
  };

  return (
    <>
      {/* The button to open modal */}

      {/* Put this part before </body> tag */}
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className={`modal-box  ${size === "lg" ? "max-w-5xl" : ""}`}>
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => close()}
          >
            ✕
          </button>
          <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>

          {/* Loading modal body according to different modal type */}
          {
            {
              [MODAL_BODY_TYPES.CUSTOMER_ADD_NEW]: (
                <AddCustomerModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.DRIVER_ADD_NEW]: (
                <AddDriverModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.USER_ADD_NEW]: (
                <AddUserModal closeModal={close} extraObject={extraObject} />
              ),
              [MODAL_BODY_TYPES.CONFIRMATION]: (
                <ConfirmationModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),
              [MODAL_BODY_TYPES.EDIT_DRIVER]: (
                <EditDriverModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),
              [MODAL_BODY_TYPES.EDIT_CUSTOMER]: (
                <EditCustomerModal
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),
              [MODAL_BODY_TYPES.EDIT_USER]: (
                <EditUserModal extraObject={extraObject} closeModal={close} />
              ),
              [MODAL_BODY_TYPES.FINDING_CUSTOMER_MODAL]: (
                <FindingDriverModal
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),
              [MODAL_BODY_TYPES.NO_RIDE_FOUND_MODAL]: (
                <NoRideFoundModal
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),
              [MODAL_BODY_TYPES.PRE_START_DRIVER_RIDE_MODAL]: (
                <PreStartRideDriverModal
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),
              [MODAL_BODY_TYPES.START_DRIVER_RIDE_MODAL]: (
                <StartRideModal extraObject={extraObject} closeModal={close} />
              ),
              [MODAL_BODY_TYPES.RIDE_END_MODAL]: (
                <RideEndedModal extraObject={extraObject} closeModal={close} />
              ),
              [MODAL_BODY_TYPES.DEFAULT]: <div></div>,
            }[bodyType]
          }
        </div>
      </div>
    </>
  );
}

export default ModalLayout;
