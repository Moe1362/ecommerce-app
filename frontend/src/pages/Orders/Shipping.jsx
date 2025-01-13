import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const InputField = ({ label, type, value, onChange, placeholder }) => (
  <div className="relative group">
    <label className="block text-zinc-400 font-medium text-sm mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 
        text-white placeholder-zinc-500
        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 
        hover:border-emerald-500/30 transition-all duration-300"
    />
  </div>
);

const PaymentMethodRadio = ({ value, checked, onChange, label }) => (
  <label className="flex items-center space-x-3 p-4 rounded-xl 
    hover:bg-white/5 transition-all duration-300 cursor-pointer 
    border border-transparent hover:border-emerald-500/30">
    <input
      type="radio"
      className="form-radio h-5 w-5 text-emerald-500 border-zinc-700 
        focus:ring-emerald-500 focus:ring-offset-zinc-900"
      name="paymentMethod"
      value={value}
      checked={checked}
      onChange={onChange}
    />
    <span className="text-white">{label}</span>
  </label>
);

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="mb-8">
          <ProgressSteps step1 step2 />
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800 
          shadow-xl p-8 hover:border-emerald-500/30 transition-all duration-300">
          <h1 className="text-3xl font-medium text-white mb-8 text-center">
            Shipping Details
          </h1>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-6">
              <InputField
                label="Street Address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your street address"
              />

              <InputField
                label="City"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
              />

              <InputField
                label="Postal Code"
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Enter postal code"
              />

              <InputField
                label="Country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter your country"
              />
            </div>

            {/* Payment Method Section */}
            <div className="mt-8 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800 
              hover:border-emerald-500/30 transition-all duration-300">
              <label className="block text-zinc-400 font-medium text-sm mb-4">
                Payment Method
              </label>
              <div className="space-y-3">
                <PaymentMethodRadio
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="PayPal or Credit Card"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full py-4 px-6 mt-8 bg-gradient-to-r from-emerald-500 to-sky-500 
                text-white font-medium rounded-xl shadow-lg transition-all duration-300
                hover:shadow-emerald-500/20 hover:scale-[1.02] relative group overflow-hidden"
              type="submit"
            >
              <span className="relative z-10">Continue to Order Summary</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-sky-600 
                opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;