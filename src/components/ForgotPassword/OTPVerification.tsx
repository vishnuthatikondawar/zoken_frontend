import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { OTPVerification as OTPInput } from '../OTPVerification';
import zokenLogo from '../../assets/zoken_logo.svg';
import zokenArrow from '../../assets/zoken_arrow.svg';

interface OTPVerificationProps {
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
}

export function OTPVerification({ onVerify, onResend }: OTPVerificationProps) {
  const [searchParams] = useSearchParams();
  const phoneNumber = searchParams.get('phone') || '';
  const navigate = useNavigate();

  useEffect(() => {
    if (!phoneNumber) {
      navigate('/forgot-password');
    }
  }, [phoneNumber, navigate]);

  const handleVerify = async (otp: string) => {
    await onVerify(otp);
    navigate(`/forgot-password/reset?phone=${phoneNumber}`);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-logo-container">
          <h1 className="login-logo">
            <img src={zokenLogo} alt="ZOKEN" className="h-8" />
            <img src={zokenArrow} alt="" className="text-[#89FF60] h-6" />
          </h1>
        </div>

        <button
          onClick={() => navigate('/forgot-password')}
          className="flex items-center gap-2 text-[#B3B3B3] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <OTPInput
          phoneNumber={`+91 ${phoneNumber}`}
          onVerify={handleVerify}
          onResend={onResend}
          onBack={() => navigate('/forgot-password')}
        />
      </div>
    </div>
  );
}