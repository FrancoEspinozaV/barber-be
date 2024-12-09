import mongoose, { Document, Schema } from "mongoose";

export interface IBarber extends Document {
  name: string;
  phone: string;
  specialty: string;
  createdAt: Date;
}

const BarberSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    default: "General",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IBarber>("Barber", BarberSchema);
