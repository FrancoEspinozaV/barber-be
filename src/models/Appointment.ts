import mongoose, { Document, Schema } from 'mongoose'
import Barber from './Barber'

type BarberID = mongoose.Schema.Types.ObjectId
type UserID = mongoose.Schema.Types.ObjectId
type State = 'available' | 'accepted' | 'canceled'
export interface IAppointment extends Document {
  barberID: BarberID
  date: number
  userID: UserID
  state: State
}

const AppointmentSchema: Schema = new Schema({
  barberID: {
    type: Schema.Types.ObjectId,
    ref: 'Barber',
    required: true,
    index: true,
  },
  date: {
    type: Number,
    required: true,
    index: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  state: {
    type: {
      type: String,
      enum: ['available', 'accepted', 'canceled'],
      default: 'available',
    },
    required: true,
    index: true,
  },
})

AppointmentSchema.index({ date: 1, state: 1 })
AppointmentSchema.index({ date: 1, state: 1, BarberID: 1 })
AppointmentSchema.index({ date: 1, state: 1, userID: 1 })
AppointmentSchema.index({ date: 1, state: 1, userID: 1, barberID: 1 })

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema)
