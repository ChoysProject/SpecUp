'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff", // 흰색 배경
        padding: "0 0 40px 0",
      }}
    >
      <div style={{ height: "10vh" }} />
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Image
          src="/images/SPECUP.PNG"
          alt="로고"
          width={220}
          height={220}
          priority
          style={{ maxWidth: "80vw", height: "auto" }}
        />
      </div>
      <button
        style={{
          width: "90%",
          maxWidth: 400,
          padding: "18px 0",
          background: "#3182f6",
          color: "#fff",
          fontSize: "1.2rem",
          border: "none",
          borderRadius: 16,
          fontWeight: "bold",
          boxShadow: "0 4px 16px rgba(49,130,246,0.08)",
          cursor: "pointer",
          marginBottom: 20,
        }}
        onClick={() => router.push("/login")}
      >
        로그인하기
      </button>
    </div>
  );
}