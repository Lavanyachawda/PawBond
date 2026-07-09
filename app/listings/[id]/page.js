'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function PetProfile() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [bookingDone, setBookingDone] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/pets')
      .then(res => res.json())
      .then(data => {
        const found = data.pets?.find(p => p._id === id)
        setPet(found)
        setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      paddingTop: '80px', background: '#f8f8fc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐾</div>
        <p style={{ color: '#666' }}>Loading pet profile...</p>
      </div>
    </div>
  )

  if (!pet) return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      paddingTop: '80px', background: '#f8f8fc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>😿</div>
        <h2 style={{ color: '#333' }}>Pet not found!</h2>
        <button onClick={() => router.push('/listings')}
          style={{ marginTop: '16px', padding: '12px 28px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white', border: 'none', borderRadius: '50px',
            fontSize: '15px', cursor: 'pointer' }}>
          Back to Listings
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f8f8fc',
      minHeight: '100vh', paddingTop: '80px' }}>

      {/* Hero image */}
      <div style={{ position: 'relative', height: '400px', background: '#1a1a2e' }}>
        {pet.img ? (
          <img src={pet.img} alt={pet.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '100px' }}>
            {pet.type === 'Dog' ? '🐶' : pet.type === 'Cat' ? '🐱' : '🐾'}
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />

        {/* Back button */}
        <button onClick={() => router.push('/listings')}
          style={{ position: 'absolute', top: '20px', left: '20px',
            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)', color: 'white',
            padding: '8px 16px', borderRadius: '50px', cursor: 'pointer',
            fontSize: '14px', fontWeight: '500' }}>
          ← Back
        </button>

        {/* Pet name overlay */}
        <div style={{ position: 'absolute', bottom: '24px', left: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ background: pet.available ? '#1D9E75' : '#999',
              color: 'white', fontSize: '12px', fontWeight: '600',
              padding: '4px 12px', borderRadius: '99px' }}>
              {pet.available ? '● Available Now' : '● Not Available'}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
              color: 'white', fontSize: '12px', padding: '4px 12px', borderRadius: '99px' }}>
              {pet.type === 'Dog' ? '🐶' : pet.type === 'Cat' ? '🐱' : '🐾'} {pet.breed}
            </span>
          </div>
          <h1 style={{ color: 'white', fontSize: '42px', fontWeight: '800',
            margin: '0 0 4px', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
            {pet.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '16px' }}>
            {pet.age} • {pet.location}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>

          {/* Left side — pet details */}
          <div>
            {/* Price & rating */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '20px 28px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#764ba2' }}>
                  ₹{pet.price}
                </div>
                <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>per hour</div>
              </div>
              <div style={{ background: 'white', borderRadius: '16px', padding: '20px 28px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#f59e0b' }}>⭐</div>
                <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>New listing</div>
              </div>
              <div style={{ background: 'white', borderRadius: '16px', padding: '20px 28px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#1D9E75' }}>
                  {pet.type === 'Dog' ? '🐶' : pet.type === 'Cat' ? '🐱' : '🐾'}
                </div>
                <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{pet.type}</div>
              </div>
            </div>

            {/* About */}
            {pet.description && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e',
                  margin: '0 0 12px' }}>About {pet.name}</h3>
                <p style={{ color: '#555', lineHeight: '1.7', margin: 0, fontSize: '15px' }}>
                  {pet.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {pet.tags && pet.tags.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e',
                  margin: '0 0 16px' }}>Personality & Traits</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {pet.tags.map((tag, i) => (
                    <span key={i} style={{ padding: '8px 16px', borderRadius: '50px',
                      background: '#f0eeff', color: '#764ba2', fontSize: '14px',
                      fontWeight: '500' }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Owner info */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e',
                margin: '0 0 16px' }}>Meet the Owner</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {pet.ownerImg ? (
                  <img src={pet.ownerImg} alt={pet.ownerName}
                    style={{ width: '60px', height: '60px', borderRadius: '50%',
                      objectFit: 'cover', border: '3px solid #f0eeff' }} />
                ) : (
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '24px', fontWeight: '700' }}>
                    {pet.ownerName?.charAt(0) || 'O'}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e' }}>
                    {pet.ownerName}
                  </div>
                  <div style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
                    📍 {pet.location}
                  </div>
                  {pet.phone && (
                    <div style={{ fontSize: '14px', color: '#888', marginTop: '2px' }}>
                      📞 {pet.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side — booking card */}
          <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
            {bookingDone ? (
              <div style={{ background: 'white', borderRadius: '20px', padding: '32px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.12)', textAlign: 'center' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e',
                  marginBottom: '12px' }}>Booking Request Sent!</h3>
                <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>
                  The owner will review your request and confirm shortly. You'll be notified!
                </p>
                <button onClick={() => router.push('/listings')}
                  style={{ width: '100%', padding: '14px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white', border: 'none', borderRadius: '12px',
                    fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
                  Browse More Pets 🐾
                </button>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '20px', padding: '28px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e',
                  margin: '0 0 20px' }}>Book a Session</h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600',
                    color: '#444', marginBottom: '8px' }}>Pick a Date</label>
                  <input type="date" value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1.5px solid #e5e5e5', fontSize: '14px',
                      outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600',
                    color: '#444', marginBottom: '8px' }}>Pick a Time</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'].map(t => (
                      <button key={t} onClick={() => setSelectedTime(t)}
                        style={{ padding: '8px 4px', borderRadius: '8px', border: 'none',
                          fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                          background: selectedTime === t
                            ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f0f0f5',
                          color: selectedTime === t ? 'white' : '#555',
                          transition: 'all 0.2s' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600',
                    color: '#444', marginBottom: '8px' }}>Message to Owner</label>
                  <textarea
                    placeholder={`Hi! I'd love to spend time with ${pet.name}...`}
                    value={message} onChange={e => setMessage(e.target.value)}
                    rows={3}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1.5px solid #e5e5e5', fontSize: '14px', outline: 'none',
                      resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>

                {/* Price summary */}
                <div style={{ background: '#f8f8fc', borderRadius: '10px',
                  padding: '14px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: '14px', color: '#666', marginBottom: '6px' }}>
                    <span>₹{pet.price} × 1 hour</span>
                    <span>₹{pet.price}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: '15px', fontWeight: '700', color: '#1a1a2e',
                    borderTop: '1px solid #eee', paddingTop: '8px' }}>
                    <span>Total</span>
                    <span>₹{pet.price}</span>
                  </div>
                </div>

                <button
                  onClick={async () => {
  if (!selectedDate || !selectedTime) {
    alert('Please pick a date and time!')
    return
  }
  setBooking(true)
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        petId: pet._id,
        petName: pet.name,
        petImg: pet.img,
        ownerId: pet.ownerId,
        ownerName: pet.ownerName,
        ownerEmail: pet.ownerEmail,
        bookerName: user?.firstName + ' ' + (user?.lastName || ''),
        bookerEmail: user?.emailAddresses[0]?.emailAddress,
        bookerId: user?.id,
        date: selectedDate,
        time: selectedTime,
        message: message,
        price: pet.price,
      })
    })
    const data = await res.json()
    setBooking(false)
    if (data.success) setBookingDone(true)
    else alert('Booking failed: ' + JSON.stringify(data))
  } catch (err) {
    setBooking(false)
    alert('Error: ' + err.message)
  }
}}
                  disabled={booking}
                  style={{ width: '100%', padding: '16px',
                    background: booking ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white', border: 'none', borderRadius: '12px',
                    fontSize: '16px', fontWeight: '700', cursor: booking ? 'not-allowed' : 'pointer',
                    boxShadow: booking ? 'none' : '0 8px 24px rgba(102,126,234,0.4)',
                    transition: 'all 0.2s' }}>
                  {booking ? 'Sending Request...' : `Book ${pet.name} 🐾`}
                </button>

                <p style={{ fontSize: '12px', color: '#999', textAlign: 'center',
                  margin: '12px 0 0' }}>
                  No payment now — the owner confirms first
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}