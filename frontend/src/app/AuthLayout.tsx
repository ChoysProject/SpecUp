'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // 인증이 필요 없는 경로
  const publicPaths = ["/login", "/register", "/loading", "/"];

  useEffect(() => {
    if (publicPaths.includes(pathname)) return; // public path는 인증 체크 X
    const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
    if (!token) {
      window.location.href = "/login";
    }
  }, [pathname]);

  // public path는 레이아웃 없이 children만 반환
  if (publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main style={{ paddingTop: 56, paddingBottom: 60, background: '#fff', minHeight: '100vh' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}