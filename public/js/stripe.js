/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe('pk_test_VhJKFk0tyZXeus91EoKmE3UC00RBBIFiZi');

export const bookTour = async tourId => {
  try {
    //get checkout session from endpoint
    const session = await axios(
      //dev
      //`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
      //production
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    //use stripe object to create checkout form & charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
