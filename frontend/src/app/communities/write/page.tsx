"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORY_LIST = [
  "운동/스포츠", "사교/인맥", "인문학/책/글", "아웃도어/여행",
  "음악/악기", "업종/직무", "문화/공연/축제", "외국/언어",
  "게임/오락", "공예/만들기", "댄스/무용", "봉사활동",
  "사진/영상", "자기계발", "스포츠관람", "반려동물",
  "요리/제조", "차/바이크"
];

export default function CommunityWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    if (content.length > 500) {
      setError("내용은 500자 이내로 작성해주세요.");
      return;
    }
    const nickname = localStorage.getItem('nickname') || '익명';
    try {
      const res = await fetch('http://172.20.193.4:8080/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, category, title, content }),
      });
      if (res.ok) {
        alert("게시글이 등록되었습니다.");
        router.push("/communities");
      } else {
        setError("게시글 등록에 실패했습니다.");
      }
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#181A20", paddingBottom: 80 }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "0 auto", padding: "40px 0", display: "flex", flexDirection: "column", gap: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#3182f6", marginBottom: 12 }}>게시글 작성</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontWeight: 500 }}>제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
            style={{ padding: 10, borderRadius: 6, border: "1px solid #e3f0ff", fontSize: 16 }}
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontWeight: 500 }}>분야</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ padding: 10, borderRadius: 6, border: "1px solid #e3f0ff", fontSize: 16 }}
            required
          >
            <option value="">분야를 선택하세요</option>
            {CATEGORY_LIST.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontWeight: 500 }}>내용 <span style={{ color: '#888', fontWeight: 400 }}>({content.length}/500자)</span></label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            maxLength={500}
            rows={8}
            style={{ padding: 10, borderRadius: 6, border: "1px solid #e3f0ff", fontSize: 16, resize: "vertical" }}
            placeholder="내용을 입력하세요 (최대 500자)"
            required
          />
        </div>
        {error && <div style={{ color: "#e53e3e", fontWeight: 500 }}>{error}</div>}
        <button
          type="submit"
          style={{ background: "#3182f6", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 600, fontSize: 17, cursor: "pointer" }}
        >
          게시글 올리기
        </button>
      </form>
    </div>
  );
} 