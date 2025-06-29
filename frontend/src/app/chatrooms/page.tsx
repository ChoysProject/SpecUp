"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [field, setField] = useState("전체");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [newRoom, setNewRoom] = useState({ title: "", field: "", createdBy: "" });

  const fieldList = ["전체", "IT/개발", "회계/금융", "어학", "디자인", "건설/기계", "교육"];

  const fetchRooms = async () => {
    setLoading(true);
    const res = await fetch(`/api/chatroom${field && field !== "전체" ? `?field=${encodeURIComponent(field)}` : ""}`);
    const data = await res.json();
    setRooms(data);
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, [field]);

  const handleCreateRoom = async () => {
    if (!newRoom.title || !newRoom.field || !newRoom.createdBy) return;
    const res = await fetch("/api/chatroom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRoom),
    });
    if (res.ok) {
      setShowCreate(false);
      setNewRoom({ title: "", field: "", createdBy: "" });
      fetchRooms();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#3182f6", marginBottom: 24 }}>전체 대화방</h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {fieldList.map(f => (
          <button key={f} onClick={() => setField(f)} style={{ background: field === f ? "#3182f6" : "#e3f0ff", color: field === f ? "#fff" : "#3182f6", border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 500, cursor: "pointer" }}>{f}</button>
        ))}
        <button onClick={() => setShowCreate(true)} style={{ marginLeft: "auto", background: "#3182f6", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>대화방 만들기</button>
      </div>
      {loading ? <div>로딩중...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {rooms.length === 0 ? <div style={{ color: "#888" }}>대화방이 없습니다.</div> : rooms.map(room => (
            <div key={room.roomId} style={{ border: "1px solid #e3f0ff", borderRadius: 10, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f7faff" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 17, color: "#3182f6" }}>{room.title}</div>
                <div style={{ fontSize: 14, color: "#888" }}>{room.field} | {room.createdBy}</div>
              </div>
              <button onClick={() => router.push(`/chatroom/${room.roomId}`)} style={{ background: "#3182f6", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 500, cursor: "pointer", fontSize: 15 }}>입장</button>
            </div>
          ))}
        </div>
      )}
      {showCreate && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, minWidth: 320, boxShadow: "0 4px 24px rgba(49,130,246,0.13)" }}>
            <h3 style={{ fontWeight: 700, fontSize: 20, color: "#3182f6", marginBottom: 16 }}>대화방 만들기</h3>
            <input value={newRoom.title} onChange={e => setNewRoom(r => ({ ...r, title: e.target.value }))} placeholder="방 이름" style={{ width: "100%", padding: 10, borderRadius: 8, border: '1px solid #eee', marginBottom: 12, fontSize: 16 }} />
            <select value={newRoom.field} onChange={e => setNewRoom(r => ({ ...r, field: e.target.value }))} style={{ width: "100%", padding: 10, borderRadius: 8, border: '1px solid #eee', marginBottom: 12, fontSize: 16 }}>
              <option value="">분야/자격증 선택</option>
              {fieldList.filter(f => f !== "전체").map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <input value={newRoom.createdBy} onChange={e => setNewRoom(r => ({ ...r, createdBy: e.target.value }))} placeholder="생성자(닉네임)" style={{ width: "100%", padding: 10, borderRadius: 8, border: '1px solid #eee', marginBottom: 16, fontSize: 16 }} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowCreate(false)} style={{ background: '#eee', color: '#444', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: 15 }}>취소</button>
              <button onClick={handleCreateRoom} style={{ background: '#3182f6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: 15 }}>생성</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 