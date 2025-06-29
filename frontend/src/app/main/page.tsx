'use client';
import React from "react";

import { useState, useEffect } from "react";
import { FaBell, FaUserCircle, FaSearch, FaClipboardList, FaFileAlt, FaChartLine, FaCertificate, FaFireAlt, FaChartBar, FaComments, FaLaptopCode, FaCalculator, FaGlobeAsia, FaPaintBrush, FaBuilding, FaChalkboardTeacher, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Lottie from "lottie-react";
import documentAnim from "@/lottie/document.json";
import favorAnim from "@/lottie/favor.json";
import jiwonAnim from "@/lottie/jiwon.json";
import socialAnim from "@/lottie/social.json";
import { useRouter } from 'next/navigation';

const bannerList = [
  { title: "새로 올라온 자격증", desc: "최신 자격증을 확인해보세요!", color: "#3182f6", img: "/banner_char1.png" },
  { title: "가장 많이 찾는 자격증", desc: "인기 자격증을 한눈에!", color: "#f6a431", img: "/banner_char2.png" },
  { title: "추천 자격증", desc: "당신에게 맞는 자격증을 추천해드려요.", color: "#4caf50", img: "/banner_char3.png" },
];

const mainMenus = [
    { anim: documentAnim, label: "나의 스펙관리" },
    { anim: favorAnim, label: "최근 뜨고있는 자격증" },
    { anim: jiwonAnim, label: "지원현황" },
    { anim: socialAnim, label: "커뮤니티" },
  ];

const fieldCerts = [
  { field: "IT/개발", certs: ["정보처리기사", "SQLD", "ADsP", "네트워크관리사", "리눅스마스터", "컴퓨터활용능력"] },
  { field: "회계/금융", certs: ["전산회계1급", "AFP", "CFA", "재경관리사", "은행FP"] },
  { field: "어학", certs: ["TOEIC", "TOEFL", "HSK", "JLPT", "OPIc", "텝스"] },
  { field: "디자인", certs: ["GTQ", "웹디자인기능사", "컴퓨터그래픽스운용기능사"] },
  { field: "건설/기계", certs: ["토목기사", "건축기사", "기계설계산업기사"] },
  { field: "교육", certs: ["유치원정교사", "보육교사", "청소년지도사"] },
];

const recruitBanners = [
  { img: "/images/AI.PNG", title: "AI 예측 90점! 백엔드 개발자 채용", company: "카카오", desc: "경력 3년 이상, 연봉 협상" },
  { img: "/images/BigData.PNG", title: "프론트엔드 개발자 채용", company: "네이버", desc: "신입/경력, 하이브리드 근무" },
  { img: "/images/FrontDeveloper.PNG", title: "데이터 분석가 채용", company: "쿠팡", desc: "경력 2년 이상, 유연근무" },
];

const studyList = [
  {
    id: 1,
    cert: "정보처리기사",
    field: "IT/개발",
    img: "/images/it_study.png",
    people: { total: 5, current: 2 },
    desc: "함께 공부하며 합격까지! 매주 온라인 스터디 진행",
  },
  {
    id: 2,
    cert: "전산회계1급",
    field: "회계/금융",
    img: "/images/account_study.png",
    people: { total: 4, current: 3 },
    desc: "기출문제 풀이 & 실전 모의고사 스터디",
  },
  // ...더 추가
];

// 분야 목록 추출
const studyFields = ["전체", ...Array.from(new Set(studyList.map(s => s.field)))];

const studyFieldIcons = [
  { field: "IT/개발", icon: <FaLaptopCode color="#3182f6" size={22} /> },
  { field: "회계/금융", icon: <FaCalculator color="#3182f6" size={22} /> },
  { field: "어학", icon: <FaGlobeAsia color="#3182f6" size={22} /> },
  { field: "디자인", icon: <FaPaintBrush color="#3182f6" size={22} /> },
  { field: "건설/기계", icon: <FaBuilding color="#3182f6" size={22} /> },
  { field: "교육", icon: <FaChalkboardTeacher color="#3182f6" size={22} /> },
];

// 대화방 인기 예시 데이터 (실제 API 연동 전 임시)
const popularChatRooms = [
  { roomId: "1", title: "백엔드 개발자방", field: "IT/개발", createdBy: "홍길동" },
  { roomId: "2", title: "정보처리기사 합격방", field: "IT/개발", createdBy: "김자격" },
  { roomId: "3", title: "전산회계1급 준비방", field: "회계/금융", createdBy: "이회계" },
  { roomId: "4", title: "TOEIC 고득점방", field: "어학", createdBy: "박영어" },
];

// 분야별 이모티콘 매핑
const fieldIcons: Record<string, JSX.Element> = {
  "IT/개발": <FaLaptopCode color="#3182f6" size={28} style={{ marginRight: 10 }} />,
  "회계/금융": <FaCalculator color="#3182f6" size={28} style={{ marginRight: 10 }} />,
  "어학": <FaGlobeAsia color="#3182f6" size={28} style={{ marginRight: 10 }} />,
  "디자인": <FaPaintBrush color="#3182f6" size={28} style={{ marginRight: 10 }} />,
  "건설/기계": <FaBuilding color="#3182f6" size={28} style={{ marginRight: 10 }} />,
  "교육": <FaChalkboardTeacher color="#3182f6" size={28} style={{ marginRight: 10 }} />,
};

export default function MainPage() {
  const [bannerIdx, setBannerIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  // 스터디 모집 필터링 상태
  const [selectedField, setSelectedField] = useState("전체");
  // 모달 상태 등 기존 코드 유지
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<typeof studyList[0] | null>(null);
  const [joinMsg, setJoinMsg] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [fieldPopupOpen, setFieldPopupOpen] = useState(false);
  const [recruitPopupOpen, setRecruitPopupOpen] = useState(false);
  const router = useRouter();
  const [chatScroll, setChatScroll] = useState(0);
  const maxVisible = 10;
  const visibleRooms = popularChatRooms.slice(chatScroll, chatScroll + maxVisible);
  const canScrollLeft = chatScroll > 0;
  const canScrollRight = chatScroll + maxVisible < popularChatRooms.length;

  // 배너 자동 전환 (3초)
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIdx(idx => (idx + 1) % bannerList.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 필터링된 스터디 리스트
  const filteredStudyList = selectedField === "전체"
    ? studyList
    : studyList.filter(s => s.field === selectedField);

  // 모달 오픈 함수
  const openModal = (study: typeof studyList[0]) => {
    setSelectedStudy(study);
    setJoinMsg("");
    setJoinSuccess(false);
    setModalOpen(true);
  };
  // 모달 닫기 함수
  const closeModal = () => {
    setModalOpen(false);
    setSelectedStudy(null);
    setJoinMsg("");
    setJoinSuccess(false);
  };
  // 참여하기 버튼 클릭
  const handleJoin = () => {
    if (joinMsg.trim().length < 2) {
      alert("참여 메시지를 입력해 주세요!");
      return;
    }
    setJoinSuccess(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#181A20", paddingBottom: 80 }}>
      {/* 상단바(헤더) */}
      <Header />

      {/* 배너 (슬라이드) */}
      <div style={{ margin: "80px 0 64px 0", height: 180, position: "relative", overflow: "hidden" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={bannerIdx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: bannerList[bannerIdx].color,
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              padding: "0 40px 0 32px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              color: '#fff',
              overflow: 'hidden',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 10 }}>{bannerList[bannerIdx].title}</div>
              <div style={{ fontSize: 18, opacity: 0.95 }}>{bannerList[bannerIdx].desc}</div>
            </div>
            <img src={bannerList[bannerIdx].img} alt="배너 캐릭터" style={{ height: 140, width: 140, objectFit: 'contain', marginLeft: 24, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 주요 메뉴 (센터 고정 4개) */}
      <div style={{ display: "flex", justifyContent: "center", gap: 32, margin: "0 0 64px 0" }}>
        {mainMenus.map((menu, idx) => (
          <div
            key={menu.label}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", minWidth: 80 }}
            onMouseEnter={() => setHoverIdx(idx)}
            onMouseLeave={() => setHoverIdx(null)}
            onClick={() => {
              if (menu.label === "나의 스펙관리") {
                router.push("/myspec");
              }
            }}
          >
            <div style={{ background: "#e3f0ff", borderRadius: 16, width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
              {hoverIdx === idx ? (
                <Lottie
                  key="play"
                  animationData={menu.anim}
                  loop
                  autoplay
                  style={{ width: 40, height: 40 }}
                />
              ) : (
                <Lottie
                  key="pause"
                  animationData={menu.anim}
                  loop={false}
                  autoplay={false}
                  initialSegment={[0, 1]}
                  style={{ width: 40, height: 40 }}
                />
              )}
            </div>
            <span style={{ fontSize: 13, color: "#3182f6" }}>{menu.label}</span>
          </div>
        ))}
      </div>

      {/* 분야별 자격증 (가로 슬라이드) */}
      <div style={{ margin: "0 0 64px 0" }}>
        <div style={{ fontWeight: 600, fontSize: 17, margin: "40px 0 30px 20px", color: '#3182f6' }}>분야별 자격증</div>
        <div style={{ display: "flex", overflowX: "auto", gap: 24, padding: "0 0 10px 20px" }}>
          {fieldCerts.map(f => (
            <div key={f.field} style={{ minWidth: 180, background: "#f7faff", borderRadius: 14, padding: "18px 16px 16px 16px", boxShadow: "0 2px 8px rgba(49,130,246,0.06)", marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 10, color: "#3182f6" }}>{f.field}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {f.certs.map(cert => (
                  <div key={cert} style={{ background: "#e3f0ff", borderRadius: 10, padding: "6px 12px", fontSize: 13, color: "#3182f6", marginBottom: 4 }}>
                    {cert}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 스터디 모집 섹터 (이동) */}
      <div style={{ margin: "0 0 64px 0" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: "0 0 18px 20px" }}>
          <span style={{ fontWeight: 600, fontSize: 17, color: '#3182f6' }}>스터디 모집</span>
          {/* 분야 선택 아이콘 버튼 */}
          <button
            onClick={() => setFieldPopupOpen(true)}
            style={{ background: '#e3f0ff', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {studyFieldIcons.find(f => f.field === selectedField) ? studyFieldIcons.find(f => f.field === selectedField)?.icon : <FaLaptopCode color="#3182f6" size={22} />}<span style={{ color: '#3182f6', fontWeight: 500, fontSize: 15 }}>{selectedField}</span>
          </button>
          {/* 스터디 모집하기 버튼 */}
          <button
            onClick={() => router.push('/study/recruit')}
            style={{ background: '#3182f6', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}
          >
            <FaPlus size={16} /> 스터디 모집하기
          </button>
        </div>
        {/* 분야 선택 팝업 */}
        {fieldPopupOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.15)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setFieldPopupOpen(false)}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 260, boxShadow: '0 4px 24px rgba(49,130,246,0.13)', display: 'flex', flexDirection: 'column', gap: 16 }} onClick={e => e.stopPropagation()}>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#3182f6', marginBottom: 8 }}>분야 선택</div>
              <button onClick={() => { setSelectedField('전체'); setFieldPopupOpen(false); }} style={{ background: '#e3f0ff', border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 500, color: '#3182f6', fontSize: 15, marginBottom: 4 }}>전체</button>
              {studyFieldIcons.map(f => (
                <button key={f.field} onClick={() => { setSelectedField(f.field); setFieldPopupOpen(false); }} style={{ background: selectedField === f.field ? '#b6d8ff' : '#e3f0ff', border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 500, color: '#3182f6', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {f.icon} {f.field}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* 스터디 카드 슬라이드 */}
        <div style={{ display: "flex", overflowX: "auto", gap: 18, padding: "0 0 10px 20px", flexWrap: "wrap" }}>
          {filteredStudyList.length === 0 ? (
            <div style={{ color: '#888', fontSize: 15, padding: 30 }}>해당 분야의 스터디 모집글이 없습니다.</div>
          ) : (
            filteredStudyList.map(study => (
              <div
                key={study.id}
                style={{
                  minWidth: 220,
                  maxWidth: 260,
                  background: "#fff",
                  borderRadius: 14,
                  boxShadow: "0 2px 8px rgba(49,130,246,0.08)",
                  padding: 0,
                  overflow: "hidden",
                  border: "1px solid #e3f0ff",
                  marginBottom: 12,
                  cursor: "pointer"
                }}
                onClick={() => openModal(study)}
              >
                <img src={study.img} alt={study.cert} style={{ width: "100%", height: 90, objectFit: "cover" }} />
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: "#3182f6", marginBottom: 4 }}>{study.cert}</div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>{study.field} | {study.people.current}/{study.people.total}명</div>
                  <div style={{ fontSize: 12, color: "#444" }}>{study.desc}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 지금 핫한 단체대화방 섹션 */}
      <div style={{ margin: "0 0 64px 0" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: "0 0 18px 20px" }}>
          <span style={{ fontWeight: 700, fontSize: 19, color: '#3182f6', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span role="img" aria-label="fire" style={{ fontSize: 22, marginRight: 2 }}>🔥</span>지금 핫한 단체대화방
          </span>
          <button
            onClick={() => router.push('/chatrooms')}
            style={{ background: '#3182f6', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, fontSize: 15, marginLeft: 'auto', cursor: 'pointer' }}
          >
            전체 대화방 보기
          </button>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: 'nowrap', justifyContent: 'flex-start', padding: "0 0 10px 20px", overflowX: 'auto', cursor: 'grab' }}>
          {popularChatRooms.slice(0, 10).map(room => (
            <div key={room.roomId} style={{ minWidth: 260, maxWidth: 340, background: "#e3f0ff", borderRadius: 18, padding: "22px 28px", boxShadow: "0 2px 8px rgba(49,130,246,0.10)", marginBottom: 18, display: 'flex', alignItems: 'center', gap: 18, border: "1px solid #c7e0ff" }}>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  {fieldIcons[room.field]}
                  <span style={{ fontWeight: 700, fontSize: 18, color: "#3182f6" }}>{room.title}</span>
                </div>
                <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>{room.field} | {room.createdBy}</div>
                <button onClick={() => router.push(`/chatroom/${room.roomId}`)} style={{ background: "#3182f6", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 500, cursor: "pointer", fontSize: 15, alignSelf: 'flex-start' }}>입장</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 커뮤니티 게시판 섹션 (이전 직무, 업종별 커뮤니티 게시판) */}
      <div style={{ margin: "0 0 64px 0", padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <span style={{ fontWeight: 700, fontSize: 19, color: '#3182f6' }}>커뮤니티 게시판</span>
          <button
            onClick={() => router.push('/communities')}
            style={{ background: '#3182f6', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, fontSize: 15, marginLeft: 'auto', cursor: 'pointer' }}
          >
            전체 게시판 보기
          </button>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'nowrap', justifyContent: 'flex-start', overflowX: 'auto', cursor: 'grab' }}>
          {/* 예시 커뮤니티 카드, 추후 동적 구현 */}
          <div style={{ minWidth: 220, maxWidth: 300, background: '#f7faff', borderRadius: 14, padding: '18px 16px', boxShadow: '0 2px 8px rgba(49,130,246,0.06)', border: '1px solid #e3f0ff', marginBottom: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#3182f6', marginBottom: 6 }}>IT/개발 커뮤니티</div>
            <div style={{ fontSize: 14, color: '#888' }}>IT/개발 직무, 자격증 정보와 실시간 소통!</div>
          </div>
          <div style={{ minWidth: 220, maxWidth: 300, background: '#f7faff', borderRadius: 14, padding: '18px 16px', boxShadow: '0 2px 8px rgba(49,130,246,0.06)', border: '1px solid #e3f0ff', marginBottom: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#3182f6', marginBottom: 6 }}>회계/금융 커뮤니티</div>
            <div style={{ fontSize: 14, color: '#888' }}>회계/금융 직무, 자격증 정보와 실시간 소통!</div>
          </div>
          {/* ...추가 커뮤니티 카드 */}
        </div>
      </div>

      {/* 현재 뜨고 있는 채용 배너 (가로 슬라이드) */}
      <div style={{ margin: "0 0 64px 0" }}>
        <div style={{ fontWeight: 600, fontSize: 17, margin: "0 0 18px 20px", color: '#3182f6' }}>현재 뜨고 있는 채용</div>
        <div style={{ display: "flex", overflowX: "auto", gap: 18, padding: "0 0 10px 20px" }}>
          {recruitBanners.map(banner => (
            <div key={banner.title} style={{ minWidth: 220, background: "#fff", borderRadius: 14, boxShadow: "0 2px 8px rgba(49,130,246,0.08)", padding: 0, overflow: "hidden", border: "1px solid #e3f0ff" }}>
              <img src={banner.img} alt={banner.title} style={{ width: "100%", height: 100, objectFit: "cover" }} />
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#3182f6", marginBottom: 4 }}>{banner.title}</div>
                <div style={{ fontSize: 13, color: "#444", marginBottom: 2 }}>{banner.company}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{banner.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 스터디 모집 모달 */}
      {modalOpen && selectedStudy && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.25)", zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={closeModal}>
          <div style={{ background: '#fff', borderRadius: 18, minWidth: 320, maxWidth: 380, padding: 28, boxShadow: '0 4px 24px rgba(49,130,246,0.13)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <img src={selectedStudy.img} alt={selectedStudy.cert} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 12, marginBottom: 18 }} />
            <div style={{ fontWeight: 700, fontSize: 20, color: '#3182f6', marginBottom: 6 }}>{selectedStudy.cert}</div>
            <div style={{ fontSize: 15, color: '#888', marginBottom: 4 }}>{selectedStudy.field} | {selectedStudy.people.current}/{selectedStudy.people.total}명</div>
            <div style={{ fontSize: 14, color: '#444', marginBottom: 18 }}>{selectedStudy.desc}</div>
            {!joinSuccess ? (
              <>
                <textarea
                  value={joinMsg}
                  onChange={e => setJoinMsg(e.target.value)}
                  placeholder="참여하고 싶습니다. (간단한 메시지 입력)"
                  style={{ width: '100%', minHeight: 48, borderRadius: 8, border: '1px solid #e3f0ff', padding: 8, marginBottom: 12, fontSize: 14 }}
                />
                <button
                  onClick={handleJoin}
                  style={{ width: '100%', background: '#3182f6', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                >
                  참여하기
                </button>
              </>
            ) : (
              <div style={{ color: '#4caf50', fontWeight: 600, fontSize: 16, textAlign: 'center', marginTop: 18 }}>
                참여 신청이 완료되었습니다!<br />스터디장에게 메시지가 전달됩니다.
              </div>
            )}
            <button onClick={closeModal} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
}