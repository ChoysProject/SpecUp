'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// profile 타입 명시
type ProfileType = {
  name: string;
  birth: string;
  age: number | null;
  email: string;
  phone: string;
  address: string;
  photo: string;
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

  // userId 추출 (실제 서비스에서는 JWT decode 필요)
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  // 마이스펙 불러오기
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/users/${userId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setProfile({
            name: data.name,
            birth: data.birth,
            age: data.age,
            email: data.email,
            phone: data.phone,
            address: data.address,
            photo: data.photoUrl,
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
  }, [userId]);

  // 저장/수정 핸들러 (PUT만 사용)
  const handleSave = async () => {
    if (!userId) {
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
        headers: { "Content-Type": "application/json" },
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

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 48, background: "#fff" }}>
      <ToastContainer position="top-center" autoClose={1500} hideProgressBar />
      {/* 프로필 */}
      <div style={{ display: "flex", alignItems: "center", gap: 32, borderBottom: "1px solid #eee", paddingBottom: 32, marginBottom: 32 }}>
        <div style={{ flex: 1 }}>
          {profile ? (
            <>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{profile.name}</div>
              <div style={{ color: "#888", margin: "6px 0" }}>{profile.birth} ({profile.age}세)</div>
              <div style={{ color: "#666", fontSize: 16, marginBottom: 8 }}>{profile.email} | {profile.phone}</div>
              <div style={{ color: "#666", fontSize: 16 }}>{profile.address}</div>
            </>
          ) : (
            <div style={{ color: "#bbb", fontSize: 20 }}>프로필 정보를 입력해주세요.</div>
          )}
        </div>
        <div>
          {profile && profile.photo ? (
            <Image src={profile.photo} alt="증명사진" width={120} height={150} style={{ borderRadius: 12, objectFit: "cover" }} />
          ) : (
            <div style={{ width: 120, height: 150, background: "#f0f0f0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb" }}>
              사진 없음
            </div>
          )}
          <button
            style={{ ...btnStyle, marginTop: 12 }}
            onClick={handleSave}
          >
            {profile ? <><span style={{ fontSize: 18 }}>+ 수정</span></> : <><span style={{ fontSize: 18 }}>+ 추가</span></>}
          </button>
        </div>
      </div>

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

      {/* 스킬 */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>스킬/주특기</h2>
          <button
            style={{ ...btnStyle, marginTop: 12 }}
            onClick={() => skills.length ? handleEdit("스킬") : handleAdd("스킬")}
          >
            {skills.length ? "수정하기" : "추가하기"}
          </button>
        </div>
        {skills.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {skills.map((s: string, i: number) => (
              <span key={i} style={{ background: "#e3f0ff", color: "#3182f6", borderRadius: 16, padding: "6px 16px", fontSize: 15 }}>{s}</span>
            ))}
          </div>
        ) : (
          <div style={{ color: "#bbb", fontSize: 16 }}>스킬/주특기를 입력해주세요.</div>
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
    </div>
  );
}