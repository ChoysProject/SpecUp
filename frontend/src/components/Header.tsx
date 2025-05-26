import React from 'react';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

export default function Header() {
  // 알람 badge 예시 (실제 알람 개수는 props/context로 관리 가능)
  const alarmCount = 2;

  const handleSearch = () => {
    // 검색창 오픈 등 실제 구현 필요
    alert('검색 기능 준비중!');
  };
  const handleAlarm = () => {
    // 알람 페이지 이동 등 실제 구현 필요
    alert('알람 기능 준비중!');
  };
  const handleUserMenu = () => {
    // 마이페이지, 설정, 로그아웃 등 실제 구현 필요
    alert('마이/설정/로그아웃 메뉴!');
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '56px',
      background: '#e3f0ff',
      color: '#3182f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      borderBottom: '1px solid #b6d8ff',
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px', color: '#3182f6' }}>
        SpecUp
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <FaSearch size={20} style={{ cursor: 'pointer' }} onClick={handleSearch} title="검색" />
        <div style={{ position: 'relative' }}>
          <FaBell size={20} style={{ cursor: 'pointer' }} onClick={handleAlarm} title="알람" />
          {alarmCount > 0 && (
            <span style={{ position: 'absolute', top: -6, right: -6, background: '#ff4d4f', color: '#fff', borderRadius: '50%', fontSize: 10, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {alarmCount}
            </span>
          )}
        </div>
        <FaUserCircle size={22} style={{ cursor: 'pointer' }} onClick={handleUserMenu} title="마이/설정/로그아웃" />
      </div>
    </header>
  );
}
