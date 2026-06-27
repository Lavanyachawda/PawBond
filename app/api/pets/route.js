import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

const PetSchema = new mongoose.Schema({
  name: String, type: String, breed: String, age: String,
  location: String, price: String, description: String,
  tags: [String], phone: String, available: Boolean,
  ownerName: String, ownerEmail: String, ownerId: String,
  ownerImg: String, img: String, rating: Number, reviews: Array,
  createdAt: { type: Date, default: Date.now }
})

const Pet = mongoose.models.Pet || mongoose.model('Pet', PetSchema)

async function connect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      ssl: true,
      tls: true,
      tlsInsecure: true,
    })
  }
}

export async function POST(request) {
  try {
    await connect()
    const body = await request.json()
    const pet = await Pet.create({ ...body, rating: 0, reviews: [] })
    return NextResponse.json({ success: true, id: pet._id })
  } catch (error) {
    console.error('ERROR:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connect()
    const pets = await Pet.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ pets })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}