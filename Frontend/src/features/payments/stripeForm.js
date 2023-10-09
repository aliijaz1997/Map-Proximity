import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import {
  useAddCardMutation,
  useCheckCardQuery,
  useGetUserByIdQuery,
} from "../../app/service/api";
import { useSelector } from "react-redux";

const StripeForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { data: dbUser } = useGetUserByIdQuery({ id: user.uid });

  const [addCard] = useAddCardMutation();
  const { data: customerCard } = useCheckCardQuery({
    customerId: dbUser?.customerPaymentId,
  });
  const handleCardSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    const cardElement = elements.getElement(CardElement);
    try {
      const { token } = await stripe.createToken(cardElement);
      console.log(token, "TOKEN");
      const response = await addCard({
        token: token.id,
        email: user.email,
        id: user.uid,
      });
      console.log(response, "RESPONSE");
    } catch (error) {
      console.error(error);
      setErrorMessage("Error saving card. Please try again.");
    }

    setLoading(false);
  };

  if (!user) {
    return <div>No user</div>;
  }
  console.log({ customerCard });
  return (
    <div className="flex flex-col text-center">
      <div className="font-bold text-2xl text-blue-600 mb-5">
        Payment Section
      </div>
      {!customerCard ? (
        <form onSubmit={handleCardSubmit} className="m-5">
          <div className="w-1/3 mx-auto">
            <CardElement
              options={{
                iconStyle: "solid",
                hidePostalCode: true,
                style: {
                  base: {
                    iconColor: "blue",
                    color: "black",
                    fontSize: "16px",
                    fontFamily: '"Open Sans", sans-serif',
                    fontSmoothing: "antialiased",
                  },
                  invalid: {
                    color: "red",
                    ":focus": {
                      color: "#303238",
                    },
                  },
                },
              }}
            />
          </div>
          <button
            type="submit"
            className="btn m-5"
            disabled={!stripe || loading}
          >
            Save Card
          </button>
        </form>
      ) : (
        <div class="bg-blue-200 p-4 rounded-md shadow-md">
          <p class="text-lg font-semibold text-blue-700">Your Payment Method</p>
          <p class="text-sm text-gray-600 mt-2">
            You have already added the payment method ending with the{" "}
            <span class="text-blue-500 font-semibold">
              digit {customerCard.data[0].card.last4}
            </span>
            .
          </p>
          <button class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
            Edit Payment Method
          </button>
        </div>
      )}
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default StripeForm;
