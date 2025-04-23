import mongoose from "mongoose";

/**
 * Booking Schema
 * Represents an appointment booked by a user with a doctor.
 */
const bookingSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketPrice: {
      type: Number, // Changed from String to Number
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    symptoms: {
      type: String, // ✅ Add this
      default: "Not specified",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", bookingSchema);
