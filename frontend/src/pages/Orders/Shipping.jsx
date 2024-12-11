import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

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

  const InputField = ({ label, type, value, onChange, placeholder }) => (
    <div className="relative group">
      <label className="block text-zinc-950 font-extrabold text-sm mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-4 py-3 rounded-lg bg-violet-200/90 border-2 border-pink-400 
          text-zinc-950 font-extrabold placeholder-zinc-900/50
          focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 
          hover:border-yellow-300 transition-all duration-300"
      />
    </div>
  );

  return (
    <div className="min-h-screen 
      font-mono py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <ProgressSteps step1 step2 />
        </div>

        <div className="bg-violet-200/90 backdrop-blur-md rounded-2xl border-2 border-pink-400 
          shadow-xl p-8 hover:border-yellow-300 hover:shadow-pink-300/30 transition-all duration-500">
          <h1 className="text-3xl font-extrabold text-zinc-950 mb-8 text-center">
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
            <div className="mt-8 p-6 bg-violet-200/90 rounded-lg border-2 border-pink-400 
              hover:border-yellow-300 transition-all duration-300">
              <label className="block text-zinc-950 font-extrabold text-sm mb-4">
                Payment Method
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 rounded-lg 
                  hover:bg-violet-300/50 transition-all duration-300 cursor-pointer 
                  border-2 border-transparent hover:border-pink-400">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-purple-900 border-pink-400 
                      focus:ring-purple-900 focus:ring-offset-violet-200"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === "PayPal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="text-zinc-950 font-extrabold">PayPal or Credit Card</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full py-4 px-6 mt-8 bg-gradient-to-r from-purple-900 to-indigo-900 
                text-white font-bold rounded-xl shadow-lg 
                border-2 border-pink-400 hover:border-yellow-300 
                focus:outline-none focus:ring-2 focus:ring-pink-500/50 
                hover:shadow-pink-300/30 hover:scale-105 
                transition-all duration-300
                relative group overflow-hidden"
              type="submit"
            >
              <span className="relative z-10">Continue to Order Summary</span>
              <div className="absolute inset-0 -z-10 bg-pink-500/20 blur-xl 
                opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;