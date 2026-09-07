import React, { useState, useEffect } from 'react';
import api from '../api';

export function AttendanceModal({ isOpen, onClose, token, selectedStudent }) {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('Data Structures');
  const [status, setStatus] = useState('PRESENT');
  const [markLoading, setMarkLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isOpen && token) {
      api.get('/students').then((res) => {
        setStudents(res.data || []);
        if (selectedStudent?.id) {
          setStudentId(selectedStudent.id);
        } else if (res.data?.length > 0) {
          setStudentId(res.data[0].id);
        }
      }).catch(console.error);
    }
  }, [isOpen, token, selectedStudent]);

  const loadAttendanceData = async (sid) => {
    if (!sid || !token) return;
    setLoading(true);
    try {
      const [sumRes, recRes] = await Promise.all([
        api.get(`/attendance/student/${sid}/summary`).catch(() => ({ data: null })),
        api.get(`/attendance/student/${sid}`).catch(() => ({ data: [] })),
      ]);
      setSummary(sumRes.data);
      setRecords(recRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      loadAttendanceData(studentId);
    }
  }, [studentId]);

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!studentId) return;
    setMarkLoading(true);
    setMsg('');
    try {
      await api.post('/attendance', {
        studentId: Number(studentId),
        date,
        subject,
        status,
      });
      setMsg('Attendance marked successfully!');
      loadAttendanceData(studentId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark attendance.');
    } finally {
      setMarkLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalCardStyle, maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '600', margin: 0 }}>
              Attendance Tracker
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '4px 0 0' }}>
              Connected to <code>ATTENDANCE-SERVICE</code> on Port 8083 via API Gateway
            </p>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {!token ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#fca5a5' }}>
            <p>Please sign in with an Academy account to track and mark attendance.</p>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Select Student</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                style={inputStyle}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.id} — {s.name} ({s.rollNumber}, {s.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Summary Cards */}
            {summary && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                <div style={statBoxStyle}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#4ade80' }}>
                    {summary.percentage?.toFixed(1) ?? 0}%
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Attendance Rate</div>
                </div>
                <div style={statBoxStyle}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>
                    {summary.presentCount ?? 0}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Classes Attended</div>
                </div>
                <div style={statBoxStyle}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>
                    {summary.totalClasses ?? 0}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Total Classes</div>
                </div>
              </div>
            )}

            {/* Mark Attendance Form */}
            <form onSubmit={handleMarkAttendance} style={formBoxStyle}>
              <h4 style={{ color: '#4ade80', margin: '0 0 10px', fontSize: '14px' }}>Mark Today's Attendance</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr auto', gap: '10px', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <input
                    required
                    placeholder="e.g. Data Structures"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
                    <option value="PRESENT">PRESENT</option>
                    <option value="ABSENT">ABSENT</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={markLoading}
                  style={{
                    background: '#4ade80',
                    color: '#112211',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    height: '37px',
                  }}
                >
                  {markLoading ? '...' : 'Mark'}
                </button>
              </div>
              {msg && <p style={{ color: '#4ade80', fontSize: '12px', margin: '8px 0 0' }}>{msg}</p>}
            </form>

            {/* Attendance History */}
            <div style={{ maxHeight: '220px', overflowY: 'auto', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}>
                    <th style={{ padding: '8px 12px' }}>Date</th>
                    <th style={{ padding: '8px 12px' }}>Subject</th>
                    <th style={{ padding: '8px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                        No records logged yet.
                      </td>
                    </tr>
                  ) : (
                    records.map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '8px 12px', color: '#fff' }}>{r.date}</td>
                        <td style={{ padding: '8px 12px', color: 'rgba(255,255,255,0.85)' }}>{r.subject}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span
                            style={{
                              background: r.status === 'PRESENT' ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
                              color: r.status === 'PRESENT' ? '#4ade80' : '#f87171',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: '600',
                            }}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
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

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '500',
  color: 'rgba(255,255,255,0.7)',
  marginBottom: '4px',
};

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
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

const statBoxStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '14px',
  textAlign: 'center',
};

const formBoxStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  padding: '14px',
  borderRadius: '12px',
  marginBottom: '18px',
};