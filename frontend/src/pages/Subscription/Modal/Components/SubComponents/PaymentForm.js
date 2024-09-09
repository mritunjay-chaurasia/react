import React, { useState } from "react";
import Button from "@mui/material/Button";
import { showNotification } from "../../../../../utils/notification";
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import * as StripeApi from '../../../../../api/stripe.api';
import { getCurrentUser } from "../../../../../store/user/actions";
// import * as AuthApi from '../../../../../../APIs/auth.api';

function CardInputWrapper({ children }) {
  const cardElementStyle = {
    height: "56px",
    borderRadius: "4px",
    padding: "0 10px",
    border: "1px solid lightgrey",
    background: "#FFFFFF",
    // boxShadow: 'inset 0px 6px 8px #EEF5FA',
    color: "#2F3F4C",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    margin: "5px 0 15px 0",
    ":hover": {
      border: "1px solid black",
    },
  };
  return <div style={cardElementStyle}>{children}</div>;
}

const PaymentForm = ({ handleClose, selectedPlan }) => {
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [postalCode, setPostalCode] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const { userInfo } = useSelector(state => state.user);
  const dispatch = useDispatch()

  const CARD_ELEMENT_OPTIONS = {
    // For more styling details, see https://stripe.com/docs/js/appendix/style
    style: {
      base: {
        iconColor: "#c4f0ff",
        color: "#000",
        fontWeight: "500",
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        fontSize: "18px",
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "#e0e0e0",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };



  async function checkCardAndAddCardToCustomer(cardElement, data, payload) {

    //adding card to customer's strip.id
    let result_card = await StripeApi.addCustomerCard({
      token_id: payload.token.id,
      price_id: selectedPlan.price.id,
      product_id: selectedPlan.id
    })
    console.log('addCardForm handleSubmit createCustomerStripe 4', { result_card })

    if (result_card['error'] != undefined) {
      setPaymentLoading(false)
      showNotification("error", result_card['error']['message'])
    } else {
      showNotification("success", "Card details has been saved.")
      // Making the new card as default card
      setPaymentLoading(false);
      dispatch(getCurrentUser());
      handleClose()
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (postalCode.trim() === "") return setPaymentError("Enter Postal Code");
      if (!stripe || !elements) return;
      setPaymentLoading(true);

      // Check if the customer already exists
      let response = {
        exists: false
      }
      const cardElement = elements.getElement(CardNumberElement);
      var dataToStripe = {}
      dataToStripe['metadata'] = { zip: postalCode }

      stripe.createToken(cardElement, dataToStripe).then(
        async (payload) => {
          console.log('payload>>>>>>>>>>>>>>>>>>>>', payload)
          if (payload['error']) {
            // setDisableBtn(false)
            setPaymentError(payload['error']['message']);
            setPaymentLoading(false)
            return;
          } else {
            checkCardAndAddCardToCustomer(cardElement, dataToStripe, payload)
          }

        }
      );
    } catch (error) {
      setPaymentLoading(false);
      showNotification("error", "Error", "Something went wrong, Please try again later!")
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
      <label>
        Card number
        <CardInputWrapper>
          <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
        </CardInputWrapper>
      </label>
      <label>
        Expiration date
        <CardInputWrapper>
          <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
        </CardInputWrapper>
      </label>
      <label>
        CVC
        <CardInputWrapper>
          <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
        </CardInputWrapper>
      </label>

      <label>
        Postal Code
        <CardInputWrapper>
          <input
            type="text"
            style={{
              ...CARD_ELEMENT_OPTIONS.style.base,
              border: "none",
              outline: "none",
              "::placeholder": {
                color: "#e0e0e0",
              },
            }}
            placeholder="Postal code"
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </CardInputWrapper>
      </label>

      {paymentError && <div style={{ color: "red" }}>{paymentError}</div>}
      {paymentSuccess && <div style={{ color: "green" }}>{paymentSuccess}</div>}

      <Button className='text-capitalize' variant="contained" type="submit" sx={{ mt: 3 }} disabled={!stripe || paymentLoading}>
        {paymentLoading ? "Loading...." : `Add Card & pay ${selectedPlan.price.unit_amount / 100}`}
      </Button>
    </form>
  );
};

export default PaymentForm;
