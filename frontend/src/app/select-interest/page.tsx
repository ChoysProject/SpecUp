'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CategoryItem {
  name: string;
  icon: string;
}

const INDUSTRY_LIST: CategoryItem[] = [
  { name: "의료/건강/제약", icon: "🏥" },
  { name: "IT/포털/인터넷", icon: "💻" },
  { name: "교육업", icon: "📚" },
  { name: "광고/마케팅업계", icon: "📢" },
  { name: "디자인업계", icon: "🎨" },
  { name: "무역/상사", icon: "🌐" },
  { name: "금융업", icon: "💰" },
  { name: "세무/회계", icon: "📊" },
  { name: "법률/법무/법조계", icon: "⚖️" },
  { name: "컨설팅", icon: "📋" },
  { name: "전자/기계/전기", icon: "⚡" },
  { name: "자동차", icon: "🚗" },
  { name: "에너지/화학", icon: "⚛️" },
  { name: "조선/중공업", icon: "🚢" },
  { name: "패션/의류/뷰티", icon: "👗" },
  { name: "건축/건설/인테리어", icon: "🏗️" },
  { name: "물류/항공/운수", icon: "✈️" },
  { name: "백화점/유통/소비재", icon: "🏪" },
  { name: "문화/예술", icon: "🎭" },
  { name: "방송/언론/출판", icon: "📺" },
  { name: "여행/호텔/레저", icon: "🏨" },
  { name: "부동산/중개업", icon: "🏠" },
  { name: "식음료/외식업", icon: "🍽️" },
  { name: "서비스업", icon: "🤝" },
  { name: "게임/엔터테인먼트", icon: "🎮" },
  { name: "환경/재생에너지", icon: "♻️" },
  { name: "농업/축산업", icon: "🌾" },
  { name: "반도체/디스플레이", icon: "🔧" },
  { name: "우주/항공산업", icon: "🛸" },
  { name: "바이오테크놀로지", icon: "🧬" }
];

const JOB_LIST: CategoryItem[] = [
  { name: "기획/전략/경영직", icon: "📈" },
  { name: "의료/보건직", icon: "👨‍⚕️" },
  { name: "교사/강사/교육직", icon: "👩‍🏫" },
  { name: "프로그래머/개발직", icon: "👨‍💻" },
  { name: "디자이너", icon: "👩‍🎨" },
  { name: "마케터/PR", icon: "📣" },
  { name: "영업/제휴직", icon: "🤝" },
  { name: "비서/수행원", icon: "👔" },
  { name: "인사/노무직", icon: "👥" },
  { name: "법률/법무직", icon: "⚖️" },
  { name: "재무/회계/세무직", icon: "🧮" },
  { name: "외국어/통역직", icon: "🌍" },
  { name: "상품기획/MD", icon: "🛍️" },
  { name: "설계/건축가", icon: "📐" },
  { name: "구매/자재직", icon: "🛒" },
  { name: "물류/재고직", icon: "📦" },
  { name: "공정/품질관리", icon: "⚙️" },
  { name: "사회복지사", icon: "🤲" },
  { name: "안내/상담직", icon: "💁" },
  { name: "요리/영양/제빵", icon: "👨‍🍳" },
  { name: "예술/방송인", icon: "🎬" },
  { name: "정비/기술직", icon: "🔧" },
  { name: "체육/스포츠직", icon: "⚽" },
  { name: "뷰티/미용직", icon: "💇" },
  { name: "경호/보안직", icon: "💂" },
  { name: "서비스직", icon: "🛎️" },
  { name: "연구원/과학자", icon: "🔬" },
  { name: "데이터 분석가", icon: "📊" },
  { name: "AI/머신러닝 전문가", icon: "🤖" },
  { name: "환경/에너지 전문가", icon: "🌱" },
  { name: "드론/로봇 전문가", icon: "🛸" },
  { name: "블록체인/핀테크", icon: "💎" }
];

const CERT_LIST = [
  { name: "정보처리기사", category: "IT/개발" },
  { name: "SQLD", category: "IT/개발" },
  { name: "간호사", category: "의료/보건" },
  { name: "한식조리기능사", category: "요리/식음료" },
  // ... 더 많은 자격증
];

export default function SelectInterestPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(s => s !== item));
    } else {
      if (selected.length >= 3) {
        toast.warning("최대 3개까지만 선택 가능합니다.");
        return;
      }
      setSelected([...selected, item]);
    }
  };

  const handleSave = async () => {
    if (selected.length === 0) {
      toast.error("최소 1개 이상의 관심 업종을 선택해주세요.");
      return;
    }

    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (!userId || !accessToken) {
      toast.error('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`http://172.20.193.4:8080/api/users/${userId}/interests`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${accessToken}` 
        },
        body: JSON.stringify({ 
          jobInterests: selected,
          certInterests: null
        })
      });

      if (res.ok) {
        toast.success("관심 업종이 저장되었습니다.");
        setTimeout(() => router.push('/select-cert'), 1200);
      } else {
        const errorText = await res.text();
        console.error("저장 실패:", errorText);
        toast.error('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error("저장 중 에러:", error);
      toast.error('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", padding: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18, color: '#222' }}>업종/직무</h2>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>업종</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {INDUSTRY_LIST.map(item => (
            <button
              key={item.name}
              onClick={() => handleSelect(item.name)}
              style={{
                padding: "10px 18px",
                borderRadius: 18,
                border: selected.includes(item.name) ? "2px solid #3182f6" : "1px solid #ddd",
                background: selected.includes(item.name) ? "#3182f6" : "#fff",
                color: selected.includes(item.name) ? "#fff" : "#222",
                fontWeight: 500,
                fontSize: 15,
                marginBottom: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
              disabled={selected.length >= 3 && !selected.includes(item.name)}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>직무</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {JOB_LIST.map(item => (
            <button
              key={item.name}
              onClick={() => handleSelect(item.name)}
              style={{
                padding: "10px 18px",
                borderRadius: 18,
                border: selected.includes(item.name) ? "2px solid #3182f6" : "1px solid #ddd",
                background: selected.includes(item.name) ? "#3182f6" : "#fff",
                color: selected.includes(item.name) ? "#fff" : "#222",
                fontWeight: 500,
                fontSize: 15,
                marginBottom: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
              disabled={selected.length >= 3 && !selected.includes(item.name)}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <button
          onClick={handleSave}
          disabled={selected.length === 0}
          style={{
            background: selected.length ? "#3182f6" : "#bbb",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 32px",
            fontSize: 17,
            fontWeight: 600,
            cursor: selected.length ? "pointer" : "not-allowed"
          }}
        >
          저장
        </button>
      </div>
      <div style={{ color: "#222", fontSize: 14, marginTop: 18, fontWeight: 500 }}>
        최대 3개까지 선택할 수 있습니다.
      </div>
    </div>
  );
} 