'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const FILTERS = ['All', 'Dogs', 'Cats', 'Available Now', 'Top Rated']

export default function Listings() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState([])
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pets')
      .then(res => res.json())
      .then(data => {
        setPets(data.pets || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const filtered = pets.filter(pet => {
    const matchFilter =
      activeFilter === 'All' ? true :
      activeFilter === 'Dogs' ? pet.type === 'Dog' :
      activeFilter === 'Cats' ? pet.type === 'Cat' :
      activeFilter === 'Available Now' ? pet.available :
      activeFilter === 'Top Rated' ? pet.rating >= 4.8 : true
    const matchSearch = pet.name?.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(search.toLowerCase()) ||
      pet.location?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const toggleSave = (id) => {
    setSaved(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f8f8fc', minHeight: '100vh', paddingTop: '80px' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '48px 20px 64px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', margin: '0 0 8px' }}>
          🐾 Find Pets Near You
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', margin: '0 0 32px' }}>
          Browse verified pets in Bengaluru available for bonding sessions
        </p>
        <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🔍</span>
          <input
            type="text"
            placeholder="Search by pet name, breed or area..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
            style={{
              width: '100%', padding: '16px 16px 16px 48px',
              borderRadius: '50px', border: 'none', fontSize: '15px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: 'white', padding: '16px 20px', display: 'flex', gap: '10px',
        flexWrap: 'wrap', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        position: 'sticky', top: '64px', zIndex: 100 }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            style={{
              padding: '8px 20px', borderRadius: '50px', border: 'none',
              fontSize: '14px', fontWeight: '500', cursor: 'pointer',
              background: activeFilter === f ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f0f0f5',
              color: activeFilter === f ? 'white' : '#555',
              transition: 'all 0.2s',
              boxShadow: activeFilter === f ? '0 4px 15px rgba(102,126,234,0.4)' : 'none'
            }}>
            {f}
          </button>
        ))}
        <button onClick={() => router.push('/addpet')}
          style={{
            padding: '8px 20px', borderRadius: '50px', border: 'none',
            fontSize: '14px', fontWeight: '500', cursor: 'pointer',
            background: 'linear-gradient(135deg, #43b89c, #1D9E75)',
            color: 'white', marginLeft: 'auto',
            boxShadow: '0 4px 15px rgba(29,158,117,0.4)'
          }}>
          + List Your Pet
        </button>
      </div>

      {/* Results count */}
      <div style={{ maxWidth: '1200px', margin: '24px auto 16px', padding: '0 20px' }}>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          {loading ? 'Loading pets...' : `Showing ${filtered.length} pets near Bengaluru`}
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐾</div>
          <p style={{ fontSize: '18px' }}>Finding pets near you...</p>
        </div>
      )}

      {/* Pet Cards Grid */}
      {!loading && (
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px'
        }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: '#999' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐾</div>
              <p style={{ fontSize: '18px' }}>No pets listed yet!</p>
              <button onClick={() => router.push('/addpet')}
                style={{
                  marginTop: '16px', padding: '14px 32px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white', border: 'none', borderRadius: '50px',
                  fontSize: '15px', fontWeight: '600', cursor: 'pointer'
                }}>
                Be the first to list a pet 🐾
              </button>
            </div>
          ) : filtered.map(pet => (
            <div key={pet._id}
              style={{
                background: 'white', borderRadius: '20px', overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)' }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)' }}
            >
              {/* Pet Image */}
              <div style={{ position: 'relative', height: '220px', background: '#f0eeff' }}>
                {pet.img ? (
                  <img src={pet.img} alt={pet.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
                    {pet.type === 'Dog' ? '🐶' : pet.type === 'Cat' ? '🐱' : pet.type === 'Bird' ? '🐦' : pet.type === 'Rabbit' ? '🐰' : '🐾'}
                  </div>
                )}
                <button onClick={(e) => { e.stopPropagation(); toggleSave(pet._id) }}
                  style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'white', border: 'none', borderRadius: '50%',
                    width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                  {saved.includes(pet._id) ? '❤️' : '🤍'}
                </button>
                <div style={{
                  position: 'absolute', top: '12px', left: '12px',
                  background: pet.available ? '#1D9E75' : '#999',
                  color: 'white', fontSize: '11px', fontWeight: '600',
                  padding: '4px 10px', borderRadius: '99px'
                }}>
                  {pet.available ? '● Available' : '● Busy'}
                </div>
                <div style={{
                  position: 'absolute', bottom: '12px', left: '12px',
                  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                  color: 'white', fontSize: '12px', padding: '4px 10px', borderRadius: '99px'
                }}>
                  {pet.type === 'Dog' ? '🐶' : pet.type === 'Cat' ? '🐱' : '🐾'} {pet.breed}
                </div>
              </div>

              {/* Pet Info */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '700', color: '#1a1a2e' }}>{pet.name}</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{pet.age} • {pet.location}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#764ba2' }}>
                      ₹{pet.price}/hour
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>⭐ New listing</div>
                  </div>
                </div>

                {pet.tags && pet.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {pet.tags.map((tag, i) => (
                      <span key={i} style={{
                        fontSize: '11px', padding: '4px 10px', borderRadius: '99px',
                        background: '#f0eeff', color: '#764ba2', fontWeight: '500'
                      }}>{tag}</span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px',
                  padding: '10px', background: '#fafafa', borderRadius: '10px' }}>
                  {pet.ownerImg ? (
                    <img src={pet.ownerImg} alt={pet.ownerName}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%',
                      background: '#667eea', color: 'white', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700' }}>
                      {pet.ownerName?.charAt(0) || 'O'}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '12px', color: '#999' }}>Owner</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{pet.ownerName}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#888' }}>📍 {pet.location}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => router.push(`/listings/${pet._id}`)}
                    style={{
                      flex: 1, padding: '12px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white', border: 'none', borderRadius: '12px',
                      fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                    }}>
                    View & Book
                  </button>
                  <button style={{
                    padding: '12px 16px', background: '#f0eeff', color: '#764ba2',
                    border: 'none', borderRadius: '12px', fontSize: '14px', cursor: 'pointer'
                  }}>
                    💬
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}