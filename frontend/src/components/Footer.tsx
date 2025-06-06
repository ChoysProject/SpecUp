import React, { useState } from 'react';
import Picker from 'react-mobile-picker';

export default function Footer() {
  const handleMySpec = () => {
    window.location.href = '/myspec';
  };

  const now = new Date();
  const defaultYear = now.getFullYear() - 20;
  const [birth, setBirth] = useState(`${defaultYear}-01-01`);
  const [showBirthModal, setShowBirthModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);

  const years = Array.from({length: 100}, (_, i) => `${defaultYear - 80 + i}`);
  const months = Array.from({length: 12}, (_, i) => `${i+1}`.padStart(2, '0'));
  const days = Array.from({length: 31}, (_, i) => `${i+1}`.padStart(2, '0'));

  const isValidPassword = (pw: string) => {
    return (
      pw.length >= 8 &&
      /[A-Z]/.test(pw) &&         // 대문자 1개 이상
      /[a-zA-Z]/.test(pw) &&      // 영문 필수
      /[^a-zA-Z0-9]/.test(pw)     // 특수문자 1개 이상
    );
  };

  const handleRegionSave = () => {
    // Implementation of handleRegionSave
  };

  return (
    <footer style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '60px',
      background: '#e3f0ff',
      color: '#3182f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 1000,
      borderTop: '1px solid #b6d8ff',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span role="img" aria-label="home" style={{ color: '#3182f6' }}>🏠</span>
        <span style={{ fontSize: '0.8rem', color: '#3182f6' }}>홈</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span role="img" aria-label="cert" style={{ color: '#3182f6' }}>📄</span>
        <span style={{ fontSize: '0.8rem', color: '#3182f6' }}>자격증</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span role="img" aria-label="community" style={{ color: '#3182f6' }}>💬</span>
        <span style={{ fontSize: '0.8rem', color: '#3182f6' }}>커뮤니티</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={handleMySpec}>
        <span role="img" aria-label="my" style={{ color: '#3182f6' }}>👤</span>
        <span style={{ fontSize: '0.8rem', color: '#3182f6' }}>프로필</span>
      </div>
      {showRegionModal && (
        <div className="region-modal">
          {/* 집, 직장, 관심지역 입력 폼 */}
          <button onClick={handleRegionSave}>저장</button>
          <button onClick={() => setShowRegionModal(false)}>취소</button>
        </div>
      )}
    </footer>
  );
}
