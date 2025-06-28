'use client';

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';

// profile 타입 명시
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

type CareerType = {
  company: string;
  job: string;
  team: string;
  period: string;
  desc: string;
  detail: string[];
};

type EducationType = {
  school: string;
  major: string;
  period: string;
  location?: string;
};

type ExperienceType = {
  title: string;
  period: string;
  desc: string;
};

type CertificateType = {
  name: string;
  date: string;
  org: string;
};

type PortfolioType = {
  name: string;
  url: string;
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
  // 예시: 실제로는 API로 받아오거나 props/context로 관리
  // null 또는 빈 배열이면 데이터 없음으로 간주
  const [profile, setProfile] = useState<ProfileType>(null);
  const [career, setCareer] = useState<CareerType[]>([]);
  const [education, setEducation] = useState<EducationType[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [certificates, setCertificates] = useState<CertificateType[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioType[]>([]);
  const [selfIntro, setSelfIntro] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'profile'|'job'|'cert'>('profile');
  const [editProfile, setEditProfile] = useState<ProfileType|null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [editModal, setEditModal] = useState<{type: string, data?: any}|null>(null);
  // 동 자동완성 상태
  const [showDongModal, setShowDongModal] = useState<false | 'home' | 'work' | 'interest'>(false);
  const [dongKeyword, setDongKeyword] = useState('');
  const [dongList, setDongList] = useState<any[]>([]);

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
          setCareer(data.careers || []);
          setEducation(data.educations || []);
          setSkills(data.skills || []);
          setExperiences(data.experiences || []);
          setCertificates(data.certificates || []);
          setPortfolios(data.portfolios || []);
          setSelfIntro(data.selfIntro || "");
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
    }
  };
  useEffect(() => { fetchProfile(); }, []);

  // 프로필 수정 모달 열기
  const openProfileModal = () => {
    setEditProfile(profile);
    setModalType('profile');
    setModalOpen(true);
  };
  // 관심 직무/자격증 수정 모달 열기
  const openJobModal = () => {
    setEditProfile(profile);
    setModalType('job');
    setModalOpen(true);
  };
  const openCertModal = () => {
    setEditProfile(profile);
    setModalType('cert');
    setModalOpen(true);
  };

  // 프로필 정보 변경 핸들러
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditProfile(prev => prev ? { ...prev, [name]: value } : prev);
  };
  // 태그(관심사) 추가/삭제
  const handleTagAdd = (type: 'jobInterests'|'certInterests', value: string) => {
    setEditProfile(prev => prev ? { ...prev, [type]: [...(prev[type]||[]), value] } : prev);
  };
  const handleTagRemove = (type: 'jobInterests'|'certInterests', idx: number) => {
    setEditProfile(prev => prev ? { ...prev, [type]: prev[type]?.filter((_,i)=>i!==idx) } : prev);
  };
  // 사진 업로드
  const handlePhotoClick = () => { fileInputRef.current?.click(); };
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditProfile(prev => prev ? { ...prev, photo: reader.result as string } : prev);
    };
    reader.readAsDataURL(file);
  };
  // 저장(백엔드 반영)
  const handleModalSave = async () => {
    if (!editProfile) return;
    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('accessToken');
    const res = await fetch(`http://172.20.193.4:8080/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
      body: JSON.stringify({ ...editProfile, photoUrl: editProfile.photo }),
    });
    if (res.ok) {
      toast.success('저장 완료!');
      setModalOpen(false);
      fetchProfile();
    } else {
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  // 버튼 스타일
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

  // 기존 handleAdd/handleEdit 대체
  const handleAdd = (section: string) => {
    setEditModal({ type: section });
  };
  const handleEdit = (section: string, data?: any) => {
    setEditModal({ type: section, data });
  };

  // 관심 직무/업무, 관심 자격증 수정 시 페이지 이동
  const handleJobEdit = () => {
    if (profile?.jobInterests) localStorage.setItem('selectedJobInterests', JSON.stringify(profile.jobInterests));
    router.push('/select-interest');
  };
  const handleCertEdit = () => {
    if (profile?.certInterests) localStorage.setItem('selectedCertInterests', JSON.stringify(profile.certInterests));
    router.push('/select-cert');
  };

  // 자기소개 수정 핸들러
  const handleSelfIntroChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newIntro = e.target.value;
    setProfile(prev => prev ? { ...prev, selfIntro: newIntro } : prev);
    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('accessToken');
    await fetch(`http://172.20.193.4:8080/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
      body: JSON.stringify({ ...profile, selfIntro: newIntro }),
    });
  };

  // 동 입력 핸들러
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
        {/* 자기소개, MBTI 등은 users 컬렉션 구조에 맞게 필요시 추가 */}
        <button style={{ ...btnStyle, marginTop: 12 }} onClick={openProfileModal}>프로필 수정</button>
      </div>
      {/* 관심 직무/업무, 관심 자격증 태그형 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#444' }}>관심 직무/업무</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
            {profile?.jobInterests && profile.jobInterests.length > 0 ? (
              profile.jobInterests.map((job, i) => (
                <span key={i} style={{ background: "#f9e7ff", color: "#a14ee6", borderRadius: 12, padding: "4px 12px", fontSize: 14 }}>{job}</span>
              ))
            ) : (
              <span style={{ color: "#bbb", fontSize: 14, fontWeight: 700 }}>-</span>
            )}
            <button style={{ ...btnStyle, padding: '2px 10px', fontSize: 13 }} onClick={handleJobEdit}>수정</button>
          </div>
        </div>
        <div>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#444' }}>관심 자격증</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
            {profile?.certInterests && profile.certInterests.length > 0 ? (
              profile.certInterests.map((cert, i) => (
                <span key={i} style={{ background: "#e3f0ff", color: "#3182f6", borderRadius: 12, padding: "4px 12px", fontSize: 14 }}>{cert}</span>
              ))
            ) : (
              <span style={{ color: "#bbb", fontSize: 14, fontWeight: 700 }}>-</span>
            )}
            <button style={{ ...btnStyle, padding: '2px 10px', fontSize: 13 }} onClick={handleCertEdit}>수정</button>
          </div>
        </div>
      </div>

      {/* 두번째 섹터: 경력, 학력만 남김 */}
      <section style={{ marginTop: 32, display: 'flex', gap: 24, justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#444' }}>경력</h3>
          {career.length ? (
            <div>{career[0].company} 외 {career.length - 1}건</div>
          ) : (
            <div style={{ color: "#bbb", fontSize: 16, fontWeight: 700 }}>-</div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#444' }}>학력</h3>
          {education.length ? (
            <div>{education[0].school} 외 {education.length - 1}건</div>
          ) : (
            <div style={{ color: "#bbb", fontSize: 16, fontWeight: 700 }}>-</div>
          )}
        </div>
      </section>

      {/* 하단 상세 섹션 순서 재배치: 자기소개, 경력, 학력, 나의 자격증, 경험/활동/교육, 자격/어학/수상, 포트폴리오 및 기타문서 */}
      {/* 자기소개 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#444' }}>자기소개</h2>
        </div>
        {selfIntro ? (
          <div style={{ color: "#444", fontSize: 16, whiteSpace: "pre-line" }}>{selfIntro}</div>
        ) : (
          <div style={{ color: "#bbb", fontSize: 16, fontWeight: 700 }}>자기소개를 입력해주세요.</div>
        )}
      </section>
      {/* 경력 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#444' }}>경력</h2>
          <button
            style={{ ...btnStyle, marginTop: 12 }}
            onClick={() => career.length ? handleEdit("경력") : handleAdd("경력")}
          >
            {career.length ? "수정하기" : "추가하기"}
          </button>
        </div>
        {career.length ? (
          career.map((c: CareerType, i: number) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500 }}>{c.company} <span style={{ color: "#3182f6" }}>{c.period}</span></div>
              <div style={{ color: "#666", fontSize: 15 }}>{c.job} | {c.team}</div>
              <div style={{ color: "#444", margin: "6px 0" }}>{c.desc}</div>
              <ul style={{ color: "#888", fontSize: 14, marginLeft: 16 }}>
                {c.detail.map((d: string, j: number) => <li key={j}>{d}</li>)}
              </ul>
            </div>
          ))
        ) : (
          <div style={{ color: "#bbb", fontSize: 16, fontWeight: 700 }}>경력 정보를 입력해주세요.</div>
        )}
      </section>
      {/* 학력 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#444' }}>학력</h2>
          <button
            style={{ ...btnStyle, marginTop: 12 }}
            onClick={() => education.length ? handleEdit("학력") : handleAdd("학력")}
          >
            {education.length ? "수정하기" : "추가하기"}
          </button>
        </div>
        {education.length ? (
          education.map((e: EducationType, i: number) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 500 }}>{e.school} <span style={{ color: "#3182f6" }}>{e.period}</span></div>
              <div style={{ color: "#666", fontSize: 15 }}>{e.major} {e.location && `| ${e.location}`}</div>
            </div>
          ))
        ) : (
          <div style={{ color: "#bbb", fontSize: 16, fontWeight: 700 }}>학력 정보를 입력해주세요.</div>
        )}
      </section>
      {/* 나의 자격증 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#444' }}>나의 자격증</h2>
          <button
            style={{ ...btnStyle, marginTop: 12 }}
            onClick={() => certificates.length ? handleEdit("자격증") : handleAdd("자격증")}
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
      {/* 경험/활동/교육 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#444' }}>경험/활동/교육</h2>
          <button
            style={{ ...btnStyle, marginTop: 12 }}
            onClick={() => experiences.length ? handleEdit("경험/활동/교육") : handleAdd("경험/활동/교육")}
          >
            {experiences.length ? "수정하기" : "추가하기"}
          </button>
        </div>
        {experiences.length ? (
          experiences.map((exp: ExperienceType, i: number) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 500 }}>{exp.title} <span style={{ color: "#3182f6" }}>{exp.period}</span></div>
              <div style={{ color: "#666", fontSize: 15 }}>{exp.desc}</div>
            </div>
          ))
        ) : (
          <div style={{ color: "#bbb", fontSize: 16, fontWeight: 700 }}>경험/활동/교육 정보를 입력해주세요.</div>
        )}
      </section>
      {/* 자격/어학/수상 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#444' }}>자격/어학/수상</h2>
          <button
            style={{ ...btnStyle, marginTop: 12 }}
            onClick={() => certificates.length ? handleEdit("자격/어학/수상") : handleAdd("자격/어학/수상")}
          >
            {certificates.length ? "수정하기" : "추가하기"}
          </button>
        </div>
        {certificates.length ? (
          certificates.map((c: CertificateType, i: number) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>{c.name}</span> <span style={{ color: "#3182f6" }}>{c.date}</span> <span style={{ color: "#888" }}>{c.org}</span>
            </div>
          ))
        ) : (
          <div style={{ color: "#bbb", fontSize: 16, fontWeight: 700 }}>자격/어학/수상 정보를 입력해주세요.</div>
        )}
      </section>
      {/* 포트폴리오 및 기타문서 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#444' }}>포트폴리오 및 기타문서</h2>
        </div>
        {portfolios.length ? (
          portfolios.map((p: PortfolioType, i: number) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: "#3182f6", textDecoration: "underline" }}>{p.name}</a>
            </div>
          ))
        ) : (
          <div style={{ color: "#bbb", fontSize: 16, fontWeight: 700 }}>포트폴리오를 입력해주세요.</div>
        )}
      </section>

      {/* 경력, 학력, 경험, 자격증, 포트폴리오 모달 */}
      <Modal open={!!editModal} onClose={()=>setEditModal(null)}>
        {editModal?.type === '경력' && (
          <div style={{ color: '#444', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>경력 추가</div>
            <select name="job" style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee' }}>
              <option value="">직무 선택</option>
              <option value="백엔드">백엔드</option>
              <option value="프론트엔드">프론트엔드</option>
              <option value="데이터">데이터</option>
              <option value="기획">기획</option>
              <option value="디자인">디자인</option>
              <option value="기타">기타</option>
            </select>
            <input name="company" placeholder="회사명" style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee' }} />
            <input name="team" placeholder="팀/부서" style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee' }} />
            <input name="period" placeholder="근무기간" style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee' }} />
            <textarea name="desc" placeholder="설명" style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee', minHeight: 40 }} />
            <button style={{ ...btnStyle, marginTop: 8 }} onClick={()=>setEditModal(null)}>저장</button>
          </div>
        )}
        {editModal?.type === '학력' && (
          <div style={{ color: '#444', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>학력 추가</div>
            <select name="school" style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee' }}>
              <option value="">대학교 선택</option>
              <option value="서울대학교">서울대학교</option>
              <option value="연세대학교">연세대학교</option>
              <option value="고려대학교">고려대학교</option>
              <option value="한양대학교">한양대학교</option>
              <option value="기타">기타</option>
            </select>
            <input name="major" placeholder="전공" style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee' }} />
            <input name="period" placeholder="재학기간" style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee' }} />
            <input name="location" placeholder="위치" style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee' }} />
            <button style={{ ...btnStyle, marginTop: 8 }} onClick={()=>setEditModal(null)}>저장</button>
          </div>
        )}
        {editModal?.type === '자격증' && (
          <div style={{ color: '#444', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>자격증 추가</div>
            <input name="search" placeholder="자격증명 검색" style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee' }} />
            <div style={{ maxHeight: 120, overflowY: 'auto', border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
              {/* 예시: 검색 결과 리스트 */}
              <div style={{ padding: 6, cursor: 'pointer' }}>정보처리기사</div>
              <div style={{ padding: 6, cursor: 'pointer' }}>SQLD</div>
              <div style={{ padding: 6, cursor: 'pointer' }}>ADsP</div>
              <div style={{ padding: 6, cursor: 'pointer' }}>컴퓨터활용능력 1급</div>
              <div style={{ padding: 6, cursor: 'pointer' }}>기타</div>
            </div>
            <button style={{ ...btnStyle, marginTop: 8 }} onClick={()=>setEditModal(null)}>저장</button>
          </div>
        )}
      </Modal>

      {/* 프로필 수정 팝업: 닉네임, 자기소개, 집/회사/관심지역(자동완성) */}
      {modalType==='profile' && editProfile && (
        <Modal open={modalOpen} onClose={()=>setModalOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#444' }}>
            <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 18 }}>프로필 수정</div>
            <input name="name" value={editProfile.name} onChange={handleEditChange} placeholder="닉네임" style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee' }} />
            <textarea name="selfIntro" value={editProfile.selfIntro} onChange={handleEditChange} placeholder="자기소개" style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee', minHeight: 60 }} />
            <input name="homeAddress" value={editProfile.homeAddress} placeholder="집 주소" readOnly onClick={()=>setShowDongModal('home')} style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', cursor: 'pointer' }} />
            <input name="workAddress" value={editProfile.workAddress} placeholder="회사 주소" readOnly onClick={()=>setShowDongModal('work')} style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', cursor: 'pointer' }} />
            <input name="interestAddress" value={editProfile.interestAddress} placeholder="관심 지역" readOnly onClick={()=>setShowDongModal('interest')} style={{ color: '#444', padding: 8, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', cursor: 'pointer' }} />
            <button style={{ ...btnStyle, marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }} onClick={handleModalSave}>저장</button>
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