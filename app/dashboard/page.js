'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function Dashboard() {
  const router = useRouter()
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('pets')
  const [myPets, setMyPets] = useState([])
  const [bookings, setBookings] = useState([])
  const [sentBookings, setSentBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    if (!user) return
    loadData()
  }, [user])

  const loadData = () => {
    if (!user) return
    Promise.all([
      fetch('/api/pets').then(r => r.json()),
      fetch(`/api/bookings?userId=${user.id}&type=received`).then(r => r.json()),
      fetch(`/api/bookings?userId=${user.id}&type=sent`).then(r => r.json()),
    ]).then(([petsData, bookingsData, sentData]) => {
      setMyPets((petsData.pets || []).filter(p => p.ownerId === user.id))
      setBookings(bookingsData.bookings || [])
      setSentBookings(sentData.bookings || [])
      setLoading(false)
    })
  }

  const updateBooking = async (bookingId, status) => {
    setUpdating(bookingId)
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (data.success) {
        setBookings(prev => prev.map(b =>
          b._id === bookingId ? { ...b, status } : b
        ))
      }
    } catch (err) {
      alert('Error updating booking: ' + err.message)
    }
    setUpdating(null)
  }

  const statusColor = (status) => {
    if (status === 'confirmed') return '#1D9E75'
    if (status === 'rejected') return '#e53e3e'
    return '#BA7517'
  }

  const statusBg = (status) => {
    if (status === 'confirmed') return '#E1F5EE'
    if (status === 'rejected') return '#FFF5F5'
    return '#FAEEDA'
  }

  if (!user) return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <p style={{ color: '#666', fontSize: '16px' }}>Please sign in to view your dashboard</p>
        <button onClick={() => router.push('/')}
          style={{ marginTop: '16px', padding: '12px 28px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white', border: 'none', borderRadius: '50px',
            fontSize: '15px', cursor: 'pointer' }}>
          Go Home
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f8f8fc',
      minHeight: '100vh', paddingTop: '80px' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '16px', marginBottom: '8px' }}>
          {user.imageUrl && (
            <img src={user.imageUrl} alt={user.firstName}
              style={{ width: '56px', height: '56px', borderRadius: '50%',
                border: '3px solid white', objectFit: 'cover' }} />
          )}
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '800', margin: 0 }}>
              Hey {user.firstName}! 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '14px' }}>
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center',
          flexWrap: 'wrap', marginTop: '24px' }}>
          {[
            { num: myPets.length, label: 'My Pets' },
            { num: bookings.length, label: 'Requests Received' },
            { num: bookings.filter(b => b.status === 'pending').length, label: 'Pending' },
            { num: bookings.filter(b => b.status === 'confirmed').length, label: 'Confirmed' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)', borderRadius: '16px',
              padding: '16px 24px', textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>{stat.num}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', padding: '0 20px',
        display: 'flex', justifyContent: 'center',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        position: 'sticky', top: '64px', zIndex: 100 }}>
        {[
          { id: 'pets', label: '🐾 My Pets' },
          { id: 'requests', label: `📬 Requests ${bookings.filter(b => b.status === 'pending').length > 0 ? `(${bookings.filter(b => b.status === 'pending').length})` : ''}` },
          { id: 'bookings', label: '📅 My Bookings' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '16px 24px', border: 'none', background: 'transparent',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              color: activeTab === tab.id ? '#764ba2' : '#888',
              borderBottom: activeTab === tab.id ? '2px solid #764ba2' : '2px solid transparent',
              transition: 'all 0.2s'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 20px 60px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐾</div>
            <p style={{ color: '#666' }}>Loading your dashboard...</p>
          </div>
        )}

        {/* My Pets Tab */}
        {!loading && activeTab === 'pets' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>
                Your Listed Pets
              </h2>
              <button onClick={() => router.push('/addpet')}
                style={{ padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white', border: 'none', borderRadius: '50px',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                + Add New Pet
              </button>
            </div>
            {myPets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px',
                background: 'white', borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐾</div>
                <h3 style={{ color: '#333', marginBottom: '8px' }}>No pets listed yet!</h3>
                <p style={{ color: '#888', marginBottom: '24px' }}>
                  Add your first pet and start connecting with animal lovers
                </p>
                <button onClick={() => router.push('/addpet')}
                  style={{ padding: '14px 32px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white', border: 'none', borderRadius: '50px',
                    fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                  List Your Pet 🐾
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                {myPets.map(pet => (
                  <div key={pet._id} style={{ background: 'white', borderRadius: '16px',
                    overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <div style={{ height: '160px', position: 'relative' }}>
                      {pet.img ? (
                        <img src={pet.img} alt={pet.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: '#f0eeff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                          {pet.type === 'Dog' ? '🐶' : pet.type === 'Cat' ? '🐱' : '🐾'}
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: '10px', left: '10px',
                        background: pet.available ? '#1D9E75' : '#999',
                        color: 'white', fontSize: '11px', fontWeight: '600',
                        padding: '3px 10px', borderRadius: '99px' }}>
                        {pet.available ? '● Available' : '● Busy'}
                      </div>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '700' }}>{pet.name}</h3>
                      <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#888' }}>
                        {pet.breed} • {pet.age} • ₹{pet.price}/hr
                      </p>
                      <button onClick={() => router.push(`/listings/${pet._id}`)}
                        style={{ width: '100%', padding: '10px',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          color: 'white', border: 'none', borderRadius: '10px',
                          fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                        View Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Booking Requests Tab */}
        {!loading && activeTab === 'requests' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e', marginBottom: '20px' }}>
              Booking Requests for Your Pets
            </h2>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px',
                background: 'white', borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
                <h3 style={{ color: '#333', marginBottom: '8px' }}>No booking requests yet</h3>
                <p style={{ color: '#888' }}>When someone books your pet it will show up here</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bookings.map(booking => (
                  <div key={booking._id} style={{ background: 'white', borderRadius: '16px',
                    padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      {booking.petImg && (
                        <img src={booking.petImg} alt={booking.petName}
                          style={{ width: '64px', height: '64px', borderRadius: '12px',
                            objectFit: 'cover', flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between',
                          alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700' }}>
                              {booking.bookerName} wants to meet {booking.petName}
                            </h3>
                            <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
                              📅 {booking.date} at {booking.time} • ₹{booking.price}
                            </p>
                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#999' }}>
                              📧 {booking.bookerEmail}
                            </p>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px',
                            borderRadius: '99px', background: statusBg(booking.status),
                            color: statusColor(booking.status), flexShrink: 0 }}>
                            {booking.status?.toUpperCase()}
                          </span>
                        </div>

                        {booking.message && (
                          <p style={{ fontSize: '13px', color: '#555', background: '#f8f8fc',
                            padding: '10px 14px', borderRadius: '8px', margin: '12px 0',
                            fontStyle: 'italic' }}>
                            "{booking.message}"
                          </p>
                        )}

                        {/* Accept / Reject buttons — only show if pending */}
                        {booking.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                            <button
                              onClick={() => updateBooking(booking._id, 'confirmed')}
                              disabled={updating === booking._id}
                              style={{ flex: 1, padding: '10px 16px',
                                background: updating === booking._id ? '#ccc' : 'linear-gradient(135deg, #1D9E75, #43b89c)',
                                color: 'white', border: 'none', borderRadius: '10px',
                                fontSize: '14px', fontWeight: '600', cursor: updating === booking._id ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s' }}>
                              {updating === booking._id ? 'Updating...' : '✅ Accept'}
                            </button>
                            <button
                              onClick={() => updateBooking(booking._id, 'rejected')}
                              disabled={updating === booking._id}
                              style={{ flex: 1, padding: '10px 16px',
                                background: updating === booking._id ? '#ccc' : '#fff',
                                color: '#e53e3e', border: '1.5px solid #e53e3e',
                                borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                                cursor: updating === booking._id ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s' }}>
                              {updating === booking._id ? 'Updating...' : '❌ Reject'}
                            </button>
                          </div>
                        )}

                        {booking.status === 'confirmed' && (
                          <div style={{ marginTop: '12px', padding: '10px 14px',
                            background: '#E1F5EE', borderRadius: '10px',
                            fontSize: '13px', color: '#085041', fontWeight: '500' }}>
                            ✅ You confirmed this booking! The session is on {booking.date} at {booking.time}.
                          </div>
                        )}

                        {booking.status === 'rejected' && (
                          <div style={{ marginTop: '12px', padding: '10px 14px',
                            background: '#FFF5F5', borderRadius: '10px',
                            fontSize: '13px', color: '#e53e3e', fontWeight: '500' }}>
                            ❌ You rejected this booking request.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Bookings Tab */}
        {!loading && activeTab === 'bookings' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e', marginBottom: '20px' }}>
              Sessions You've Booked
            </h2>
            {sentBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px',
                background: 'white', borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                <h3 style={{ color: '#333', marginBottom: '8px' }}>No bookings yet</h3>
                <p style={{ color: '#888', marginBottom: '24px' }}>
                  Find a pet you love and book a session!
                </p>
                <button onClick={() => router.push('/listings')}
                  style={{ padding: '14px 32px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white', border: 'none', borderRadius: '50px',
                    fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                  Browse Pets 🐾
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sentBookings.map(booking => (
                  <div key={booking._id} style={{ background: 'white', borderRadius: '16px',
                    padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {booking.petImg && (
                      <img src={booking.petImg} alt={booking.petName}
                        style={{ width: '64px', height: '64px', borderRadius: '12px',
                          objectFit: 'cover', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700' }}>
                            Session with {booking.petName}
                          </h3>
                          <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
                            Owner: {booking.ownerName}
                          </p>
                          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>
                            📅 {booking.date} at {booking.time} • ₹{booking.price}
                          </p>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px',
                          borderRadius: '99px', background: statusBg(booking.status),
                          color: statusColor(booking.status) }}>
                          {booking.status?.toUpperCase()}
                        </span>
                      </div>
                      {booking.status === 'confirmed' && (
                        <div style={{ marginTop: '8px', padding: '10px 14px',
                          background: '#E1F5EE', borderRadius: '10px',
                          fontSize: '13px', color: '#085041', fontWeight: '500' }}>
                          🎉 Booking confirmed! See you on {booking.date} at {booking.time}!
                        </div>
                      )}
                      {booking.status === 'rejected' && (
                        <div style={{ marginTop: '8px', padding: '10px 14px',
                          background: '#FFF5F5', borderRadius: '10px',
                          fontSize: '13px', color: '#e53e3e' }}>
                          This booking was not accepted. Try booking a different time!
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}