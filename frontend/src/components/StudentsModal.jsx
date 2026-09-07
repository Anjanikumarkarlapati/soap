import React, { useState, useEffect } from 'react';
import api from '../api';

export function StudentsModal({ isOpen, onClose, token, session, onSelectStudentForAttendance, onSelectStudentForReport }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    department: 'CSE',
    semester: 3,
    email: '',
    phone: '',
  });

  const fetchStudents = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/students');
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch students. Ensure you are signed in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchStudents();
    }
  }, [isOpen, token]);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students', formData);
      setShowAddForm(false);
      setFormData({ name: '', rollNumber: '', department: 'CSE', semester: 3, email: '', phone: '' });
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating student.');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm(`Delete student #${id}?`)) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete student.');
    }
  };

  if (!isOpen) return null;

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalCardStyle, maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '600', margin: 0 }}>
              Student Information System
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '4px 0 0' }}>
              Connected to <code>STUDENT-SERVICE</code> on Port 8082 via API Gateway
            </p>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {!token ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#fca5a5' }}>
            <p>Please sign in with an Academy account to access the student directory.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search students by name, roll no, dept..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ ...inputStyle, maxWidth: '380px' }}
              />

              {session?.role === 'ADMIN' && (
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{
                    background: '#4ade80',
                    color: '#112211',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 18px',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {showAddForm ? 'Cancel' : '+ Enroll New Student'}
                </button>
              )}
            </div>

            {showAddForm && (
              <form onSubmit={handleCreateStudent} style={formBoxStyle}>
                <h4 style={{ color: '#4ade80', margin: '0 0 12px', fontSize: '15px' }}>Enroll Student</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <input
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    required
                    placeholder="Roll Number (e.g. CS2025001)"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    required
                    placeholder="Department (e.g. CSE)"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    required
                    placeholder="Semester"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    style={inputStyle}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    marginTop: '12px',
                    background: '#4ade80',
                    color: '#112211',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Save Student
                </button>
              </form>
            )}

            {loading ? (
              <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '30px' }}>Loading students...</p>
            ) : error ? (
              <p style={{ color: '#ef4444', textAlign: 'center', padding: '30px' }}>{error}</p>
            ) : filtered.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '30px' }}>No students found.</p>
            ) : (
              <div style={{ maxHeight: '420px', overflowY: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)' }}>
                      <th style={thStyle}>ID</th>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Roll No</th>
                      <th style={thStyle}>Dept</th>
                      <th style={thStyle}>Sem</th>
                      <th style={thStyle}>Contact</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s.id} style={trStyle}>
                        <td style={tdStyle}>#{s.id}</td>
                        <td style={{ ...tdStyle, fontWeight: '500', color: '#fff' }}>{s.name}</td>
                        <td style={tdStyle}>{s.rollNumber}</td>
                        <td style={tdStyle}>{s.department}</td>
                        <td style={tdStyle}>Sem {s.semester}</td>
                        <td style={tdStyle}>{s.email}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                          <button
                            onClick={() => onSelectStudentForAttendance(s)}
                            title="Attendance"
                            style={actionBtnStyle}
                          >
                            Attendance
                          </button>
                          <button
                            onClick={() => onSelectStudentForReport(s)}
                            title="Report Card"
                            style={{ ...actionBtnStyle, background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}
                          >
                            Report Card
                          </button>
                          {session?.role === 'ADMIN' && (
                            <button
                              onClick={() => handleDeleteStudent(s.id)}
                              title="Delete"
                              style={{ ...actionBtnStyle, background: 'rgba(239,68,68,0.15)', color: '#f87171' }}
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
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

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
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

const formBoxStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  padding: '16px',
  borderRadius: '12px',
  marginBottom: '16px',
};

const thStyle = {
  padding: '10px 14px',
  fontWeight: '600',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};

const tdStyle = {
  padding: '10px 14px',
  color: 'rgba(255,255,255,0.85)',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
};

const trStyle = {
  transition: 'background 0.2s',
};

const actionBtnStyle = {
  background: 'rgba(74,222,128,0.15)',
  color: '#4ade80',
  border: 'none',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '600',
  cursor: 'pointer',
  marginLeft: '6px',
};