import React from 'react';

export default function Footer() {
  const handleMySpec = () => {
    window.location.href = '/myspec';
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
        <span style={{ fontSize: '0.8rem', color: '#3182f6' }}>MY 스펙</span>
      </div>
    </footer>
  );
}
