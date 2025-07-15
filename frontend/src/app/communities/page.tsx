"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const CATEGORY_LIST = [
  { name: "전체", emoji: "🏠" },
  { name: "운동/스포츠", emoji: "⚽" },
  { name: "사교/인맥", emoji: "🤝" },
  { name: "인문학/책/글", emoji: "📚" },
  { name: "아웃도어/여행", emoji: "🏔️" },
  { name: "음악/악기", emoji: "🎸" },
  { name: "업종/직무", emoji: "💼" },
  { name: "문화/공연/축제", emoji: "🎭" },
  { name: "외국/언어", emoji: "🌍" },
  { name: "게임/오락", emoji: "🎮" },
  { name: "공예/만들기", emoji: "🎨" },
  { name: "댄스/무용", emoji: "💃" },
  { name: "봉사활동", emoji: "❤️" },
  { name: "사진/영상", emoji: "📷" },
  { name: "자기계발", emoji: "📈" },
  { name: "스포츠관람", emoji: "🏟️" },
  { name: "반려동물", emoji: "🐕" },
  { name: "요리/제조", emoji: "👨‍🍳" },
  { name: "차/바이크", emoji: "🏍️" }
];

const PAGE_SIZE = 7;

export default function CommunitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const loader = useRef(null);
  const router = useRouter();

  // 게시글 데이터 불러오기 (Spring Boot API 호출)
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/boards?page=0&size=100`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  // 카테고리별 필터링
  const filteredPosts = selectedCategory === "전체"
    ? posts
    : posts.filter((post: any) => post.category === selectedCategory);

  useEffect(() => {
    setPage(1);
    setDisplayedPosts(filteredPosts.slice(0, PAGE_SIZE));
  }, [selectedCategory, posts]);

  useEffect(() => {
    if (page === 1) return;
    setDisplayedPosts(filteredPosts.slice(0, PAGE_SIZE * page));
  }, [page, filteredPosts]);

  // 무한 스크롤 IntersectionObserver
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayedPosts.length < filteredPosts.length) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => { if (loader.current) observer.unobserve(loader.current); };
  }, [displayedPosts, filteredPosts]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: 40 }}>로딩 중...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#181A20", paddingBottom: 80 }}>
      {/* 상단: 카테고리 선택 */}
      <div style={{ padding: "32px 0 18px 0", background: "#f7faff", borderBottom: "1px solid #e3f0ff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {CATEGORY_LIST.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              style={{
                background: selectedCategory === cat.name ? "#3182f6" : "#e3f0ff",
                color: selectedCategory === cat.name ? "#fff" : "#3182f6",
                border: "none",
                borderRadius: 8,
                padding: "8px 18px",
                fontWeight: 500,
                fontSize: 15,
                cursor: "pointer",
                transition: "background 0.2s"
              }}
            >
              <span style={{ marginRight: 6 }}>{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      {/* 게시판 리스트 */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 0" }}>
        {displayedPosts.length === 0 ? (
          <div style={{ color: '#888', fontSize: 16, textAlign: 'center', padding: 40 }}>해당 카테고리의 게시글이 없습니다.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {displayedPosts.map((post: any) => (
              <div
                key={post.id}
                onClick={() => router.push(`/communities/${post.id}`)}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(49,130,246,0.08)',
                  border: '1px solid #e3f0ff',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 17, color: '#3182f6' }}>{post.title}</div>
                <div style={{ fontSize: 14, color: '#888' }}>{post.category} | {post.nickname} | {post.createdAt ? post.createdAt.substring(0, 10) : ""}</div>
                <div style={{ fontSize: 15, color: '#222', marginTop: 4 }}>{post.content}</div>
              </div>
            ))}
          </div>
        )}
        {/* 무한 스크롤 로더 */}
        <div ref={loader} style={{ height: 30 }} />
        {/* 하단 게시글 쓰기 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <button
            onClick={() => router.push("/communities/write")}
            style={{
              background: "#3182f6",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 32px",
              fontWeight: 600,
              fontSize: 17,
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            게시글 쓰기
          </button>
        </div>
      </div>
    </div>
  );
} 