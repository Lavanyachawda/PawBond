'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function AddPet() {
  const router = useRouter()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [form, setForm] = useState({
    name: '', type: 'Dog', breed: '', age: '',
    location: '', price: '', description: '',
    tags: '', available: true, phone: '',
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result)
    reader.readAsDataURL(file)
  }

 const uploadPhoto = async () => {
  if (!photoFile) return null
  setUploadingPhoto(true)
  try {
    const formData = new FormData()
    formData.append('file', photoFile)
    formData.append('upload_preset', 'pawbond_preset')
    formData.append('cloud_name', 'dwvstsp0b')

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dwvstsp0b/image/upload',
      { method: 'POST', body: formData }
    )
    const data = await res.json()
    console.log('Cloudinary response:', data)
    setUploadingPhoto(false)
    if (data.secure_url) return data.secure_url
    else {
      alert('Upload failed: ' + JSON.stringify(data))
      return null
    }
  } catch (err) {
    alert('Upload error: ' + err.message)
    setUploadingPhoto(false)
    return null
  }
}

  const handleSubmit = async () => {
    if (!form.name || !form.breed || !form.location || !form.price) {
      alert('Please fill all required fields!')
      return
    }
    setLoading(true)
    try {
      let imgUrl = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80&auto=format&fit=crop'
      if (photoFile) {
        const uploaded = await uploadPhoto()
        if (uploaded) imgUrl = uploaded
      }
      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
          ownerName: user?.firstName + ' ' + (user?.lastName || ''),
          ownerEmail: user?.emailAddresses[0]?.emailAddress,
          ownerId: user?.id,
          ownerImg: user?.imageUrl,
          img: imgUrl,
        })
      })
      const data = await res.json()
      if (data.success) setSubmitted(true)
      else alert('Error: ' + JSON.stringify(data))
    } catch (err) {
      alert('Error: ' + err.message)
    }
    setLoading(false)
  }

  if (submitted) return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh',
      background: '#f8f8fc', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px', paddingTop: '100px' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '60px 40px',
        textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', maxWidth: '400px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a2e', marginBottom: '12px' }}>
          {form.name} is now listed!
        </h2>
        <p style={{ color: '#666', marginBottom: '32px', lineHeight: 1.6 }}>
          Your pet is now visible to pet lovers in Bengaluru!
        </p>
        <button onClick={() => router.push('/listings')}
          style={{ width: '100%', padding: '16px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white', border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
          See All Listings 🐾
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh',
      background: '#f8f8fc', paddingTop: '80px', paddingBottom: '60px' }}>

      <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: '40px 20px', textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '800', margin: '0 0 8px' }}>
          🐾 List Your Pet
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0 }}>
          Share your pet with animal lovers in Bengaluru
        </p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ background: 'white', borderRadius: '24px',
          padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

          {/* Photo Upload */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Pet Photo</label>
            <div
              onClick={() => document.getElementById('photoInput').click()}
              style={{
                width: '100%', height: '200px', borderRadius: '16px',
                border: '2px dashed #d0c8ff', background: '#f8f6ff',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', overflow: 'hidden',
                transition: 'border-color 0.2s'
              }}>
              {photoPreview ? (
                <img src={photoPreview} alt="preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>📷</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#764ba2' }}>
                    Click to upload pet photo
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    JPG, PNG up to 10MB
                  </div>
                </>
              )}
            </div>
            <input id="photoInput" type="file" accept="image/*"
              onChange={handlePhotoChange} style={{ display: 'none' }} />
            {photoPreview && (
              <button onClick={() => { setPhotoFile(null); setPhotoPreview(null) }}
                style={{ marginTop: '8px', fontSize: '12px', color: '#999',
                  background: 'none', border: 'none', cursor: 'pointer' }}>
                Remove photo
              </button>
            )}
          </div>

          {/* Pet Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Pet Name *</label>
            <input placeholder="e.g. Bruno" value={form.name}
              onChange={e => update('name', e.target.value)} style={inputStyle} />
          </div>

          {/* Pet Type */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Pet Type *</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map(type => (
                <button key={type} onClick={() => update('type', type)}
                  style={{
                    padding: '10px 18px', borderRadius: '50px', border: 'none',
                    cursor: 'pointer', fontSize: '14px', fontWeight: '500',
                    background: form.type === type
                      ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f0f0f5',
                    color: form.type === type ? 'white' : '#555',
                    transition: 'all 0.2s'
                  }}>
                  {type === 'Dog' ? '🐶' : type === 'Cat' ? '🐱' :
                   type === 'Bird' ? '🐦' : type === 'Rabbit' ? '🐰' : '🐾'} {type}
                </button>
              ))}
            </div>
          </div>

          {/* Breed & Age */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Breed *</label>
              <input placeholder="e.g. Golden Retriever" value={form.breed}
                onChange={e => update('breed', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Age *</label>
              <input placeholder="e.g. 2 years" value={form.age}
                onChange={e => update('age', e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Your Area in Bengaluru *</label>
            <input placeholder="e.g. Indiranagar, Koramangala..."
              value={form.location}
              onChange={e => update('location', e.target.value)} style={inputStyle} />
          </div>

          {/* Price */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Price per hour (₹) *</label>
            <input placeholder="e.g. 200" type="number" value={form.price}
              onChange={e => update('price', e.target.value)} style={inputStyle} />
            <p style={{ fontSize: '12px', color: '#999', margin: '6px 0 0' }}>
              Set 0 if you want to share for free
            </p>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>About your pet</label>
            <textarea
              placeholder="Tell people about your pet's personality..."
              value={form.description}
              onChange={e => update('description', e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', height: 'auto' }} />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Tags (comma separated)</label>
            <input placeholder="e.g. Friendly, Vaccinated, Good with kids"
              value={form.tags}
              onChange={e => update('tags', e.target.value)} style={inputStyle} />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Your Phone Number</label>
            <input placeholder="For booking confirmations" type="tel"
              value={form.phone}
              onChange={e => update('phone', e.target.value)} style={inputStyle} />
          </div>

          {/* Availability toggle */}
          <div style={{ marginBottom: '32px', padding: '16px', background: '#f8f8fc',
            borderRadius: '12px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                Available for bookings now?
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>You can change this anytime</div>
            </div>
            <button onClick={() => update('available', !form.available)}
              style={{ width: '52px', height: '28px', borderRadius: '99px',
                border: 'none', cursor: 'pointer', position: 'relative',
                background: form.available
                  ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#ddd',
                transition: 'background 0.3s' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%',
                background: 'white', position: 'absolute', top: '3px',
                left: form.available ? '27px' : '3px',
                transition: 'left 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
            </button>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading || uploadingPhoto}
            style={{ width: '100%', padding: '18px',
              background: (loading || uploadingPhoto) ? '#ccc'
                : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white', border: 'none', borderRadius: '14px',
              fontSize: '17px', fontWeight: '700',
              cursor: (loading || uploadingPhoto) ? 'not-allowed' : 'pointer',
              boxShadow: (loading || uploadingPhoto)
                ? 'none' : '0 8px 24px rgba(102,126,234,0.4)',
              transition: 'all 0.2s' }}>
            {uploadingPhoto ? 'Uploading photo...' :
             loading ? 'Listing your pet...' : 'List My Pet on PawBond 🐾'}
          </button>
        </div>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: '600',
  color: '#444', marginBottom: '8px'
}

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: '10px',
  border: '1.5px solid #e5e5e5', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s'
}