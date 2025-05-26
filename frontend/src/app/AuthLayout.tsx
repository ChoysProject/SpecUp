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
    // 토큰이 있으면 로그인 상태로 간주
    const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
    setIsLoggedIn(!!token);
    // 세션이 없고, 로그인/회원가입/로딩 페이지가 아니면 무조건 로그인 페이지로 이동
    if (!token && !hideLayout) {
      window.location.href = "/login";
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