'use client';

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';

// profile 타입 명시
// CertificateType만 남김

type ProfileType = {
  email: string;
  name: string;
  birth: string;
  homeAddress: string;
  workAddress: string;
  interestAddress: string;
  jobInterests: string[];
  certInterests: string[];
  photo: string;
  selfIntro: string;
} | null;

type CertificateType = {
  name: string;
  date: string;
  org: string;
};

// 모달 컴포넌트
function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 320, maxWidth: 400, width: '90vw', boxShadow: '0 2px 16px #aaa', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>×</button>
        {children}
      </div>
    </div>
  );
}

export default function MySpecPage() {
  const [profile, setProfile] = useState<ProfileType>(null);
  const [certificates, setCertificates] = useState<CertificateType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'profile'|'cert'>('profile');
  const [editProfile, setEditProfile] = useState<ProfileType|null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [editModal, setEditModal] = useState<{type: string, data?: any}|null>(null);
  const [showDongModal, setShowDongModal] = useState<false | 'home' | 'work' | 'interest'>(false);
  const [dongKeyword, setDongKeyword] = useState('');
  const [dongList, setDongList] = useState<any[]>([]);
  // 자격증 입력값 상태 추가
  const [certInput, setCertInput] = useState('');
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  // userId 추출 (실제 서비스에서는 JWT decode 필요)
  useEffect(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!userId || !accessToken) {
      window.location.href = '/login';
      return;
    }
    fetch(`http://172.20.193.4:8080/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setProfile({
            email: data.email,
            name: data.name,
            birth: data.birth,
            homeAddress: data.homeAddress,
            workAddress: data.workAddress,
            interestAddress: data.interestAddress,
            jobInterests: data.jobInterests || [],
            certInterests: data.certInterests || [],
            photo: data.photoUrl || '',
            selfIntro: data.selfIntro || '',
          });
          setCertificates(data.certificates || []);
        }
      });
  }, []);

  // 최신 데이터 fetch 함수
  const fetchProfile = async () => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!userId || !accessToken) return;
    const res = await fetch(`http://172.20.193.4:8080/api/users/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (res.ok) {
      const data = await res.json();
      setProfile({
        email: data.email,
        name: data.name,
        birth: data.birth,
        homeAddress: data.homeAddress,
        workAddress: data.workAddress,
        interestAddress: data.interestAddress,
        jobInterests: data.jobInterests || [],
        certInterests: data.certInterests || [],
        photo: data.photoUrl || '',
        selfIntro: data.selfIntro || '',
      });
      setCertificates(data.certificates || []);
    }
  };
  useEffect(() => { fetchProfile(); }, []);

  // 프로필 수정 모달 열기
  const openProfileModal = () => {
    setEditProfile(profile);
    setModalType('profile');
    setModalOpen(true);
  };

  // 프로필 정보 변경 핸들러
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditProfile(prev => prev ? { ...prev, [name]: value } : prev);
  };
  // 사진 업로드
  const handlePhotoClick = () => { fileInputRef.current?.click(); };
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      // base64 데이터가 editProfile.photo에 반드시 들어가도록 보장
      setEditProfile(prev => prev ? { ...prev, photo: reader.result as string } : prev);
      // 미리보기용 profile도 즉시 반영(선택적)
      setProfile(prev => prev ? { ...prev, photo: reader.result as string } : prev);
    };
    reader.readAsDataURL(file);
  };

  // 저장(백엔드 반영)
  const handleModalSave = async () => {
    if (!editProfile) return;
    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('accessToken');
    if (!userId || !accessToken) {
      toast.error('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    // photoUrl에 base64가 반드시 포함되도록 보장
    const res = await fetch(`http://172.20.193.4:8080/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
      body: JSON.stringify({ ...editProfile, photoUrl: editProfile.photo, certificates }),
    });
    if (res.ok) {
      toast.success('저장 완료!');
      setModalOpen(false);
      fetchProfile();
    } else if (res.status === 403) {
      toast.error('권한이 없습니다. (403)');
    } else {
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  const btnStyle = {
    background: "#3182f6",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 18px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 15,
    marginLeft: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  };

  // 자격증 추가/수정 모달
  const handleAdd = () => {
    setCertInput('');
    setSelectedCert(null);
    setEditModal({ type: '자격증' });
  };
  const handleEdit = () => {
    setCertInput('');
    setSelectedCert(null);
    setEditModal({ type: '자격증' });
  };
  // 자격증명 입력 핸들러
  const handleCertInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertInput(e.target.value);
    setSelectedCert(null);
  };
  // 자격증명 클릭 시
  const handleCertSelect = (name: string) => {
    setCertInput(name);
    setSelectedCert(name);
  };
  // 자격증 저장
  const handleCertSave = async () => {
    if (!certInput.trim()) {
      toast.error('자격증명을 입력 또는 선택하세요.');
      return;
    }
    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('accessToken');
    // 이미 있는 자격증명은 중복 추가 방지
    const newCerts = certificates.some(c => c.name === certInput.trim())
      ? certificates
      : [...certificates, { name: certInput.trim(), date: '', org: '' }];
    setCertificates(newCerts);
    setEditModal(null);
    // 서버에 저장
    if (profile) {
      const res = await fetch(`http://172.20.193.4:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ ...profile, photoUrl: profile.photo, certificates: newCerts }),
      });
      if (res.ok) {
        toast.success('자격증 저장 완료!');
        fetchProfile();
      } else {
        toast.error('자격증 저장 중 오류가 발생했습니다.');
      }
    }
  };

  // 동 입력 핸들러 (회원가입 페이지와 동일)
  const handleDongInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDongKeyword(value);
    if (value.length > 1) {
      try {
        const res = await fetch(`http://172.20.193.4:8080/api/dong?keyword=${encodeURIComponent(value)}`);
        if (!res.ok) { setDongList([]); return; }
        const text = await res.text();
        if (!text) { setDongList([]); return; }
        const data = JSON.parse(text);
        setDongList(Array.isArray(data) ? data : []);
      } catch (err) { setDongList([]); }
    } else { setDongList([]); }
  };
  // 동 선택 시
  const handleDongSelect = (dong: any) => {
    if (showDongModal && editProfile) {
      setEditProfile(prev => prev ? {
        ...prev,
        [`${showDongModal}Address`]: `${dong.city ? dong.city + ' ' : ''}${dong.name}`
      } : prev);
      setShowDongModal(false);
      setDongKeyword('');
      setDongList([]);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 24, background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #eee", boxSizing: 'border-box' }}>
      <ToastContainer position="top-center" autoClose={1500} hideProgressBar />
      {/* 프로필 카드형 상단 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, borderBottom: "1px solid #eee", paddingBottom: 24, marginBottom: 24, width: '100%' }}>
        <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handlePhotoChange} />
        {profile && profile.photo ? (
          <div style={{ cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
            <Image src={profile.photo} alt="증명사진" width={96} height={96} style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #e3e3e3" }} />
          </div>
        ) : (
          <div style={{ width: 96, height: 96, background: "#f0f0f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", fontSize: 18, border: "2px solid #e3e3e3", cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
            사진 없음
          </div>
        )}
        <div style={{ fontSize: 22, fontWeight: 700, color: '#444' }}>{profile?.name || '-'}</div>
        <div style={{ color: "#888", fontSize: 15 }}>{profile?.email || '-'}</div>
        <div style={{ color: "#888", fontSize: 15 }}>{profile?.birth || '-'}</div>
        {/* 자기소개 영역 */}
        <div style={{ margin: '12px 0', width: '100%', textAlign: 'center', color: '#444', fontSize: 15, minHeight: 24, whiteSpace: 'pre-line', fontWeight: 700 }}>
          {profile?.selfIntro ? profile.selfIntro : <span style={{ color: '#444', fontWeight: 700 }}>자기소개를 입력해주세요.</span>}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          <span style={{ background: "#e3f0ff", color: "#3182f6", borderRadius: 12, padding: "2px 12px", fontSize: 14 }}>집: {profile?.homeAddress || '-'}</span>
          <span style={{ background: "#e3f0ff", color: "#3182f6", borderRadius: 12, padding: "2px 12px", fontSize: 14 }}>회사: {profile?.workAddress || '-'}</span>
          <span style={{ background: "#e3f0ff", color: "#3182f6", borderRadius: 12, padding: "2px 12px", fontSize: 14 }}>관심지역: {profile?.interestAddress || '-'}</span>
        </div>
        <button style={{ ...btnStyle, marginTop: 12 }} onClick={openProfileModal}>프로필 수정</button>
      </div>
      {/* 나의 자격증 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#444' }}>나의 자격증</h2>
          <button
            style={{ ...btnStyle, marginTop: 12 }}
            onClick={() => certificates.length ? handleEdit() : handleAdd()}
          >
            {certificates.length ? "수정하기" : "추가하기"}
          </button>
        </div>
        {certificates.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {certificates.map((c: CertificateType, i: number) => (
              <span key={i} style={{ background: "#e3f0ff", color: "#3182f6", borderRadius: 16, padding: "6px 16px", fontSize: 15 }}>{c.name}</span>
            ))}
          </div>
        ) : (
          <div style={{ color: "#bbb", fontSize: 16, fontWeight: 700 }}>자격증 정보를 입력해주세요.</div>
        )}
      </section>
      {/* 자격증 추가/수정 모달 */}
      <Modal open={!!editModal} onClose={()=>setEditModal(null)}>
        {editModal?.type === '자격증' && (
          <div style={{ color: '#444', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>자격증 추가</div>
            <input name="search" placeholder="자격증명 검색" value={certInput} onChange={handleCertInputChange} style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee' }} />
            <div style={{ maxHeight: 120, overflowY: 'auto', border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
              {/* 예시: 검색 결과 리스트 */}
              {['정보처리기사','SQLD','ADsP','컴퓨터활용능력 1급','기타'].map((name) => (
                <div key={name} style={{ padding: 6, cursor: 'pointer', background: certInput === name ? '#e3f0ff' : undefined, borderRadius: 6 }} onClick={()=>handleCertSelect(name)}>{name}</div>
              ))}
            </div>
            <button style={{ ...btnStyle, marginTop: 8 }} onClick={handleCertSave}>저장</button>
          </div>
        )}
      </Modal>
      {/* 프로필 수정 팝업: 닉네임, 자기소개, 집/회사/관심지역(자동완성) */}
      {modalType==='profile' && editProfile && (
        <Modal open={modalOpen} onClose={()=>setModalOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: '#444' }}>
            <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>프로필 수정</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, color: '#888', marginBottom: 2 }}>이름 or 닉네임</label>
              <input name="name" value={editProfile.name} onChange={handleEditChange} placeholder="닉네임" style={{ color: '#444', padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, color: '#888', marginBottom: 2 }}>자기소개</label>
              <textarea name="selfIntro" value={editProfile.selfIntro} onChange={handleEditChange} placeholder="자기소개" style={{ color: '#444', padding: 10, borderRadius: 8, border: '1px solid #eee', minHeight: 60, fontSize: 16 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, color: '#888', marginBottom: 2 }}>집</label>
              <input name="homeAddress" value={editProfile.homeAddress} placeholder="집 주소" readOnly onClick={()=>setShowDongModal('home')} style={{ color: '#444', padding: 10, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', cursor: 'pointer', fontSize: 16 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, color: '#888', marginBottom: 2 }}>회사</label>
              <input name="workAddress" value={editProfile.workAddress} placeholder="회사 주소" readOnly onClick={()=>setShowDongModal('work')} style={{ color: '#444', padding: 10, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', cursor: 'pointer', fontSize: 16 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, color: '#888', marginBottom: 2 }}>관심지역</label>
              <input name="interestAddress" value={editProfile.interestAddress} placeholder="관심 지역" readOnly onClick={()=>setShowDongModal('interest')} style={{ color: '#444', padding: 10, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', cursor: 'pointer', fontSize: 16 }} />
            </div>
            <button style={{ ...btnStyle, marginTop: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }} onClick={handleModalSave}>저장</button>
          </div>
        </Modal>
      )}
      {/* 동 자동완성 모달 */}
      {showDongModal && (
        <Modal open={!!showDongModal} onClose={()=>setShowDongModal(false)}>
          <div style={{ minWidth: 320, color: '#444' }}>
            <input
              value={dongKeyword}
              onChange={handleDongInput}
              placeholder="동명을 입력하세요"
              style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #eee', marginBottom: 8 }}
            />
            <ul style={{ maxHeight: 200, overflowY: 'auto', margin: 0, padding: 0 }}>
              {dongList.map((dong, idx) => (
                <li
                  key={dong.code || idx}
                  onClick={() => handleDongSelect(dong)}
                  style={{ padding: 12, cursor: 'pointer', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}
                >
                  <span style={{ fontWeight: 600 }}>{dong.name}</span>
                  {dong.city && (
                    <span style={{ color: '#888', fontSize: 13, marginLeft: 8 }}>({dong.city})</span>
                  )}
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button onClick={()=>setShowDongModal(false)} style={{ color: '#3182f6', background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>닫기</button>
            </div>
          </div>
        </Modal>
      )}
      {/* 반응형 스타일 */}
      <style jsx global>{`
        @media (max-width: 600px) {
          div[style*='max-width: 480px'] {
            max-width: 100vw !important;
            padding: 8px !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}