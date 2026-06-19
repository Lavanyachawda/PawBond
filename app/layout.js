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
            padding: '16px 32px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <span style={{ fontSize: '28px' }}>🐾</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: 'white',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>PawBond</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Show when="signed-out">
                <SignInButton>
                  <button style={{
                    padding: '8px 20px', background: 'rgba(255,255,255,0.15)',
                    color: 'white', border: '1px solid rgba(255,255,255,0.4)',
                    borderRadius: '50px', fontSize: '14px', fontWeight: '500',
                    cursor: 'pointer', backdropFilter: 'blur(10px)'
                  }}>Sign In</button>
                </SignInButton>
                <SignUpButton>
                  <button style={{
                    padding: '8px 20px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white', border: 'none',
                    borderRadius: '50px', fontSize: '14px', fontWeight: '600',
                    cursor: 'pointer', boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
                  }}>Sign Up Free</button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
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