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

    if(!storedSeat || !storedGender) {
      toast.warning('Please select a seat first');
      navigate('/seating-plan');
      return;
    }
    setSeatNumber(parseInt(storedSeat));
    setGender(storedGender);
  }, [navigate]);

  const Plans = [
    {
      name: "1-month",
      price: 299,
      features: ["24/7 Access", "High-Speed Wi-Fi"],
    },
    {
      name: "3-month",
      price: 899,
      features: ["24/7 Access", "High-Speed Wi-Fi", "Doubt-solving support"],
    },
    {
      name: "6-month",
      price: 1799,
      features: ["24/7 Access", "High-Speed Wi-Fi", "Doubt-solving support"],
    },
    {
      name: "12-month",
      price: 3599,
      features: ["24/7 Access", "High-Speed Wi-Fi", "Doubt-solving support"],
    },
  ];

  const handlePayment = async (plan) => {

    if(!seatNumber || !gender) {
      toast.error('Seat information missing. Please select a seat again.');
      navigate('/seating-plan');
      return;
    }

    setProcessingPlan(plan.name);

    try {
        //actul razorpay key
      const razorpayKey = 'rzp_test_RJ9822BQyQkn5b';

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
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: { color: "#3399cc" },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();

      rzp1.on('payment.failed', function (response) {
        toast.error('payment failed or was cancelled.');
        setProcessingPlan(null);
      });
    } catch (error) {
      console.error('Payment Error', error);
      if (error.response?.data?.message){
        toast.error(error.response.data.message);
        if(error.response.data.message.includes('seat')) {
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
    <div className="bg-gray-100 min-h-screen">
      <Header/>
      <main className="container mx-auto px-6 py-12">
           <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 max-w-2xl mx-auto text-center">
           <p className="text-blue-800 font-semibold">
         🪑 Seat {seatNumber} Selected | Gender: {gender === 'male' ? '🚹 Male' : '🚺 Female'}
           </p>
           <button onClick={() => navigate('/seating-plan')} className="text-blue-600 hover:underline text-sm mt-2">
            change Seat
           </button>
           </div>

           <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            choose your plan
           </h1>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
