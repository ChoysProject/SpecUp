'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();

  // 실제 서비스에서는 아래 URL을 각 플랫폼 OAuth URL로 변경하세요!
  const KAKAO_LOGIN_URL = "https://kauth.kakao.com/oauth/authorize?...";
  const GOOGLE_LOGIN_URL = "https://accounts.google.com/o/oauth2/v2/auth?...";

  // useEffect(() => {
  //   if (!localStorage.getItem("accessToken")) {
  //     router.replace("/");
  //   }
  // }, []);

  // 이메일 형식 체크 함수
  const isValidEmail = (email: string) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
  };

  // 이메일 존재 여부 확인
  const handleEmailContinue = async () => {
    if (!email) {
      toast.error("이메일을 입력해주세요.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("올바른 이메일 형식이 아닙니다.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "dummy" }), // password는 더미
      });
      if (res.status === 404) {
        toast.info("가입된 이메일이 없습니다. 회원가입 페이지로 이동합니다.");
        setTimeout(() => router.push(`/register?email=${encodeURIComponent(email)}`), 1200);
        return;
      }
      // 200(성공) 또는 401(비번 틀림) 모두 비밀번호 입력칸 보여주기
      if (res.status === 200 || res.status === 401) {
        setShowPassword(true);
        return;
      }
      toast.error("이메일 확인 중 오류가 발생했습니다.");
    } catch (e) {
      toast.error("이메일 확인 중 오류가 발생했습니다.");
    }
  };

  // 실제 로그인 처리
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("올바른 이메일 형식이 아닙니다.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 404) {
        toast.info("가입된 이메일이 없습니다. 회원가입 페이지로 이동합니다.");
        setTimeout(() => router.push(`/register?email=${encodeURIComponent(email)}`), 1200);
        return;
      }
      if (res.status === 401) {
        toast.error("비밀번호가 올바르지 않습니다.");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
        if (data.userId) {
          localStorage.setItem("userId", data.userId);
        }
        // 로그인 후 유저 정보 조회하여 jobInterests 체크
        try {
          const userRes = await fetch(`http://localhost:8080/api/users/${data.userId}`, {
            headers: { 
              "Authorization": `Bearer ${data.accessToken}`,
              "Content-Type": "application/json"
            }
          });
          
          if (userRes.ok) {
            const userData = await userRes.json();
            const jobInterests = userData.jobInterests ?? [];
            const certInterests = userData.certInterests ?? [];
            
            if (!Array.isArray(jobInterests) || jobInterests.length === 0) {
              toast.info("관심 직무/업종을 먼저 선택해주세요.");
              setTimeout(() => router.push("/select-interest"), 1200);
              return;
            }
            
            if (!Array.isArray(certInterests) || certInterests.length === 0) {
              toast.info("관심 자격증을 먼저 선택해주세요.");
              setTimeout(() => router.push("/select-cert"), 1200);
              return;
            }
            
            toast.success("로그인 성공! 환영합니다.");
            setTimeout(() => router.push("/main"), 1200);
          } else {
            console.error("사용자 정보 조회 실패:", await userRes.text());
            toast.error("사용자 정보를 가져오는데 실패했습니다.");
          }
        } catch (error) {
          console.error("사용자 정보 조회 중 에러:", error);
          toast.error("사용자 정보를 가져오는데 실패했습니다.");
        }
      } else {
        const errorText = await res.text();
        console.error("로그인 실패:", errorText);
        toast.error("로그인 중 오류가 발생했습니다.");
      }
    } catch (e) {
      toast.error("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff",
        padding: "20px",
      }}
    >
      <ToastContainer position="top-center" autoClose={1500} hideProgressBar />
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 로고 */}
        <Image
          src="/images/SPECUP.PNG"
          alt="스펙업 로고"
          width={180}
          height={180}
          style={{ marginBottom: 24 }}
        />

        {/* 소개 멘트 */}
        <div style={{ fontSize: 18, color: "#444", marginBottom: 4, textAlign: "center" }}>
          쉽고 똑똑한 자격증 관리의 시작
        </div>
        <div style={{ fontSize: 14, color: "#888", marginBottom: 24, textAlign: "center" }}>
          모든 자격증, 일정, 커뮤니티를 한 곳에서!
        </div>

        {/* 로그인 폼 */}
        <div style={{ width: "100%" }}>
          <label style={{ fontSize: 14, color: "#666", marginBottom: 6, display: "block" }}>
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            style={{
              width: "100%",
              padding: "14px 12px",
              fontSize: 16,
              borderRadius: 8,
              border: "1px solid #ddd",
              marginBottom: 12,
              outline: "none",
              color: "#000",
            }}
            disabled={showPassword}
          />
          {showPassword && (
            <>
              <label style={{ fontSize: 14, color: "#666", marginBottom: 6, display: "block" }}>
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                style={{
                  width: "100%",
                  padding: "14px 12px",
                  fontSize: 16,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  marginBottom: 12,
                  outline: "none",
                  color: "#000",
                }}
              />
            </>
          )}
          {!showPassword ? (
            <button
              style={{
                width: "100%",
                background: "#3182f6",
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
                border: "none",
                borderRadius: 12,
                padding: "16px 0",
                margin: "12px 0 0 0",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onClick={handleEmailContinue}
            >
              이메일로 계속하기
            </button>
          ) : (
            <button
              style={{
                width: "100%",
                background: "#3182f6",
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
                border: "none",
                borderRadius: 12,
                padding: "16px 0",
                margin: "12px 0 0 0",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onClick={handleLogin}
            >
              로그인
            </button>
          )}
        </div>

        {/* 소셜 로그인 */}
        <div style={{ width: "100%", marginTop: 32, textAlign: "center" }}>
          <div style={{ color: "#aaa", fontSize: 14, margin: "16px 0 12px 0" }}>또는</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 36 }}>
            {/* 카카오 로그인 버튼 그룹 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <button
                style={{
                  background: "#fee500",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  borderRadius: "50%",
                  width: 64,
                  height: 64,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                onClick={() => window.location.href = KAKAO_LOGIN_URL}
              >
                <Image src="/images/kakao.png" alt="카카오" width={36} height={36} />
              </button>
              <div style={{ fontSize: 12, color: "#444", marginTop: 8 }}>Kakao</div>
            </div>
            {/* 구글 로그인 버튼 그룹 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <button
                style={{
                  background: "#fff",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  padding: 0,
                  borderRadius: "50%",
                  width: 64,
                  height: 64,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                onClick={() => window.location.href = GOOGLE_LOGIN_URL}
              >
                <Image src="/images/g-logo.png" alt="구글" width={36} height={36} />
              </button>
              <div style={{ fontSize: 12, color: "#444", marginTop: 8 }}>Google</div>
            </div>
          </div>
          <div style={{ color: "#bbb", fontSize: 12, marginTop: 24 }}>
            걱정마세요! 여러분의 활동은 SNS에 노출되지 않습니다.
          </div>
        </div>
      </div>
    </div>
  );
}