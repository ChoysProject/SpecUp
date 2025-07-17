"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORY_LIST = [
  { label: "운동/스포츠", emoji: "🏃‍♂️" },
  { label: "사교/인맥", emoji: "🤝" },
  { label: "인문학/책/글", emoji: "📚" },
  { label: "아웃도어/여행", emoji: "🌄" },
  { label: "음악/악기", emoji: "🎵" },
  { label: "업종/직무", emoji: "💼" },
  { label: "문화/공연/축제", emoji: "🎭" },
  { label: "외국/언어", emoji: "🌐" },
  { label: "게임/오락", emoji: "🎮" },
  { label: "공예/만들기", emoji: "🎨" },
  { label: "댄스/무용", emoji: "💃" },
  { label: "봉사활동", emoji: "🙌" },
  { label: "사진/영상", emoji: "📷" },
  { label: "자기계발", emoji: "🚀" },
  { label: "스포츠관람", emoji: "⚽" },
  { label: "반려동물", emoji: "🐶" },
  { label: "요리/제조", emoji: "🍳" },
  { label: "차/바이크", emoji: "🏍️" }
];

export default function CommunityWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // 성공 메시지 상태 추가
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
        credentials: 'include',
      });
      if (res.ok) {
        setSuccess("게시글이 등록되었습니다."); // 성공 메시지 설정
        setError("");
        setTimeout(() => {
          setSuccess("");
          router.push("/communities");
        }, 2000); // 2초 후 메시지 사라지고 이동
      } else {
        setError("게시글 등록에 실패했습니다.");
      }
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#181A20", paddingBottom: 80 }}>
      {/* 성공 토스트 메시지 */}
      {success && (
        <div style={{
          position: "fixed",
          top: 20,
          left: 0,
          right: 0,
          margin: "0 auto",
          maxWidth: 400,
          zIndex: 1000,
          background: "#3182f6",
          color: "#fff",
          padding: "14px 0",
          borderRadius: 8,
          textAlign: "center",
          fontWeight: 600,
          fontSize: 17,
          boxShadow: "0 2px 8px rgba(49,130,246,0.15)"
        }}>
          {success}
        </div>
      )}
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
              <option key={cat.label} value={cat.label}>
                {cat.emoji} {cat.label}
              </option>
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