'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const userTypes = [
  { id: 'pet_lover', title: 'Pet Lover', icon: '🐾', desc: 'I want to spend time with pets' },
  { id: 'pet_owner', title: 'Pet Owner', icon: '🏠', desc: 'I have pets and want to share them' },
  { id: 'ngo', title: 'NGO / Vet / Shelter', icon: '🏥', desc: 'I run an animal service' },
]

export default function Onboarding() {
  const [selected, setSelected] = useState(null)
  const router = useRouter()

  return (
    <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>Welcome to PawBond!</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>How would you describe yourself?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {userTypes.map((type) => (
          <div key={type.id} onClick={() => setSelected(type.id)}
            style={{ padding: '24px', border: selected === type.id ? '2px solid purple' : '1px solid #ddd',
              borderRadius: '12px', cursor: 'pointer', background: selected === type.id ? '#f5f0ff' : 'white' }}>
            <div style={{ fontSize: '32px' }}>{type.icon}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', margin: '8px 0 4px' }}>{type.title}</div>
            <div style={{ color: '#666' }}>{type.desc}</div>
          </div>
        ))}
      </div>
      {selected && (
        <button onClick={() => router.push('/')}
          style={{ width: '100%', marginTop: '24px', padding: '16px', background: 'purple',
            color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer' }}>
          Continue as {userTypes.find(t => t.id === selected)?.title}
        </button>
      )}
    </div>
  )
}