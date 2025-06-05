import { useState } from "react";
import { useRouter } from "next/navigation";

const CERT_LIST = [
  "정보처리기사", "SQLD", "ADsP", "네트워크관리사", "리눅스마스터", "컴퓨터활용능력",
  "전산회계1급", "AFP", "CFA", "재경관리사", "은행FP",
  "TOEIC", "TOEFL", "HSK", "JLPT", "OPIc", "텝스",
  "GTQ", "웹디자인기능사", "컴퓨터그래픽스운용기능사",
  "토목기사", "건축기사", "기계설계산업기사",
  "유치원정교사", "보육교사", "청소년지도사"
];

export default function SelectCertPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(s => s !== item));
    } else {
      if (selected.length >= 5) return;
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
        body: JSON.stringify({ certInterests: selected })
      });
      if (res.ok) {
        router.push('/main');
      } else {
        alert('저장 중 오류가 발생했습니다.');
      }
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", padding: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>관심 자격증 선택</h2>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>자격증</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {CERT_LIST.map(item => (
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
              disabled={selected.length >= 5 && !selected.includes(item)}
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
        최대 5개까지 선택할 수 있습니다.
      </div>
    </div>
  );
} 