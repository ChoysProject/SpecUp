'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인/회원가입/로딩/홈 페이지에서는 헤더/푸터 숨김
  const publicPaths = ["/", "/login", "/register", "/loading"];
  const hideLayout = publicPaths.includes(pathname);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
    setIsLoggedIn(!!token);
    // 보호가 필요한 경로에서만 세션 체크
    if (!publicPaths.includes(pathname)) {
      if (!token) {
        // 세션 없으면 홈으로
        window.location.href = "/";
      }
    } else if (token && (pathname === "/login" || pathname === "/register")) {
      // 세션 있는데 로그인/회원가입 페이지면 메인으로
      window.location.href = "/main";
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