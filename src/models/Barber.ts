import mongoose, { Document, Schema } from 'mongoose'
export interface IBarber extends Document {
  name: string
  phone: string
  specialty: string
  createdAt: number
  uuid: string
}

const BarberSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    index: true,
  },
  specialty: {
    type: String,
    default: 'General',
    index: true,
  },
  createdAt: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
  },
})

BarberSchema.index({ name: 1, phone: 1 })

export default mongoose.model<IBarber>('Barber', BarberSchema)
