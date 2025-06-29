"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function ChatRoomDetailPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  // TODO: WebSocket 연결 및 메시지 송수신 구현

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#3182f6", marginBottom: 18 }}>채팅방</h2>
      <div style={{ color: '#888', fontSize: 15, marginBottom: 12 }}>Room ID: {roomId}</div>
      <div style={{ height: 320, overflowY: "auto", border: "1px solid #eee", borderRadius: 10, marginBottom: 12, background: "#fafbfc", padding: 12 }}>
        {messages.length === 0 ? <div style={{ color: '#bbb' }}>아직 메시지가 없습니다.</div> : messages.map((msg, idx) => (
          <div key={idx}><b>{msg.sender}:</b> {msg.message}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="메시지 입력" style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 15 }} onKeyDown={e => e.key === 'Enter' && setInput("")} />
        <button style={{ background: '#3182f6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: 15 }}>전송</button>
      </div>
    </div>
  );
} 