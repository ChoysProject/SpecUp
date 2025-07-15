import React, { useEffect, useState } from "react";

export default function CommunityDetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/boards/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: 40 }}>로딩 중...</div>;
  }
  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(49,130,246,0.08)", border: "1px solid #e3f0ff", padding: "32px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>{post.title}</h1>
      <div style={{ color: "#888", marginBottom: 16 }}>{post.category} | {post.nickname} | {post.createdAt ? post.createdAt.substring(0, 10) : ""}</div>
      <div style={{ fontSize: 17 }}>{post.content}</div>
    </div>
  );
} 