import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String, // Changed from Number for flexible formatting and avoiding leading-zero issues
    },
    photo: {
      type: String, // URL to profile photo
    },
    ticketPrice: {
      type: Number,
      required: false,
    },
    role: {
      type: String,
      default: "doctor",
    },

    specialization: {
      type: String,
    },
    qualifications: [
      {
        type: String,
      },
    ],
    experiences: [
      {
        type: String,
      },
    ],
    bio: {
      type: String,
      maxlength: 150,
    },
    about: {
      type: String,
    },
    timeSlots: [
      {
        type: String,
      },
    ],

    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },

    appointments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Appointment", // Ensure you have this model or rename it to "Booking"
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
