'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DaumPostcode from 'react-daum-postcode';

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
    gender: '',
  });
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState<false | 'home' | 'work' | 'interest'>(false);
  const [showBirthModal, setShowBirthModal] = useState(false);
  const now = new Date();
  const defaultYear = now.getFullYear() - 20;
  const years = Array.from({length: 100}, (_, i) => `${defaultYear - 80 + i}`);
  const months = Array.from({length: 12}, (_, i) => `${i+1}`.padStart(2, '0'));
  const days = Array.from({length: 31}, (_, i) => `${i+1}`.padStart(2, '0'));
  const options: { [key: string]: string[] } = {
    year: years,
    month: months,
    day: days,
  };
  const [birth, setBirth] = useState<{ [key: string]: string }>({
    year: `${defaultYear}`,
    month: '01',
    day: '01',
  });
  const [tempBirth, setTempBirth] = useState<{ [key: string]: string }>(birth);
  const birthDisplay = form.birth ? form.birth : '생년월일 선택';
  const openBirthModal = () => {
    setTempBirth(birth);
    setShowBirthModal(true);
  };
  const handleBirthConfirm = () => {
    setBirth(tempBirth);
    const birthStr = `${tempBirth.year}-${tempBirth.month}-${tempBirth.day}`;
    setForm(prev => ({ ...prev, birth: birthStr }));
    setShowBirthModal(false);
  };

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

  // 주소 선택 시 '구 동'만 추출하는 함수
  const extractGuDong = (address: string) => {
    const match = address.match(/([가-힣]+구 [가-힣0-9]+(동|읍|면))/);
    return match ? match[0] : address;
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
        {/* 이름 or 닉네임 */}
        <div>
          <label style={{ fontSize: 14, color: '#888', marginBottom: 6, display: 'block' }}>이름 or 닉네임</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="이름 또는 닉네임을 입력해주세요." style={{ width: '100%', padding: '14px 12px', fontSize: 16, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', color: '#181A20' }} autoComplete="off" />
        </div>
        {/* 생년월일+성별 한 줄 UI */}
        <div style={{ width: '100%', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 6 }}>
            <label style={{ fontSize: 14, color: '#888', width: 60, minWidth: 60, textAlign: 'left', whiteSpace: 'nowrap' }}>생년월일</label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <input
              name="birth"
              type="date"
              value={form.birth}
              placeholder="생년월일 선택"
              onChange={e => setForm(prev => ({ ...prev, birth: e.target.value }))}
              style={{
                flex: 1,
                height: 44,
                padding: '0 16px',
                fontSize: 16,
                borderRadius: 12,
                border: 'none',
                background: '#f5f5f7',
                color: form.birth ? '#181A20' : '#bbb',
                cursor: 'pointer',
                textAlign: 'center',
                boxSizing: 'border-box',
                outline: 'none',
                fontWeight: 500,
              }}
            />
            <div style={{ display: 'flex', background: '#eee', borderRadius: 16, overflow: 'hidden', height: 44, minWidth: 120 }}>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, gender: 'male' }))}
                style={{
                  background: form.gender === 'male' ? '#fff' : '#eee',
                  color: form.gender === 'male' ? '#181A20' : '#bbb',
                  border: 'none',
                  outline: 'none',
                  width: 60,
                  height: 44,
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: form.gender === 'male' ? '16px 0 0 16px' : '16px 0 0 16px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >남</button>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, gender: 'female' }))}
                style={{
                  background: form.gender === 'female' ? '#fff' : '#eee',
                  color: form.gender === 'female' ? '#181A20' : '#bbb',
                  border: 'none',
                  outline: 'none',
                  width: 60,
                  height: 44,
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: form.gender === 'female' ? '0 16px 16px 0' : '0 16px 16px 0',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >여</button>
            </div>
          </div>
        </div>
        {/* 집 주소 */}
        <div>
          <label style={{ fontSize: 14, color: '#888', marginBottom: 6, display: 'block' }}>집</label>
          <input
            name="homeAddress"
            value={form.homeAddress}
            placeholder="집 주소를 선택하세요"
            readOnly
            style={{ width: '100%', padding: '14px 12px', fontSize: 16, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', color: '#181A20', cursor: 'pointer' }}
            onClick={() => setShowRegionModal('home')}
          />
          {showRegionModal === 'home' && (
            <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 320 }}>
                <DaumPostcode
                  onComplete={data => {
                    const guDong = extractGuDong(data.address);
                    setForm(prev => ({ ...prev, homeAddress: guDong }));
                    setShowRegionModal(false);
                  }}
                  style={{ width: '100%', height: 400 }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                  <button onClick={() => setShowRegionModal(false)}>닫기</button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* 직장 주소 */}
        <div>
          <label style={{ fontSize: 14, color: '#888', marginBottom: 6, display: 'block' }}>직장</label>
          <input
            name="workAddress"
            value={form.workAddress}
            placeholder="직장 주소를 선택하세요"
            readOnly
            style={{ width: '100%', padding: '14px 12px', fontSize: 16, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', color: '#181A20', cursor: 'pointer' }}
            onClick={() => setShowRegionModal('work')}
          />
          {showRegionModal === 'work' && (
            <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 320 }}>
                <DaumPostcode
                  onComplete={data => {
                    const guDong = extractGuDong(data.address);
                    setForm(prev => ({ ...prev, workAddress: guDong }));
                    setShowRegionModal(false);
                  }}
                  style={{ width: '100%', height: 400 }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                  <button onClick={() => setShowRegionModal(false)}>닫기</button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* 관심지역 주소 */}
        <div>
          <label style={{ fontSize: 14, color: '#888', marginBottom: 6, display: 'block' }}>관심지역</label>
          <input
            name="interestAddress"
            value={form.interestAddress}
            placeholder="관심지역 주소를 선택하세요"
            readOnly
            style={{ width: '100%', padding: '14px 12px', fontSize: 16, borderRadius: 8, border: '1px solid #eee', background: '#f7f7f9', color: '#181A20', cursor: 'pointer' }}
            onClick={() => setShowRegionModal('interest')}
          />
          {showRegionModal === 'interest' && (
            <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 320 }}>
                <DaumPostcode
                  onComplete={data => {
                    const guDong = extractGuDong(data.address);
                    setForm(prev => ({ ...prev, interestAddress: guDong }));
                    setShowRegionModal(false);
                  }}
                  style={{ width: '100%', height: 400 }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                  <button onClick={() => setShowRegionModal(false)}>닫기</button>
                </div>
              </div>
            </div>
          )}
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
