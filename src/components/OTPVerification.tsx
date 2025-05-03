import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
}

export function OTPVerification({ phoneNumber, onVerify, onResend, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((time) => (time > 0 ? time - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = value;
      return newOtp;
    });

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    setError('');
    setShake(false);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 4) newOtp[index] = char;
    });
    setOtp(newOtp);
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter all digits');
      setShake(true);
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await onVerify(otpString);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      setShake(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    setTimeLeft(60);
    try {
      await onResend();
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="max-w-[400px] mx-auto p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#B3B3B3] hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-white">Enter Verification Code</h2>
          <p className="text-[#B3B3B3]">
            We've sent a 4-digit code to {phoneNumber}
          </p>
        </div>

        <div className={`space-y-4 ${shake ? 'animate-shake' : ''}`}>
          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-xl font-bold rounded-lg border
                           focus:outline-none focus:ring-2 focus:ring-[#1DB954] bg-[#282828] text-white
                           ${error ? 'border-red-500' : 'border-[#3E3E3E]'}`}
                maxLength={1}
                autoFocus={index === 0}
                data-otp-input
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || otp.join('').length !== 4}
          className={`login-button ${
            isLoading || otp.join('').length !== 4
              ? 'opacity-60 cursor-not-allowed bg-[#3E3E3E] text-[#B3B3B3]'
              : 'login-button--enabled'
          }`}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>

        <div className="text-center">
          <p className="text-sm text-[#B3B3B3] mb-2">
            {timeLeft > 0 ? (
              <>
                Resend code in{' '}
                <span className="font-medium text-white">
                  {timeLeft}s
                </span>
              </>
            ) : (
              <>Didn't receive the code?</>
            )}
          </p>
          <button
            onClick={handleResend}
            disabled={timeLeft > 0}
            className={`text-sm font-medium ${
              timeLeft > 0
                ? 'text-[#3E3E3E] cursor-not-allowed'
                : 'text-[#1DB954] hover:text-[#1ed760]'
            }`}
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
}