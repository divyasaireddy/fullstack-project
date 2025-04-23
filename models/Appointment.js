import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
});

export default mongoose.model("Appointment", AppointmentSchema);
