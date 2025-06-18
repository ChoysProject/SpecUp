'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CERT_LIST = [
  "정보처리기사", "SQLD", "네트워크관리사", "리눅스마스터", "AWS", "CCNA", "정보보안기사",
  "토익", "토스", "오픽", "JLPT", "HSK", "DELF", "DELE"
];

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
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <ToastContainer position="top-center" autoClose={1500} hideProgressBar />
      
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
        관심 있는 자격증을 선택해주세요
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem', textAlign: 'center' }}>
        최대 3개까지 선택 가능합니다
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '10px',
        width: '100%',
        maxWidth: '600px'
      }}>
        {CERT_LIST.map((item) => (
          <button
            key={item}
            onClick={() => handleSelect(item)}
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: selected.includes(item) ? '#3182f6' : '#fff',
              color: selected.includes(item) ? '#fff' : '#333',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        onClick={handleSave}
        style={{
          marginTop: '2rem',
          padding: '12px 24px',
          background: '#3182f6',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        저장하기
      </button>
    </div>
  );
} 