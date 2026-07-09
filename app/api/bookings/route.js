import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const BookingSchema = new mongoose.Schema({
  petId: String,
  petName: String,
  petImg: String,
  ownerId: String,
  ownerName: String,
  ownerEmail: String,
  bookerName: String,
  bookerEmail: String,
  bookerId: String,
  date: String,
  time: String,
  message: String,
  price: String,
  status: { type: String, default: 'pending' }, // pending, confirmed, rejected, completed
  createdAt: { type: Date, default: Date.now }
})

const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema)

async function connect() {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(process.env.MONGODB_URI)
}

export async function POST(request) {
  try {
    await connect()
    const body = await request.json()
    const booking = await Booking.create(body)
    return NextResponse.json({ success: true, id: booking._id })
  } catch (error) {
    console.error('BOOKING ERROR:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    await connect()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'sent' or 'received'

    let query = {}
    if (userId && type === 'sent') query = { bookerId: userId }
    if (userId && type === 'received') query = { ownerId: userId }

    const bookings = await Booking.find(query).sort({ createdAt: -1 })
    return NextResponse.json({ bookings })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}