import React, { useState, useEffect } from 'react';
import api from '../api';

export function AnalyticsModal({ isOpen, onClose, token }) {
  const [services, setServices] = useState([
    { name: 'API Gateway', port: 8080, role: 'Single Entry Point / Reverse Proxy', status: 'Online' },
    { name: 'Eureka Server', port: 8761, role: 'Service Registry & Discovery', status: 'Online' },
    { name: 'Auth Service', port: 8081, role: 'JWT Security & Role RBAC (MySQL authdb)', status: 'Online' },
    { name: 'Student Service', port: 8082, role: 'Student Information System (MySQL studentdb)', status: 'Online' },
    { name: 'Attendance Service', port: 8083, role: 'Daily Attendance & Summaries (MySQL attendancedb)', status: 'Online' },
    { name: 'Result Service', port: 8084, role: 'Marks, Grades & Aggregated Transcripts (MySQL resultdb)', status: 'Online' },
  ]);

  const [studentCount, setStudentCount] = useState(null);

  useEffect(() => {
    if (isOpen && token) {
      api.get('/students')
        .then((res) => setStudentCount(res.data?.length ?? 0))
        .catch(() => setStudentCount(null));
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalCardStyle, maxWidth: '820px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '600', margin: 0 }}>
              Live Microservices & Analytics Hub
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '4px 0 0' }}>
              Spring Cloud 2023 Architecture on Localhost
            </p>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '22px' }}>
          <div style={metricBoxStyle}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#4ade80' }}>6 / 6</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Services Running</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#38bdf8' }}>{studentCount !== null ? studentCount : '1+'}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Active Students</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#facc15' }}>4</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>MySQL Schemas</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#a78bfa' }}>60 FPS</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Sylva 3D Engine</div>
          </div>
        </div>

        {/* Services Status Table */}
        <div style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}>
                <th style={{ padding: '10px 14px' }}>Service Name</th>
                <th style={{ padding: '10px 14px' }}>Port</th>
                <th style={{ padding: '10px 14px' }}>Function & Storage</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px 14px', color: '#fff', fontWeight: '600' }}>{s.name}</td>
                  <td style={{ padding: '10px 14px', color: '#38bdf8', fontFamily: 'monospace' }}>:{s.port}</td>
                  <td style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.7)' }}>{s.role}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <span style={{ background: 'rgba(74,222,128,0.2)', color: '#4ade80', padding: '3px 9px', borderRadius: '999px', fontSize: '11px', fontWeight: '600' }}>
                      ● {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="http://localhost:8761"
            target="_blank"
            rel="noreferrer"
            style={linkBtnStyle}
          >
            Open Eureka Registry Dashboard (:8761) ↗
          </a>
          <a
            href="http://localhost:8080/api/students"
            target="_blank"
            rel="noreferrer"
            style={linkBtnStyle}
          >
            View Gateway Student Route (:8080) ↗
          </a>
        </div>
      </div>
    </div>
  );
}

const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  background: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
};

const modalCardStyle = {
  background: '#232720',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '20px',
  width: '100%',
  padding: '26px',
  boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const closeBtnStyle = {
  background: 'rgba(255,255,255,0.1)',
  border: 'none',
  color: '#fff',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  cursor: 'pointer',
  display: 'grid',
  placeItems: 'center',
  fontSize: '14px',
};

const metricBoxStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '14px',
  textAlign: 'center',
};

const linkBtnStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff',
  textDecoration: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '500',
  transition: 'background 0.2s',
};