import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const BookingSchema = new mongoose.Schema({
  petId: String, petName: String, petImg: String,
  ownerId: String, ownerName: String, ownerEmail: String,
  bookerName: String, bookerEmail: String, bookerId: String,
  date: String, time: String, message: String, price: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
})

const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema)

async function connect() {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(process.env.MONGODB_URI)
}

export async function PATCH(request, { params }) {
  try {
    await connect()
    const { id } = await params
    const { status } = await request.json()
    await Booking.findByIdAndUpdate(id, { status })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}