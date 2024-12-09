import mongoose, { Document, Schema } from 'mongoose'

type BarberID = mongoose.Schema.Types.ObjectId
type UserID = mongoose.Schema.Types.ObjectId
type State = 'available' | 'accepted' | 'canceled'
export interface IAppointment extends Document {
  barberID: BarberID
  date: Date
  userID: UserID
  state: State
}

const AppointmentSchema: Schema = new Schema({
  barberID: {
    type: Schema.Types.ObjectId,
    ref: 'Barber',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  state: {
    type: {
      type: String,
      enum: ['available', 'accepted', 'canceled'],
      default: 'available',
    },
    required: true,
  },
})

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema)
