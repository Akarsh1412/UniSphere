import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const EventPaymentForm = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });
    if (error) {
      alert(error.message);
      return;
    }
    onPaymentSuccess(paymentIntent.id);
  };

  return (
    <form onSubmit={handleStripeSubmit}>
      <PaymentElement />
      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors mt-4">
        Pay & Register
      </button>
    </form>
  );
};

export default EventPaymentForm;
