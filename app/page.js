'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const slides = [
  { img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80', text: 'Find your perfect furry companion nearby' },
  { img: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=1200&q=80', text: 'Spend quality time with pets you love' },
  { img: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=80', text: 'Connect with pet owners in your city' },
  { img: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=1200&q=80', text: 'Every pet deserves love — including yours' },
]

export default function Home() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length)
        setVisible(true)
      }, 600)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main style={{ fontFamily: "'Segoe UI', sans-serif", overflowX: 'hidden' }}>

      {/* Hero Slideshow */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <img src={slides[current].img} alt="pets"
          style={{ width: '100%', height: '100%', objectFit: 'cover',
            transition: 'opacity 0.6s ease', opacity: visible ? 1 : 0, position: 'absolute', top: 0, left: 0 }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px',
            animation: 'bounce 2s infinite', display: 'inline-block' }}>🐾</div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: '800', color: 'white',
            margin: '0 0 16px', textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            transition: 'opacity 0.6s ease', opacity: visible ? 1 : 0 }}>
            Welcome to PawBond
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', color: 'rgba(255,255,255,0.9)',
            maxWidth: '600px', margin: '0 0 40px', lineHeight: 1.6,
            transition: 'opacity 0.6s ease', opacity: visible ? 1 : 0 }}>
            {slides[current].text}
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => router.push('/onboarding')}
              style={{ padding: '16px 36px', background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white', border: 'none', borderRadius: '50px', fontSize: '17px',
                fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 32px rgba(102,126,234,0.5)',
                transform: 'translateY(0)', transition: 'transform 0.2s' }}
              onMouseOver={e => e.target.style.transform='translateY(-3px)'}
              onMouseOut={e => e.target.style.transform='translateY(0)'}>
              Get Started Free 🐾
            </button>
            <button onClick={() => router.push('/listings')}
              style={{ padding: '16px 36px', background: 'rgba(255,255,255,0.15)',
                color: 'white', border: '2px solid rgba(255,255,255,0.8)', borderRadius: '50px',
                fontSize: '17px', fontWeight: '600', cursor: 'pointer', backdropFilter: 'blur(10px)',
                transition: 'transform 0.2s' }}
              onMouseOver={e => e.target.style.transform='translateY(-3px)'}
              onMouseOut={e => e.target.style.transform='translateY(0)'}>
              Browse Pets 🐶
            </button>
          </div>
          {/* Slide dots */}
          <div style={{ position: 'absolute', bottom: '40px', display: 'flex', gap: '8px' }}>
            {slides.map((_, i) => (
              <div key={i} onClick={() => setCurrent(i)}
                style={{ width: i === current ? '24px' : '8px', height: '8px', borderRadius: '99px',
                  background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '32px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto' }}>
          {[['500+', 'Pet Owners'], ['1200+', 'Happy Sessions'], ['50+', 'Cities'], ['100+', 'NGOs & Vets']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '32px', fontWeight: '800' }}>{num}</div>
              <div style={{ fontSize: '14px', opacity: 0.85 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '100px 20px', background: '#fafafa', textAlign: 'center' }}>
        <p style={{ color: '#764ba2', fontWeight: '600', letterSpacing: '2px', fontSize: '13px', textTransform: 'uppercase' }}>Simple Process</p>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', margin: '8px 0 60px', color: '#1a1a2e' }}>How PawBond Works</h2>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
          {[
            { icon: '📝', step: '01', title: 'Create Profile', desc: 'Sign up and choose your role — pet lover, owner, shelter or vet', color: '#667eea' },
            { icon: '🔍', step: '02', title: 'Discover Nearby', desc: 'Browse pet listings sorted by distance. Filter by pet type and availability', color: '#764ba2' },
            { icon: '💬', step: '03', title: 'Chat & Trust', desc: 'Message the owner, ask questions, and build trust before meeting', color: '#f64f59' },
            { icon: '🐾', step: '04', title: 'Bond & Enjoy', desc: 'Book a session and spend quality time with your furry friend!', color: '#43b89c' },
          ].map((item) => (
            <div key={item.step}
              style={{ background: 'white', borderRadius: '20px', padding: '40px 28px', width: '210px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'default' }}
              onMouseOver={e => { e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.12)' }}
              onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: '44px', marginBottom: '16px' }}>{item.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: item.color, letterSpacing: '2px', marginBottom: '8px' }}>{item.step}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#1a1a2e' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pet photo grid */}
      <section style={{ padding: '100px 20px', background: 'white', textAlign: 'center' }}>
        <p style={{ color: '#764ba2', fontWeight: '600', letterSpacing: '2px', fontSize: '13px', textTransform: 'uppercase' }}>Real Moments</p>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', margin: '8px 0 60px', color: '#1a1a2e' }}>People & Pets, Together</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&q=80',
            'https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?w=500&q=80',
            'https://images.unsplash.com/photo-1534361960057-19f4434d00c3?w=500&q=80',
            'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=500&q=80',
            'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=500&q=80',
            'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500&q=80',
          ].map((src, i) => (
            <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', height: '220px',
              transition: 'transform 0.3s', cursor: 'pointer' }}
              onMouseOver={e => e.currentTarget.style.transform='scale(1.03)'}
              onMouseOut={e => e.currentTarget.style.transform='scale(1)'}>
              <img src={src} alt="pet moment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </section>

      {/* Who is it for */}
      <section style={{ padding: '100px 20px', background: '#fafafa', textAlign: 'center' }}>
        <p style={{ color: '#764ba2', fontWeight: '600', letterSpacing: '2px', fontSize: '13px', textTransform: 'uppercase' }}>For Everyone</p>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', margin: '8px 0 60px', color: '#1a1a2e' }}>Who is PawBond for?</h2>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
          {[
            { icon: '🐾', title: 'Pet Lovers', desc: 'Love animals but can\'t own one? Spend time with pets nearby and make furry friends without the full responsibility.', color: '#667eea', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80' },
            { icon: '🏠', title: 'Pet Owners', desc: 'Share your pet\'s love and earn extra income. Set your schedule and meet verified animal lovers near you.', color: '#764ba2', img: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400&q=80' },
            { icon: '🏥', title: 'NGOs & Vets', desc: 'Connect with the community. List your shelter or clinic and help animals in need find the care they deserve.', color: '#43b89c', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80' },
          ].map((item) => (
            <div key={item.title} style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', width: '300px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)', transition: 'transform 0.3s' }}
              onMouseOver={e => e.currentTarget.style.transform='translateY(-8px)'}
              onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
              <img src={item.img} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '28px' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a2e', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7', margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', padding: '120px 20px', textAlign: 'center', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=1200&q=80"
          alt="bg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(102,126,234,0.9), rgba(118,75,162,0.9))' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: '800', color: 'white', margin: '0 0 16px' }}>
            Ready to find your PawBond? 🐾
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', margin: '0 0 40px' }}>
            Join thousands of pet lovers across India
          </p>
          <button onClick={() => router.push('/onboarding')}
            style={{ padding: '18px 48px', background: 'white', color: '#764ba2',
              border: 'none', borderRadius: '50px', fontSize: '18px', fontWeight: '800',
              cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s' }}
            onMouseOver={e => e.target.style.transform='translateY(-3px)'}
            onMouseOut={e => e.target.style.transform='translateY(0)'}>
            Join PawBond Free 🐾
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f0f1a', color: '#aaa', padding: '60px 20px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🐾</div>
        <div style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>PawBond</div>
        <p style={{ margin: '0 0 24px', fontSize: '15px' }}>Connecting pet lovers across India</p>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
          {['About', 'How it works', 'For Owners', 'NGOs & Vets', 'Safety', 'Contact'].map(link => (
            <span key={link} style={{ cursor: 'pointer', fontSize: '14px', color: '#888',
              transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color='white'}
              onMouseOut={e => e.target.style.color='#888'}>{link}</span>
          ))}
        </div>
        <p style={{ fontSize: '13px', margin: 0, color: '#555' }}>© 2025 PawBond. Made with ❤️ for animals.</p>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </main>
  )
}