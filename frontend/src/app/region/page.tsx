import { useState } from 'react';
import { useRouter } from 'next/navigation';

function AddressModal({ onSelect, onClose }: { onSelect: (addr: string) => void, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  // 임시: query 입력 시 mock 데이터로 자동완성
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 1) {
      setResults([
        `${val} (충청북도 제천시)`,
        `${val} (대전광역시 중구)`
      ]);
    } else {
      setResults([]);
    }
  };

  return (
    <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 320 }}>
        <div style={{ marginBottom: 12 }}>주소 검색</div>
        <input value={query} onChange={handleChange} placeholder="동/읍/면/도로명 입력" style={{ width: '100%', fontSize: 16, padding: 8, marginBottom: 12 }} />
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {results.map(addr => (
            <li key={addr} style={{ padding: 8, cursor: 'pointer', borderBottom: '1px solid #eee' }} onClick={() => onSelect(addr)}>{addr}</li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default function RegionPage() {
  const router = useRouter();
  const [home, setHome] = useState('');
  const [work, setWork] = useState('');
  const [interest, setInterest] = useState('');
  const [modal, setModal] = useState<null | 'home' | 'work' | 'interest'>(null);

  const handleSelect = (type: 'home' | 'work' | 'interest', addr: string) => {
    if (type === 'home') setHome(addr);
    if (type === 'work') setWork(addr);
    if (type === 'interest') setInterest(addr);
    setModal(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#181A20', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>{'<'}</button>
        <span style={{ fontSize: 20, fontWeight: 600 }}>내 지역</span>
        <button style={{ background: 'none', border: 'none', color: '#3182f6', fontWeight: 600, fontSize: 16 }}>저장</button>
      </div>
      <div style={{ color: '#888', marginBottom: 18 }}>집, 직장 인근의 모임을 찾습니다.</div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 20, marginRight: 12 }}>🏠</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: '#181A20', marginBottom: 4 }}>집 <span style={{ color: '#3182f6', fontSize: 13 }}>필수</span></div>
            <input value={home} readOnly placeholder="집 주소" onClick={() => setModal('home')} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', fontSize: 16, cursor: 'pointer' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 20, marginRight: 12 }}>💼</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: '#181A20', marginBottom: 4 }}>직장 <span style={{ color: '#bbb', fontSize: 13 }}>권장</span></div>
            <input value={work} readOnly placeholder="직장 주소" onClick={() => setModal('work')} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', fontSize: 16, cursor: 'pointer' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 20, marginRight: 12 }}>⭐</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: '#181A20', marginBottom: 4 }}>관심지역 <span style={{ color: '#bbb', fontSize: 13 }}>선택</span></div>
            <input value={interest} readOnly placeholder="관심지역 주소" onClick={() => setModal('interest')} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', fontSize: 16, cursor: 'pointer' }} />
          </div>
        </div>
      </div>
      {modal && (
        <AddressModal
          onSelect={addr => handleSelect(modal, addr)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
} 