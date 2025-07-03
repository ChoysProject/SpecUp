"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORY_LIST = [
  "전체",
  "운동/스포츠", "사교/인맥", "인문학/책/글", "아웃도어/여행",
  "음악/악기", "업종/직무", "문화/공연/축제", "외국/언어",
  "게임/오락", "공예/만들기", "댄스/무용", "봉사활동",
  "사진/영상", "자기계발", "스포츠관람", "반려동물",
  "요리/제조", "차/바이크"
];

const dummyPosts = [
  { id: 1, category: "운동/스포츠", title: "배드민턴 같이 하실 분!", author: "홍길동", date: "2024-06-01", content: "공원에서 배드민턴 모임 구해요!" },
  { id: 2, category: "음악/악기", title: "기타 동호회 모집", author: "김기타", date: "2024-06-02", content: "기타 배우고 싶은 분 환영합니다." },
  { id: 3, category: "자기계발", title: "자격증 스터디원 구함", author: "이자격", date: "2024-06-03", content: "정보처리기사 스터디 같이 해요." },
  // ...더미 데이터 추가 가능
];

export default function CommunitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const router = useRouter();

  // 카테고리별 필터링
  const filteredPosts = selectedCategory === "전체"
    ? dummyPosts
    : dummyPosts.filter(post => post.category === selectedCategory);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#181A20", paddingBottom: 80 }}>
      {/* 상단: 카테고리 선택 */}
      <div style={{ padding: "32px 0 18px 0", background: "#f7faff", borderBottom: "1px solid #e3f0ff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {CATEGORY_LIST.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? "#3182f6" : "#e3f0ff",
                color: selectedCategory === cat ? "#fff" : "#3182f6",
                border: "none",
                borderRadius: 8,
                padding: "8px 18px",
                fontWeight: 500,
                fontSize: 15,
                cursor: "pointer",
                transition: "background 0.2s"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {/* 게시판 리스트 */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 0" }}>
        {filteredPosts.length === 0 ? (
          <div style={{ color: '#888', fontSize: 16, textAlign: 'center', padding: 40 }}>해당 카테고리의 게시글이 없습니다.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {filteredPosts.map(post => (
              <div key={post.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(49,130,246,0.08)', border: '1px solid #e3f0ff', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#3182f6' }}>{post.title}</div>
                <div style={{ fontSize: 14, color: '#888' }}>{post.category} | {post.author} | {post.date}</div>
                <div style={{ fontSize: 15, color: '#222', marginTop: 4 }}>{post.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 