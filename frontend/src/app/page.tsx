'use client'; // 클라이언트 컴포넌트로 지정 (useState, useEffect 사용 위함)

import { useEffect, useState } from 'react';
import Image from 'next/image'; // Image 컴포넌트는 필요하면 남겨둠

export default function Home() {
  const [backendMessage, setBackendMessage] = useState('백엔드 연결 시도 중...');

  useEffect(() => {
    // Spring Boot 백엔드의 /api/hello 엔드포인트를 호출
    const fetchHello = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/hello'); // 백엔드 주소 확인
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        setBackendMessage(data);
      } catch (error: any) {
        setBackendMessage(`백엔드 연결 실패: ${error.message}. 백엔드 서버가 실행 중인지 확인하세요.`);
      }
    };

    fetchHello();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">환영합니다! 자격증 관리 시스템</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        여기에 당신의 자격증을 편리하게 관리하세요.
      </p>
      <p className="mt-4 text-md text-blue-600 dark:text-blue-400">
        백엔드로부터의 메시지: {backendMessage}
      </p>
      {/* 여기에 자격증 추가 버튼, 로그인/회원가입 링크 등을 추가할 수 있습니다 */}
      <button className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        새 자격증 추가
      </button>

      {/* Tailwind CSS가 잘 작동하는지 확인하기 위해 샘플 텍스트 추가 */}
      <p className="mt-8 text-sm sm:text-base md:text-lg lg:text-xl text-center">
        이 텍스트는 화면 크기에 따라 반응형으로 크기가 변합니다 (Tailwind CSS 적용 예시).
      </p>
    </div>
  );
}