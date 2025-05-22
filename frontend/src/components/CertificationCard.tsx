'use client';

import React from 'react';

interface CertificationCardProps {
  id: number;
  name: string;
  issueDate: string;
  expiryDate?: string; // 만료일은 선택적
}

const CertificationCard: React.FC<CertificationCardProps> = ({ id, name, issueDate, expiryDate }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">취득일: {issueDate}</p>
      {expiryDate && (
        <p className="text-sm text-red-500 dark:text-red-400">만료일: {expiryDate}</p>
      )}
      {/* 추가적인 버튼이나 정보 */}
    </div>
  );
};

export default CertificationCard;