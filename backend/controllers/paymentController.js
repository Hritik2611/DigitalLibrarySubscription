const Razorpay = require("razorpay");
const crypto = require("crypto");
const Subscription = require("../models/subscriptionModel");
const Seat = require("../models/seatModel");
const sendEmail = require("../utils/emailService");
const { error } = require("console");
//const { default: orders } = require('razorpay/dist/types/orders');

const prices = {
  "1-month": 299,
  "3-month": 899,
  "6-month": 1799,
  "12-month": 3599,
};

//create order
const createPaymentOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { plan, seatNumber, gender } = req.body;

    if (!seatNumber || !gender) {
      return res
        .status(400)
        .json({
          message:
            "Please select a seat and gender before proceeding to payment",
        });
    }
    const seat = await Seat.findOne({ seatNumber });
    if (!seat || seat.status !== "available") {
      return res
        .status(400)
        .json({
          message:
            "Selected seat is no longer available. Please select another seat.",
        });
    }

    const amount = prices[plan] * 100; //amount in paise

    const options = {
      amount: amount,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Somthing went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
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

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
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

        const startDate = new Date();
        const endDate = new Date();
        switch (plan) {
          case "1-month":
            endDate.setMonth(startDate.getMonth() + 1);
            break;
          case "3-month":
            endDate.setMonth(startDate.getMonth() + 3);
            break;
          case "6-month":
            endDate.setMonth(startDate.getMonth() + 6);
            break;
          case "12-month":
            endDate.setMonth(startDate.getMonth() + 12);
            break;
        }
        seat.expiresAt = newEndDate;
        await seat.save();

        existingSubscription.status = "expired";
        await existingSubscription.save();
      } else {
        finalSeatNumber = seatNumber;
        seat = await Seat.findOne({ seatNumber: finalSeatNumber });

        if (!seat || seat.status !== "available") {
          return res
            .status(400)
            .json({ message: "Slected seat is no longler available" });
        }
        seat.status = "booked";
        seat.bookedBy = req.user._id;
        seat.bookedByGender = gender;
        seat.bookeAt = new Date();
      }

      const startDate = new Date();
      const endDate = new Date();

      switch (plan) {
        case "1-month":
          endDate.setMonth(startDate.getMonth() + 1);
          break;
        case "3-month":
          endDate.setMonth(startDate.getMonth() + 3);
          break;
        case "6-month":
          endDate.setMonth(startDate.getMonth() + 6);
          break;
        case "12-month":
          endDate.setMonth(startDate.getMonth() + 12);
          break;
      }

      const subscription = await Subscription.create({
        user: req.user._id,
        plan,
        startDate,
        endDate,
        status: "active",
        paymentId: razorpay_payment_id,
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
      return res
        .status(200)
        .json({
          message: "payment verified successfully",
          seatNumber: finalSeatNumber,
        });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = { createPaymentOrder, verifyPayment };
