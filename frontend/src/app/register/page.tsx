'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 생년월일 선택 모달 (임시)
function BirthDateModal({ value, onClose, onSelect }: { value: string, onClose: () => void, onSelect: (date: string) => void }) {
  // 실제 구현은 별도 파일로 분리 예정
  // 여기서는 간단한 예시만 작성
  return (
    <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 300 }}>
        <div style={{ marginBottom: 16 }}>생년월일 선택 (예시)</div>
        <input type="date" value={value} onChange={e => onSelect(e.target.value)} style={{ width: '100%', fontSize: 16, padding: 8 }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button onClick={onClose} style={{ marginRight: 8 }}>취소</button>
          <button onClick={() => onSelect(value)}>확인</button>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const [form, setForm] = useState({
    email: emailParam || '',
    name: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    verificationCode: '',
    agreeAll: false,
    agreeAge: false,
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
    marketingEmail: false,
    marketingSms: false,
    marketingPush: false,
    recruitEmail: false,
    recruitSms: false,
    recruitPush: false,
    positionEmail: false,
    positionSms: false,
    positionPush: false,
    birth: '',
    homeAddress: '',
    workAddress: '',
    interestAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showBirthModal, setShowBirthModal] = useState(false);

  // 전체 동의 체크박스 핸들러
  const handleAllAgree = (checked: boolean) => {
    setForm(prev => ({
      ...prev,
      agreeAll: checked,
      agreeAge: checked,
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeMarketing: checked,
      marketingEmail: checked,
      marketingSms: checked,
      marketingPush: checked,
      recruitEmail: checked,
      recruitSms: checked,
      recruitPush: checked,
      positionEmail: checked,
      positionSms: checked,
      positionPush: checked,
    }));
  };

  // 개별 체크박스 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 인증번호 받기 버튼 클릭
  const handleSendVerification = () => {
    if (!form.phone) {
      toast.error('휴대폰 번호를 입력해주세요.');
      return;
    }
    setVerificationSent(true);
    toast.success('인증번호가 발송되었습니다. (실제 구현 필요)');
  };

  // 회원가입 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name || !form.phone || !form.password || !form.passwordConfirm) {
      toast.error('모든 필수 정보를 입력해주세요.');
      return;
    }
    if (form.password !== form.passwordConfirm) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!form.agreeAge || !form.agreeTerms || !form.agreePrivacy) {
      toast.error('필수 약관에 동의해주세요.');
      return;
    }
    setLoading(true);
    const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          phone: form.phone,
          password: form.password,
          agreeAge: form.agreeAge,
          agreeTerms: form.agreeTerms,
          agreePrivacy: form.agreePrivacy,
          agreeMarketing: form.agreeMarketing,
          birth: form.birth,
          homeAddress: form.homeAddress,
          workAddress: form.workAddress,
          interestAddress: form.interestAddress,
        }),
      });
    setLoading(false);
    if (res.ok) {
      toast.success('회원가입 완료! 로그인 해주세요.');
      setTimeout(() => router.push('/login'), 1200);
    } else {
      toast.error('이미 가입된 이메일이거나 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      color: '#181A20',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 0 40px 0',
    }}>
      <ToastContainer position="top-center" autoClose={1500} hideProgressBar theme="light" />
      {/* 상단 바 */}
      <div style={{ width: '100%', maxWidth: 400, margin: '0 auto', padding: '24px 0 0 0', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#181A20', fontSize: 24, marginRight: 8, cursor: 'pointer' }}>{'<'} </button>
        <span style={{ fontSize: 20, fontWeight: 600 }}>회원가입</span>
      </div>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400, margin: '0 auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 이메일 */}
        <div>
          <label style={{ fontSize: 14, color: '#888', marginBottom: 6, display: 'block' }}>이메일</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="이메일을 입력해주세요." style={{ width: '100%', padding: '14px 12px', fontSize: 16, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', color: '#181A20', marginBottom: 0 }} autoComplete="off" readOnly={!!emailParam} />
        </div>
        {/* 이름 */}
        <div>
          <label style={{ fontSize: 14, color: '#888', marginBottom: 6, display: 'block' }}>이름</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="이름을 입력해주세요." style={{ width: '100%', padding: '14px 12px', fontSize: 16, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', color: '#181A20' }} autoComplete="off" />
        </div>
        {/* 생년월일 */}
        <div>
          <label style={{ fontSize: 14, color: '#888', marginBottom: 6, display: 'block' }}>생년월일</label>
          <input name="birth" value={form.birth} placeholder="생년월일" readOnly onClick={() => setShowBirthModal(true)} style={{ width: '100%', padding: '14px 12px', fontSize: 16, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', color: '#181A20', cursor: 'pointer' }} />
        </div>
        {showBirthModal && (
          <BirthDateModal
            value={form.birth}
            onClose={() => setShowBirthModal(false)}
            onSelect={date => {
              setForm(prev => ({ ...prev, birth: date }));
              setShowBirthModal(false);
            }}
          />
        )}
        {/* 지역 버튼 */}
        <div>
          <button type="button" onClick={() => router.push('/region')} style={{ width: '100%', background: '#f7f7f9', color: '#181A20', border: '1px solid #eee', borderRadius: 8, padding: '14px 12px', fontSize: 16, marginBottom: 0, marginTop: 4, textAlign: 'left' }}>
            {form.homeAddress || form.workAddress || form.interestAddress ? `${form.homeAddress || ''} ${form.workAddress || ''} ${form.interestAddress || ''}`.trim() : '지역 선택'}
          </button>
        </div>
        {/* 휴대폰 번호 */}
        <div>
          <label style={{ fontSize: 14, color: '#888', marginBottom: 6, display: 'block' }}>휴대폰 번호</label>
          {/* 국가 선택 */}
          <select style={{ background: '#f7f7f9', color: '#181A20', border: '1px solid #eee', borderRadius: 8, padding: '12px 8px', fontSize: 15, width: '100%', marginBottom: 8 }} disabled>
            <option>Republic of Korea (대한민국) +82</option>
          </select>
          {/* 전화번호 + 인증번호 받기 버튼 */}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="(예시) 01013245768"
              style={{
                flex: 1,
                padding: '0 12px',
                fontSize: 16,
                borderRadius: 8,
                border: '1px solid #eee',
                background: '#f7f7f9',
                color: '#181A20',
                height: 40
              }}
              autoComplete="off"
            />
            <button
              type="button"
              style={{
                background: '#fff',
                color: '#3182f6',
                border: '1px solid #3182f6',
                borderRadius: 8,
                padding: '0 10px',
                fontSize: 15,
                height: 40,
                minWidth: 80,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={handleSendVerification}
              disabled={verificationSent}
            >
              인증번호 받기
            </button>
          </div>
          {/* 인증번호 입력 */}
          <input
            name="verificationCode"
            value={form.verificationCode}
            onChange={handleChange}
            placeholder="인증번호를 입력해주세요."
            style={{
              width: '100%',
              marginTop: 8,
              padding: '0 12px',
              fontSize: 16,
              borderRadius: 8,
              border: '1px solid #eee',
              background: verificationSent ? '#f7f7f9' : '#f7f7f9',
              color: verificationSent ? '#181A20' : '#bbb',
              height: 38
            }}
            disabled={!verificationSent}
            autoComplete="off"
          />
        </div>
        {/* 비밀번호 */}
        <div>
          <label style={{ fontSize: 14, color: '#888', marginBottom: 6, display: 'block' }}>비밀번호</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="비밀번호를 입력해주세요." style={{ width: '100%', padding: '14px 12px', fontSize: 16, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', color: '#181A20' }} autoComplete="off" />
        </div>
        <div>
          <input name="passwordConfirm" type="password" value={form.passwordConfirm} onChange={handleChange} placeholder="비밀번호를 다시 한번 입력해주세요." style={{ width: '100%', padding: '14px 12px', fontSize: 16, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', color: '#181A20', marginTop: 8 }} autoComplete="off" />
          <div style={{ color: '#bbb', fontSize: 12, marginTop: 4 }}>
            영문 대소문자, 숫자, 특수문자를 3가지 이상으로 조합해 8자 이상 16자 이하로 입력해주세요.
          </div>
        </div>
        {/* 약관 동의 */}
        <div style={{ background: '#f7f7f9', borderRadius: 12, padding: 16, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <input type="checkbox" checked={form.agreeAll} onChange={e => handleAllAgree(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#3182f6', marginRight: 8 }} />
            <span style={{ fontWeight: 600, fontSize: 15, color: '#181A20' }}>전체 동의</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#181A20' }}>
              <input type="checkbox" name="agreeAge" checked={form.agreeAge} onChange={handleChange} style={{ width: 16, height: 16, accentColor: '#3182f6', marginRight: 6 }} /> [필수] 만 14세 이상입니다.
            </label>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#181A20' }}>
              <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} style={{ width: 16, height: 16, accentColor: '#3182f6', marginRight: 6 }} /> [필수] 스펙업 이용약관 동의 <span style={{ color: '#3182f6', marginLeft: 4, fontSize: 12, cursor: 'pointer' }}>자세히</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#181A20' }}>
              <input type="checkbox" name="agreePrivacy" checked={form.agreePrivacy} onChange={handleChange} style={{ width: 16, height: 16, accentColor: '#3182f6', marginRight: 6 }} /> [필수] 스펙업 개인정보 수집 및 이용 동의 <span style={{ color: '#3182f6', marginLeft: 4, fontSize: 12, cursor: 'pointer' }}>자세히</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#181A20' }}>
              <input type="checkbox" name="agreeMarketing" checked={form.agreeMarketing} onChange={handleChange} style={{ width: 16, height: 16, accentColor: '#3182f6', marginRight: 6 }} /> [선택] 마케팅 목적의 개인정보 수집 및 이용 동의 <span style={{ color: '#3182f6', marginLeft: 4, fontSize: 12, cursor: 'pointer' }}>자세히</span>
            </label>
          </div>
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', background: form.agreeAge && form.agreeTerms && form.agreePrivacy ? '#3182f6' : '#eee', color: form.agreeAge && form.agreeTerms && form.agreePrivacy ? '#fff' : '#bbb', fontSize: 18, fontWeight: 'bold', border: 'none', borderRadius: 12, padding: '16px 0', marginTop: 12, cursor: form.agreeAge && form.agreeTerms && form.agreePrivacy ? 'pointer' : 'not-allowed', opacity: loading ? 0.7 : 1 }}>
          가입하기
        </button>
      </form>
    </div>
  );
}