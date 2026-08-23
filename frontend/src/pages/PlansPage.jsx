import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import PlanCard from "../components/PlanCard";

const PlansPage = () => {
  const [processingPlan, setProcessingPlan] = useState(null);
  const [seatNumber, setSeatNumber] = useState(null);
  const [gender, setGender] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSeat = localStorage.getItem('selectedSeat');
    const storedGender = localStorage.getItem('selectedGender');

    if (!storedSeat || !storedGender) {
      toast.warning('Please select a seat first');
      navigate('/seating-plan');
      return;
    }
    setSeatNumber(parseInt(storedSeat));
    setGender(storedGender);
  }, [navigate]);

  const Plans = [
    { name: "1-month", price: 299, features: ["24/7 Access", "High-Speed Wi-Fi"] },
    { name: "3-month", price: 899, features: ["24/7 Access", "High-Speed Wi-Fi", "Doubt-solving support"], popular: true },
    { name: "6-month", price: 1799, features: ["24/7 Access", "High-Speed Wi-Fi", "Doubt-solving support"] },
    { name: "12-month", price: 3599, features: ["24/7 Access", "High-Speed Wi-Fi", "Doubt-solving support"] },
  ];

  const handlePayment = async (plan) => {
    if (!seatNumber || !gender) {
      toast.error('Seat information missing. Please select a seat again.');
      navigate('/seating-plan');
      return;
    }

    setProcessingPlan(plan.name);

    try {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RJ9822BQyQkn5b';

      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const {
        data: { data: order },
      } = await axios.post("/api/payments/orders", { plan: plan.name, seatNumber, gender }, config);

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Digital Library",
        description: `Payment for ${plan.name} Subscription`,
        order_id: order.id,
        handler: async function (response) {
          await axios.post(
            "/api/payments/verify",
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan: plan.name, seatNumber, gender,
            },
            config
          );

          localStorage.removeItem('selectedSeat');
          localStorage.removeItem('selectedGender');

          toast.success(`Subscription purchased! Seat ${seatNumber} is now yours!`);
          window.location.href = "/dashboard";
        },
        prefill: { name: userInfo.name, email: userInfo.email },
        theme: { color: "#5b21d6" },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();

      rzp1.on('payment.failed', function () {
        toast.error('Payment failed or was cancelled.');
        setProcessingPlan(null);
      });
    } catch (error) {
      console.error('Payment Error', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        if (error.response.data.message.toLowerCase().includes('seat')) {
          navigate('/seating-plan');
        }
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } finally {
      setProcessingPlan(null);
    }
  };

  if (!seatNumber || !gender) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f2f0ff,_#f7f6fb_55%)]">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="surface-card inline-flex items-center gap-3 p-4 mb-8 mx-auto flex-col text-center w-full max-w-md">
          <p className="text-brand-700 font-semibold">
            🪑 Seat {seatNumber} selected · {gender === 'male' ? '🚹 Male' : '🚺 Female'}
          </p>
          <button onClick={() => navigate('/seating-plan')} className="text-brand-600 hover:text-brand-700 hover:underline text-sm">
            Change seat
          </button>
        </div>

        <h1 className="text-4xl font-display font-extrabold text-center text-gray-900 mb-2">
          Choose your plan
        </h1>
        <p className="text-center text-gray-500 mb-10">Pick a subscription that fits your study schedule.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto pt-2">
          {Plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              onSubscribe={handlePayment}
              processingPlan={processingPlan}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PlansPage;
