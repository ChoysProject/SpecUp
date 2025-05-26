'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인/회원가입/로딩 페이지에서는 헤더/푸터 숨김
  const hideLayout =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/loading";

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
    setIsLoggedIn(!!token);
    // 로그인/회원가입/로딩 페이지가 아니면 세션 체크
    if (!hideLayout) {
      if (!token) {
        // 세션 없으면 로그인으로
        window.location.href = "/login";
      } else if (pathname === "/login" || pathname === "/register") {
        // 세션 있는데 로그인/회원가입 페이지면 메인으로
        window.location.href = "/main";
      }
    }
  }, [pathname]);

  return (
    <>
      {!hideLayout && isLoggedIn && <Header />}
      <main style={{ paddingTop: !hideLayout && isLoggedIn ? 56 : 0, paddingBottom: !hideLayout && isLoggedIn ? 60 : 0, background: '#fff', minHeight: '100vh' }}>
        {children}
      </main>
      {!hideLayout && isLoggedIn && <Footer />}
    </>
  );
}