import React from "react";
import StripeForm from "./stripeForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import LatestRideInvoice from "./latestRideInvoice";

const stripeTestPromise = loadStripe(process.env.REACT_APP_PUBLIC_KEY_STRIPE);

export default function CustomerPayments() {
  return (
    <Elements stripe={stripeTestPromise}>
      <StripeForm />
      <LatestRideInvoice />
    </Elements>
  );
}
