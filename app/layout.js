'use client'
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <ClerkProvider>
          <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 32px',
            background: 'rgba(15, 15, 26, 0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}>

            {/* Logo */}
            <a href="/" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              textDecoration: 'none'
            }}>
              <span style={{ fontSize: '26px' }}>🐾</span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'white',
                letterSpacing: '-0.5px' }}>PawBond</span>
            </a>

            {/* Nav links — middle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[
                { label: 'Browse Pets', href: '/listings' },
                { label: 'List Your Pet', href: '/addpet' },
                { label: 'How it Works', href: '/#how' },
                { label: 'Dashboard', href: '/dashboard' },
              ].map(link => (
                <a key={link.href} href={link.href} style={{
                  padding: '8px 14px', borderRadius: '50px',
                  fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
                onMouseOver={e => { e.target.style.color = 'white'; e.target.style.background = 'rgba(255,255,255,0.1)' }}
                onMouseOut={e => { e.target.style.color = 'rgba(255,255,255,0.8)'; e.target.style.background = 'transparent' }}
                >{link.label}</a>
              ))}
            </div>

            {/* Auth buttons — right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Show when="signed-out">
                <SignInButton>
                  <button style={{
                    padding: '8px 18px',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white', border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50px', fontSize: '14px', fontWeight: '500',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.1)'}>
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button style={{
                    padding: '8px 18px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white', border: 'none',
                    borderRadius: '50px', fontSize: '14px', fontWeight: '600',
                    cursor: 'pointer', boxShadow: '0 4px 15px rgba(102,126,234,0.35)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.target.style.boxShadow = '0 6px 20px rgba(102,126,234,0.5)'}
                  onMouseOut={e => e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.35)'}>
                    Sign Up Free
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <a href="/addpet" style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #43b89c, #1D9E75)',
                  color: 'white', border: 'none', borderRadius: '50px',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                  textDecoration: 'none', boxShadow: '0 4px 12px rgba(29,158,117,0.3)'
                }}>
                  + List Pet
                </a>
                <a href="/listings" style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50px', fontSize: '13px', fontWeight: '500',
                  textDecoration: 'none'
                }}>
                  Browse
                </a>
                <UserButton />
              </Show>
            </div>
          </nav>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}