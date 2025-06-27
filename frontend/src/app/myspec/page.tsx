'use client';

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// profile 타입 명시
type ProfileType = {
  name: string;
  email: string;
  gender: string;
  birth: string;
  age: number | null;
  photo: string;
  homeAddress: string;
  workAddress: string;
  interestAddress: string;
  mbti?: string;
  jobInterests?: string[];
  certInterests?: string[];
  selfIntro?: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // userId 추출 (실제 서비스에서는 JWT decode 필요)
  useEffect(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!userId || !accessToken) {
      window.location.href = '/login';
      return;
    }
    fetch(`/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setProfile({
            name: data.name,
            email: data.email,
            gender: data.gender,
            birth: data.birth,
            age: data.age,
            photo: data.photoUrl,
            homeAddress: data.homeAddress,
            workAddress: data.workAddress,
            interestAddress: data.interestAddress,
            mbti: data.mbti,
            jobInterests: data.jobInterests || [],
            certInterests: data.certInterests || [],
            selfIntro: data.selfIntro || "",
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

  // 저장/수정 핸들러 (PUT만 사용)
  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('accessToken');
    if (!userId || !accessToken) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    const userSpec = {
      userId,
      name: profile?.name || "",
      birth: profile?.birth || "",
      age: profile?.age || null,
      email: profile?.email || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      photoUrl: profile?.photo || "",
      careers: career,
      educations: education,
      skills,
      experiences,
      certificates,
      portfolios,
      selfIntro,
    };
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
        body: JSON.stringify(userSpec),
      });
      if (res.ok) {
        toast.success("수정 완료!");
      } else {
        toast.error("저장 중 오류가 발생했습니다.");
      }
    } catch {
      toast.error("저장 중 오류가 발생했습니다.");
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

  // 버튼 클릭 핸들러 예시
  const handleAdd = (section: any) => alert(`${section} 추가하기`);
  const handleEdit = (section: any) => alert(`${section} 수정하기`);

  // 프로필 사진 업로드 핸들러
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      // photo만 업데이트
      if (profile) {
        const userId = localStorage.getItem('userId');
        const accessToken = localStorage.getItem('accessToken');
        const updatedProfile = { ...profile, photo: base64 };
        setProfile(updatedProfile);
        // 서버에 저장
        await fetch(`/api/users/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
          body: JSON.stringify({ ...updatedProfile }),
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // 자기소개 수정 핸들러
  const handleSelfIntroChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newIntro = e.target.value;
    setProfile(prev => prev ? { ...prev, selfIntro: newIntro } : prev);
    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('accessToken');
    await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
      body: JSON.stringify({ ...profile, selfIntro: newIntro }),
    });
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 24, background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #eee", boxSizing: 'border-box' }}>
      <ToastContainer position="top-center" autoClose={1500} hideProgressBar />
      {/* 프로필 카드형 상단 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, borderBottom: "1px solid #eee", paddingBottom: 24, marginBottom: 24, width: '100%' }}>
        <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handlePhotoChange} />
        {profile && profile.photo ? (
          <div style={{ cursor: 'pointer' }} onClick={handlePhotoClick}>
            <Image src={profile.photo} alt="증명사진" width={96} height={96} style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #e3e3e3" }} />
          </div>
        ) : (
          <div style={{ width: 96, height: 96, background: "#f0f0f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", fontSize: 18, border: "2px solid #e3e3e3", cursor: 'pointer' }} onClick={handlePhotoClick}>
            사진 없음
          </div>
        )}
        <div style={{ fontSize: 22, fontWeight: 700 }}>{profile?.name || '-'}</div>
        <div style={{ color: "#888", fontSize: 15 }}>{profile?.email || '-'}</div>
        <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
          <span style={{ background: "#f5f5f5", borderRadius: 12, padding: "2px 12px", fontSize: 14 }}>{profile?.gender || '-'}</span>
          <span style={{ background: "#f5f5f5", borderRadius: 12, padding: "2px 12px", fontSize: 14 }}>{profile?.birth || '-'}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          <span style={{ background: "#e3f0ff", color: "#3182f6", borderRadius: 12, padding: "2px 12px", fontSize: 14 }}>집: {profile?.homeAddress || '-'}</span>
          <span style={{ background: "#e3f0ff", color: "#3182f6", borderRadius: 12, padding: "2px 12px", fontSize: 14 }}>회사: {profile?.workAddress || '-'}</span>
          <span style={{ background: "#e3f0ff", color: "#3182f6", borderRadius: 12, padding: "2px 12px", fontSize: 14 }}>관심지역: {profile?.interestAddress || '-'}</span>
        </div>
        {profile?.mbti && (
          <div style={{ marginTop: 6, color: "#666", fontSize: 15 }}>MBTI: {profile.mbti}</div>
        )}
        <div style={{ marginTop: 10, color: "#444", fontSize: 15, textAlign: "center", minHeight: 24, width: '100%' }}>
          <textarea
            value={profile?.selfIntro || ''}
            onChange={handleSelfIntroChange}
            placeholder="소개를 입력해주세요."
            style={{ width: '100%', minHeight: 60, border: '1px solid #eee', borderRadius: 8, padding: 8, fontSize: 15, resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>
        <button
          style={{ ...btnStyle, marginTop: 12 }}
          onClick={handleSave}
        >
          {profile ? <><span style={{ fontSize: 18 }}>+ 수정</span></> : <><span style={{ fontSize: 18 }}>+ 추가</span></>}
        </button>
      </div>
      {/* 관심 직무/업무, 관심 자격증 태그형 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        <div>
          <span style={{ fontWeight: 600, fontSize: 15 }}>관심 직무/업무</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
            {profile?.jobInterests && profile.jobInterests.length > 0 ? (
              profile.jobInterests.map((job, i) => (
                <span key={i} style={{ background: "#f9e7ff", color: "#a14ee6", borderRadius: 12, padding: "4px 12px", fontSize: 14 }}>{job}</span>
              ))
            ) : (
              <span style={{ color: "#bbb", fontSize: 14 }}>-</span>
            )}
          </div>
        </div>
        <div>
          <span style={{ fontWeight: 600, fontSize: 15 }}>관심 자격증</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
            {profile?.certInterests && profile.certInterests.length > 0 ? (
              profile.certInterests.map((cert, i) => (
                <span key={i} style={{ background: "#e3f0ff", color: "#3182f6", borderRadius: 12, padding: "4px 12px", fontSize: 14 }}>{cert}</span>
              ))
            ) : (
              <span style={{ color: "#bbb", fontSize: 14 }}>-</span>
            )}
          </div>
        </div>
      </div>

      {/* 두번째 섹터: 경력, 학력, 포트폴리오 바로가기, 수상/기타 */}
      <section style={{ marginTop: 32, display: 'flex', gap: 24, justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>경력</h3>
          {career.length ? (
            <div>{career[0].company} 외 {career.length - 1}건</div>
          ) : (
            <div style={{ color: "#bbb" }}>-</div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>학력</h3>
          {education.length ? (
            <div>{education[0].school} 외 {education.length - 1}건</div>
          ) : (
            <div style={{ color: "#bbb" }}>-</div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>포트폴리오</h3>
          {portfolios.length ? (
            <a href={portfolios[0].url} target="_blank" rel="noopener noreferrer" style={{ color: "#3182f6", textDecoration: "underline" }}>{portfolios[0].name}</a>
          ) : (
            <div style={{ color: "#bbb" }}>-</div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>수상/기타</h3>
          {certificates.length ? (
            <div>{certificates[0].name} 외 {certificates.length - 1}건</div>
          ) : (
            <div style={{ color: "#bbb" }}>-</div>
          )}
        </div>
      </section>

      {/* 나의 자격증 (스킬/주특기 섹터를 자격증으로 변경) */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>나의 자격증</h2>
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
          <div style={{ color: "#bbb", fontSize: 16 }}>자격증 정보를 입력해주세요.</div>
        )}
      </section>

      {/* 경력 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>경력</h2>
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
          <div style={{ color: "#bbb", fontSize: 16 }}>경력 정보를 입력해주세요.</div>
        )}
      </section>

      {/* 학력 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>학력</h2>
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
          <div style={{ color: "#bbb", fontSize: 16 }}>학력 정보를 입력해주세요.</div>
        )}
      </section>

      {/* 경험/활동/교육 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>경험/활동/교육</h2>
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
          <div style={{ color: "#bbb", fontSize: 16 }}>경험/활동/교육 정보를 입력해주세요.</div>
        )}
      </section>

      {/* 자격/어학/수상 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>자격/어학/수상</h2>
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
          <div style={{ color: "#bbb", fontSize: 16 }}>자격/어학/수상 정보를 입력해주세요.</div>
        )}
      </section>

      {/* 포트폴리오 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>포트폴리오 및 기타문서</h2>
          <button
            style={{ ...btnStyle, marginTop: 12 }}
            onClick={() => portfolios.length ? handleEdit("포트폴리오") : handleAdd("포트폴리오")}
          >
            {portfolios.length ? "수정하기" : "추가하기"}
          </button>
        </div>
        {portfolios.length ? (
          portfolios.map((p: PortfolioType, i: number) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: "#3182f6", textDecoration: "underline" }}>{p.name}</a>
            </div>
          ))
        ) : (
          <div style={{ color: "#bbb", fontSize: 16 }}>포트폴리오를 입력해주세요.</div>
        )}
      </section>

      {/* 자기소개 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>자기소개</h2>
          <button
            style={{ ...btnStyle, marginTop: 12 }}
            onClick={() => selfIntro ? handleEdit("자기소개") : handleAdd("자기소개")}
          >
            {selfIntro ? "수정하기" : "추가하기"}
          </button>
        </div>
        {selfIntro ? (
          <div style={{ color: "#444", fontSize: 16, whiteSpace: "pre-line" }}>{selfIntro}</div>
        ) : (
          <div style={{ color: "#bbb", fontSize: 16 }}>자기소개를 입력해주세요.</div>
        )}
      </section>

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