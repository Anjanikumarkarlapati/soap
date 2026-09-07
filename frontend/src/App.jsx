import React, { useState, useEffect } from 'react';
import { EduPulseHero } from './components/EduPulseHero';
import { LoginModal } from './components/LoginModal';
import { StudentsModal } from './components/StudentsModal';
import { AttendanceModal } from './components/AttendanceModal';
import { GradesModal } from './components/GradesModal';
import { AnalyticsModal } from './components/AnalyticsModal';

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [token, setToken] = useState(null);
  const [session, setSession] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('jwtToken');
    const savedUser = localStorage.getItem('jwtUser');
    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setSession(JSON.parse(savedUser));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleNavigate = (target) => {
    switch (target) {
      case 'home':
        setActiveModal(null);
        break;
      case 'students':
        if (!token) setActiveModal('login');
        else setActiveModal('students');
        break;
      case 'attendance':
        if (!token) setActiveModal('login');
        else setActiveModal('attendance');
        break;
      case 'grades':
        if (!token) setActiveModal('login');
        else setActiveModal('grades');
        break;
      case 'login':
        setActiveModal('login');
        break;
      case 'dashboard':
      case 'analytics':
        setActiveModal('analytics');
        break;
      default:
        setActiveModal(null);
    }
  };

  const handleLoginSuccess = ({ username, role, token }) => {
    setToken(token);
    setSession({ username, role });
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('jwtUser');
    setToken(null);
    setSession(null);
    setActiveModal(null);
  };

  const handleSelectStudentForAttendance = (student) => {
    setSelectedStudent(student);
    setActiveModal('attendance');
  };

  const handleSelectStudentForReport = (student) => {
    setSelectedStudent(student);
    setActiveModal('grades');
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* 3D Sylva Hero Landing Page */}
      <EduPulseHero
        onNavigate={handleNavigate}
        session={session}
        onLogout={handleLogout}
      />

      {/* Interactive Microservices Modals */}
      <LoginModal
        isOpen={activeModal === 'login'}
        onClose={() => setActiveModal(null)}
        onLoginSuccess={handleLoginSuccess}
      />

      <StudentsModal
        isOpen={activeModal === 'students'}
        onClose={() => setActiveModal(null)}
        token={token}
        session={session}
        onSelectStudentForAttendance={handleSelectStudentForAttendance}
        onSelectStudentForReport={handleSelectStudentForReport}
      />

      <AttendanceModal
        isOpen={activeModal === 'attendance'}
        onClose={() => setActiveModal(null)}
        token={token}
        selectedStudent={selectedStudent}
      />

      <GradesModal
        isOpen={activeModal === 'grades'}
        onClose={() => setActiveModal(null)}
        token={token}
        selectedStudent={selectedStudent}
      />

      <AnalyticsModal
        isOpen={activeModal === 'analytics'}
        onClose={() => setActiveModal(null)}
        token={token}
      />
    </div>
  );
}
