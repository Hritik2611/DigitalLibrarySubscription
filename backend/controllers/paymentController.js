const Razorpay = require("razorpay");
const crypto = require("crypto");
const Subscription = require("../models/subscriptionModel");
const Seat = require("../models/seatModel");
const sendEmail = require("../utils/emailService");

const prices = {
  "1-month": 299,
  "3-month": 899,
  "6-month": 1799,
  "12-month": 3599,
};

const getEndDate = (plan, startDate) => {
  const endDate = new Date(startDate);
  switch (plan) {
    case "1-month":
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case "3-month":
      endDate.setMonth(endDate.getMonth() + 3);
      break;
    case "6-month":
      endDate.setMonth(endDate.getMonth() + 6);
      break;
    case "12-month":
      endDate.setMonth(endDate.getMonth() + 12);
      break;
  }
  return endDate;
};

//create order
const createPaymentOrder = async (req, res) => {
  try {
    const { plan, seatNumber, gender } = req.body;

    if (!plan || !prices[plan]) {
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    if (!seatNumber || !gender) {
      return res.status(400).json({
        message: "Please select a seat and gender before proceeding to payment",
      });
    }

    const seat = await Seat.findOne({ seatNumber });
    if (!seat || seat.status !== "available") {
      return res.status(400).json({
        message: "Selected seat is no longer available. Please select another seat.",
      });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = prices[plan] * 100; //amount in paise

    const options = {
      amount,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

//verify payment and create subscription
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      seatNumber,
      gender,
    } = req.body;

    if (!plan || !prices[plan]) {
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }

    // Cross-check the amount actually paid against the plan being claimed,
    // so a tampered request can't grant a bigger plan than what was paid for.
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const order = await instance.orders.fetch(razorpay_order_id);
    if (!order || order.amount !== prices[plan] * 100) {
      return res.status(400).json({ message: "Payment amount does not match selected plan." });
    }

    const existingSubscription = await Subscription.findOne({
      user: req.user._id,
      status: "active",
      seatNumber: { $ne: null },
    });

    let seat;
    let finalSeatNumber;

    if (existingSubscription) {
      finalSeatNumber = existingSubscription.seatNumber;
      seat = await Seat.findById(existingSubscription.seatId);

      existingSubscription.status = "expired";
      await existingSubscription.save();
    } else {
      finalSeatNumber = seatNumber;
      seat = await Seat.findOne({ seatNumber: finalSeatNumber });

      if (!seat || seat.status !== "available") {
        return res.status(400).json({ message: "Selected seat is no longer available" });
      }
      seat.status = "booked";
      seat.bookedBy = req.user._id;
      seat.bookedByGender = gender;
      seat.bookedAt = new Date();
    }

    const startDate = new Date();
    const endDate = getEndDate(plan, startDate);

    const subscription = await Subscription.create({
      user: req.user._id,
      plan,
      startDate,
      endDate,
      status: "active",
      paymentId: razorpay_payment_id,
      seatNumber: finalSeatNumber,
      seatId: seat._id,
      gender,
    });

    seat.subscription = subscription._id;
    seat.expiresAt = endDate;
    await seat.save();

    //send notification email to Admin
    await sendEmail({
      email: process.env.ADMIN_EMAIL,
      subject: `New Subscription Payment Received!`,
      html: `<h3>Payment Details</h3>
               <p><strong>Student Name:</strong> ${req.user.name}</p>
               <p><strong>Email:</strong> ${req.user.email}</p>
               <p><strong>Plan:</strong> ${plan}</p>
               <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>`,
    });

    return res.status(200).json({
      message: "Payment verified successfully",
      seatNumber: finalSeatNumber,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = { createPaymentOrder, verifyPayment };
