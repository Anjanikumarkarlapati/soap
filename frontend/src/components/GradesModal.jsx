import React, { useState, useEffect } from 'react';
import api from '../api';

export function GradesModal({ isOpen, onClose, token, selectedStudent }) {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [reportCard, setReportCard] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add Marks Form
  const [subject, setSubject] = useState('Data Structures');
  const [marks, setMarks] = useState(85);
  const [semester, setSemester] = useState(3);
  const [addLoading, setAddLoading] = useState(false);
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

  const loadReportCard = async (sid) => {
    if (!sid || !token) return;
    setLoading(true);
    try {
      const res = await api.get(`/results/student/${sid}/report-card`);
      setReportCard(res.data);
    } catch (err) {
      console.error(err);
      setReportCard(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      loadReportCard(studentId);
    }
  }, [studentId]);

  const handleAddResult = async (e) => {
    e.preventDefault();
    if (!studentId) return;
    setAddLoading(true);
    setMsg('');
    try {
      await api.post('/results', {
        studentId: Number(studentId),
        subject,
        marks: Number(marks),
        semester: Number(semester)
      });
      setMsg('Academic result recorded! Grade calculated automatically.');
      loadReportCard(studentId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add result.');
    } finally {
      setAddLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalCardStyle, maxWidth: '850px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '600', margin: 0 }}>
              Academic Performance & Report Card
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '4px 0 0' }}>
              Aggregated across <code>RESULT-SERVICE</code>, <code>STUDENT-SERVICE</code> & <code>ATTENDANCE-SERVICE</code>
            </p>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {!token ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#fca5a5' }}>
            <p>Please sign in with an Academy account to view academic transcripts.</p>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '16px' }}>
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

            {/* Aggregated Report Card Header */}
            {reportCard && (
              <div style={reportHeaderStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ color: '#fff', margin: '0 0 4px', fontSize: '18px' }}>{reportCard.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0 }}>
                      Roll No: <strong>{reportCard.rollNumber}</strong> | Dept: <strong>{reportCard.department}</strong> | Sem: <strong>{reportCard.semester}</strong>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Attendance Rate</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#4ade80' }}>
                        {reportCard.attendancePercentage !== undefined ? `${reportCard.attendancePercentage.toFixed(1)}%` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Marks Form */}
            <form onSubmit={handleAddResult} style={formBoxStyle}>
              <h4 style={{ color: '#38bdf8', margin: '0 0 10px', fontSize: '14px' }}>Add Subject Marks</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <input
                    required
                    placeholder="e.g. Operating Systems"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Marks (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    required
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <button
                  type="submit"
                  disabled={addLoading}
                  style={{
                    background: '#38bdf8',
                    color: '#082f49',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    height: '37px',
                  }}
                >
                  {addLoading ? '...' : 'Submit'}
                </button>
              </div>
              {msg && <p style={{ color: '#38bdf8', fontSize: '12px', margin: '8px 0 0' }}>{msg}</p>}
            </form>

            {/* Marks & Grades Table */}
            <div style={{ maxHeight: '240px', overflowY: 'auto', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}>
                    <th style={{ padding: '8px 12px' }}>Subject</th>
                    <th style={{ padding: '8px 12px' }}>Semester</th>
                    <th style={{ padding: '8px 12px' }}>Marks (100)</th>
                    <th style={{ padding: '8px 12px' }}>Auto Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {!reportCard?.results || reportCard.results.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                        No marks recorded for this student yet.
                      </td>
                    </tr>
                  ) : (
                    reportCard.results.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '8px 12px', color: '#fff', fontWeight: '500' }}>{r.subject}</td>
                        <td style={{ padding: '8px 12px', color: 'rgba(255,255,255,0.8)' }}>Sem {r.semester}</td>
                        <td style={{ padding: '8px 12px', color: 'rgba(255,255,255,0.9)' }}>{r.marks} / 100</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span
                            style={{
                              background: r.grade === 'A' ? 'rgba(74,222,128,0.2)' : r.grade === 'B' ? 'rgba(56,189,248,0.2)' : 'rgba(250,204,21,0.2)',
                              color: r.grade === 'A' ? '#4ade80' : r.grade === 'B' ? '#38bdf8' : '#facc15',
                              padding: '2px 9px',
                              borderRadius: '4px',
                              fontWeight: '700',
                            }}
                          >
                            Grade {r.grade}
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

const reportHeaderStyle = {
  background: 'linear-gradient(135deg, rgba(74,222,128,0.1) 0%, rgba(56,189,248,0.08) 100%)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '14px',
  padding: '16px 20px',
  marginBottom: '16px',
};

const formBoxStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  padding: '14px',
  borderRadius: '12px',
  marginBottom: '16px',
};