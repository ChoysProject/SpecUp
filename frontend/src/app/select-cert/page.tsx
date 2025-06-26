'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CERT_LIST = [
  { name: "정보처리기사", category: "IT/개발" },
  { name: "SQLD", category: "IT/개발" },
  { name: "네트워크관리사", category: "IT/개발" },
  { name: "리눅스마스터", category: "IT/개발" },
  { name: "AWS", category: "IT/개발" },
  { name: "CCNA", category: "IT/개발" },
  { name: "정보보안기사", category: "IT/개발" },
  { name: "간호사", category: "의료/보건" },
  { name: "임상병리사", category: "의료/보건" },
  { name: "물리치료사", category: "의료/보건" },
  { name: "영양사", category: "의료/보건" },
  { name: "한식조리기능사", category: "요리/식음료" },
  { name: "제과기능사", category: "요리/식음료" },
  { name: "제빵기능사", category: "요리/식음료" },
  { name: "바리스타", category: "요리/식음료" },
  { name: "토익", category: "어학" },
  { name: "토스", category: "어학" },
  { name: "오픽", category: "어학" },
  { name: "JLPT", category: "어학" },
  { name: "HSK", category: "어학" },
  { name: "DELF", category: "어학" },
  { name: "DELE", category: "어학" },
  { name: "전기기사", category: "기계/전기" },
  { name: "전기공사기사", category: "기계/전기" },
  { name: "기계설계산업기사", category: "기계/전기" },
  { name: "건축기사", category: "건설/안전" },
  { name: "산업안전기사", category: "건설/안전" },
  { name: "소방설비기사", category: "건설/안전" },
  { name: "사회복지사", category: "사회/교육" },
  { name: "보육교사", category: "사회/교육" },
  { name: "청소년지도사", category: "사회/교육" },
  { name: "공인중개사", category: "경영/사무" },
  { name: "세무사", category: "경영/사무" },
  { name: "회계사", category: "경영/사무" },
  { name: "노무사", category: "경영/사무" },
  // ... 필요시 더 추가
];

const CATEGORY_LIST = Array.from(new Set(CERT_LIST.map(cert => cert.category)));

export default function SelectCertPage() {
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
      toast.error("최소 1개 이상의 관심 자격증을 선택해주세요.");
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
          jobInterests: null,
          certInterests: selected
        })
      });

      if (res.ok) {
        toast.success("관심 자격증이 저장되었습니다.");
        setTimeout(() => router.push('/main'), 1200);
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
    <div style={{ minHeight: '100vh', background: '#fff', padding: 24 }}>
      <ToastContainer position="top-center" autoClose={1500} hideProgressBar />
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18, color: '#222', textAlign: 'center' }}>
        관심 자격증
      </h2>
      <div style={{ color: '#222', fontSize: 14, marginBottom: 24, fontWeight: 500, textAlign: 'center' }}>
        최대 3개까지 선택할 수 있습니다.
      </div>
      {CATEGORY_LIST.map(category => (
        <div key={category} style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, color: '#222' }}>{category}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {CERT_LIST.filter(cert => cert.category === category).map(cert => (
              <button
                key={cert.name}
                onClick={() => handleSelect(cert.name)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 18,
                  border: selected.includes(cert.name) ? '2px solid #3182f6' : '1px solid #ddd',
                  background: selected.includes(cert.name) ? '#3182f6' : '#fff',
                  color: selected.includes(cert.name) ? '#fff' : '#222',
                  fontWeight: 500,
                  fontSize: 15,
                  marginBottom: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                disabled={selected.length >= 3 && !selected.includes(cert.name)}
              >
                {cert.name}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'right' }}>
        <button
          onClick={handleSave}
          disabled={selected.length === 0}
          style={{
            background: selected.length ? '#3182f6' : '#bbb',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '12px 32px',
            fontSize: 17,
            fontWeight: 600,
            cursor: selected.length ? 'pointer' : 'not-allowed',
            marginTop: 16,
          }}
        >
          저장
        </button>
      </div>
    </div>
  );
} 