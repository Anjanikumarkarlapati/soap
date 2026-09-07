import React, { useEffect, useRef } from 'react';

export function EduPulseHero({ onNavigate, session, onLogout }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'EDUPULSE_NAV') {
        const target = event.data.target;
        if (typeof onNavigate === 'function') {
          onNavigate(target);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onNavigate]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#383b34' }}>
      {/* Sylva 3D Hero Frame */}
      <iframe
        ref={iframeRef}
        src="/landing-pages/inner-green-3d.html"
        title="EduPulse Academy — Sylva Living Green 3D Hero"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          background: '#4a4d44',
        }}
      />

      {/* Floating HUD Bar */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(28, 33, 26, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '9999px',
          padding: '8px 18px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#4ade80',
              boxShadow: '0 0 10px #4ade80',
            }}
          />
          <span style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.04em' }}>
            4 Microservices Active
          </span>
        </div>

        <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />

        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>
              {session.username}
              <span
                style={{
                  marginLeft: '6px',
                  fontSize: '10px',
                  background: 'rgba(74, 222, 128, 0.2)',
                  color: '#4ade80',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                }}
              >
                {session.role}
              </span>
            </span>
            <button
              onClick={onLogout}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => (e.target.style.background = 'rgba(239,68,68,0.25)')}
              onMouseOut={(e) => (e.target.style.background = 'rgba(255,255,255,0.08)')}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('login')}
            style={{
              background: '#4ade80',
              border: 'none',
              color: '#132213',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => (e.target.style.opacity = '0.9')}
            onMouseOut={(e) => (e.target.style.opacity = '1')}
          >
            Portal Login
          </button>
        )}
      </div>
    </div>
  );
}
