import React from "react";
import { useSelector } from "react-redux";
import {
  useGetCustomerPaymentsQuery,
  useGetUserByIdQuery,
  useMakePaymentMutation,
  useUpdatePaymentStatusMutation,
} from "../../app/service/api";
import Loader from "../../components/Loader/Loader";

export default function PaymentList() {
  const { user } = useSelector((state) => state.auth);
  const { data: dbUser } = useGetUserByIdQuery({ id: user?.uid });
  const { data: paymentList, isLoading } = useGetCustomerPaymentsQuery({
    customerId: user?.uid,
  });
  const [makePayment] = useMakePaymentMutation();
  const [updatePayment] = useUpdatePaymentStatusMutation();

  const executePayment = async ({ amount, paymentId }) => {
    if (dbUser) {
      await makePayment({
        customerId: dbUser.customerPaymentId,
        amount,
      });

      await updatePayment({
        id: paymentId,
        body: {
          status: "success",
        },
      });
    }
  };

  if (isLoading && !paymentList) {
    return <Loader />;
  }

  return (
    <div>
      <div className="text-center m-2">
        <h1 className="text-3xl text-gray-700 font-semibold mb-4">
          Payment List
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentList.map((payment, index) => (
          <div
            key={payment._id}
            className="bg-white shadow-md rounded-md p-4 border border-gray-300"
          >
            <h2 className="text-lg font-semibold mb-2">
              Ride Location: {payment.location}
            </h2>
            <p className="text-gray-600 mb-2">Driver: {payment.driver.name}</p>
            <p
              className={`text-${
                payment.status === "success" ? "green" : "yellow"
              }-500 font-semibold mb-2`}
            >
              Status: {payment.status.toUpperCase()}
            </p>
            <p className="text-lg font-semibold text-orange-600 mb-2">
              Price: ${payment.amount}
            </p>
            <button
              onClick={() =>
                executePayment({
                  amount: payment.amount,
                  paymentId: payment._id,
                })
              }
              disabled={payment.status === "success"}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
            >
              Confirm Payment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
