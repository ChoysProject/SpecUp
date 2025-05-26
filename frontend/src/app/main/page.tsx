'use client';

import { useState, useEffect } from "react";
import { FaBell, FaUserCircle, FaSearch, FaClipboardList, FaFileAlt, FaChartLine, FaCertificate, FaFireAlt, FaChartBar, FaComments } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Lottie from "lottie-react";
import documentAnim from "@/lottie/document.json";
import favorAnim from "@/lottie/favor.json";
import jiwonAnim from "@/lottie/jiwon.json";
import socialAnim from "@/lottie/social.json";

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

export default function MainPage() {
  const [bannerIdx, setBannerIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // 배너 자동 전환 (3초)
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIdx(idx => (idx + 1) % bannerList.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#181A20", paddingBottom: 80 }}>
      {/* 상단바(헤더) */}
      <Header />

      {/* 배너 (슬라이드) */}
      <div style={{ margin: "80px 0 48px 0", height: 180, position: "relative", overflow: "hidden" }}>
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
      <div style={{ display: "flex", justifyContent: "center", gap: 32, margin: "0 0 36px 0" }}>
        {mainMenus.map((menu, idx) => (
          <div
            key={menu.label}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", minWidth: 80 }}
            onMouseEnter={() => setHoverIdx(idx)}
            onMouseLeave={() => setHoverIdx(null)}
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
      <div style={{ margin: "0 0 40px 0" }}>
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

      {/* 소셜 대화방 & 자격증 소개 섹터 */}
      <div style={{ margin: "40px 0 32px 0", padding: "0 20px" }}>
        <div style={{ display: "flex", gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
          {/* IT 대화방 */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#e3f0ff', borderRadius: 18, padding: '18px 28px', flex: 1, minWidth: 260, maxWidth: 400 }}>
            <img src="/images/IT.jpg" alt="IT 대화방" style={{ width: 80, height: 80, borderRadius: 18, background: "#e3f0ff", marginRight: 20, objectFit: 'cover' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#3182f6" }}>IT 대화방</div>
              <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>IT/개발 자격증 실시간 소통!</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ background: "#3182f6", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 500, cursor: "pointer", fontSize: 15 }}>
                  입장하기
                </button>
              </div>
            </div>
          </div>
          {/* 금융 소셜방 */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#e3f0ff', borderRadius: 18, padding: '18px 28px', flex: 1, minWidth: 260, maxWidth: 400 }}>
            <img src="/images/money.jpg" alt="금융 소셜방" style={{ width: 80, height: 80, borderRadius: 18, background: "#e3f0ff", marginRight: 20, objectFit: 'cover' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#3182f6" }}>금융 소셜방</div>
              <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>회계/금융 자격증 정보와 실시간 소통!</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ background: "#3182f6", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 500, cursor: "pointer", fontSize: 15 }}>
                  입장하기
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: "#f7faff", borderRadius: 14, padding: "22px 20px", marginTop: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: "#3182f6", marginBottom: 8 }}>자격증 소개</div>
          <div style={{ fontSize: 14, color: "#444" }}>
            다양한 분야의 자격증 정보를 한눈에!  <br />취득 방법, 시험 일정, 합격 꿀팁까지 모두 확인해보세요.
          </div>
        </div>
      </div>

      {/* 현재 뜨고 있는 채용 배너 (가로 슬라이드) */}
      <div style={{ margin: "0 0 40px 0" }}>
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
    </div>
  );
}