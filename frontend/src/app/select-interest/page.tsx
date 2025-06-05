import { useState } from "react";
import { useRouter } from "next/navigation";

const INDUSTRY_LIST = [
  "의료/건강/제약", "IT/포털/인터넷", "교육업", "광고/마케팅업계", "디자인업계", "무역/상사", "금융업", "세무/회계",
  "법률/법무/법조계", "컨설팅", "전자/기계/전기", "자동차", "에너지/화학", "조선/중공업", "패션/의류/뷰티",
  "건축/건설/인테리어", "물류/항공/운수", "백화점/유통/소비재", "문화/예술", "방송/언론/출판", "여행/호텔/레저",
  "부동산/중개업", "식음료/외식업", "서비스업"
];
const JOB_LIST = [
  "기획/전략/경영직", "의료/보건직", "교사/강사/교육직", "프로그래머/개발직", "디자이너", "마케터/PR", "영업/제휴직",
  "비서/수행원", "인사/노무직", "법률/법무직", "재무/회계/세무직", "외국어/통역직", "상품기획/MD", "설계/건축가", "구매/자재직",
  "물류/재고직", "공정/품질관리", "사회복지사", "안내/상담직", "요리/영양/제빵", "예술/방송인", "정비/기술직", "체육/스포츠직",
  "뷰티/미용직", "경호/보안직", "서비스직"
];

export default function SelectInterestPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(s => s !== item));
    } else {
      if (selected.length >= 3) return;
      setSelected([...selected, item]);
    }
  };

  const handleSave = async () => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!userId || !accessToken) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ jobInterests: selected })
      });
      if (res.ok) {
        router.push('/select-cert');
      } else {
        alert('저장 중 오류가 발생했습니다.');
      }
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", padding: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>업종/직무</h2>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>업종</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {INDUSTRY_LIST.map(item => (
            <button
              key={item}
              onClick={() => handleSelect(item)}
              style={{
                padding: "10px 18px",
                borderRadius: 18,
                border: selected.includes(item) ? "2px solid #3182f6" : "1px solid #ddd",
                background: selected.includes(item) ? "#3182f6" : "#fff",
                color: selected.includes(item) ? "#fff" : "#222",
                fontWeight: 500,
                fontSize: 15,
                marginBottom: 8,
                cursor: "pointer"
              }}
              disabled={selected.length >= 3 && !selected.includes(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>직무</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {JOB_LIST.map(item => (
            <button
              key={item}
              onClick={() => handleSelect(item)}
              style={{
                padding: "10px 18px",
                borderRadius: 18,
                border: selected.includes(item) ? "2px solid #3182f6" : "1px solid #ddd",
                background: selected.includes(item) ? "#3182f6" : "#fff",
                color: selected.includes(item) ? "#fff" : "#222",
                fontWeight: 500,
                fontSize: 15,
                marginBottom: 8,
                cursor: "pointer"
              }}
              disabled={selected.length >= 3 && !selected.includes(item)}
            >
              {item}
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
      <div style={{ color: "#888", fontSize: 14, marginTop: 18 }}>
        최대 3개까지 선택할 수 있습니다.
      </div>
    </div>
  );
} 