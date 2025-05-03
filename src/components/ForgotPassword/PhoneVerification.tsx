import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FloatingLabelInput } from '../FloatingLabelInput';
import zokenLogo from '../../assets/zoken_logo.svg';
import zokenArrow from '../../assets/zoken_arrow.svg';

interface PhoneVerificationProps {
  onSubmit: (phoneNumber: string) => Promise<void>;
}

export function PhoneVerification({ onSubmit }: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(phoneNumber);
      navigate(`/forgot-password/verify-otp?phone=${phoneNumber}`);
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-[#B3B3B3] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Login</span>
        </button>

        <h2 className="login-title">Forgot Password</h2>
        <p className="login-subtitle">Enter your phone number to reset password</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <FloatingLabelInput
              id="phone"
              type="tel"
              label="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneChange}
              error={error}
              disabled={isLoading}
              maxLength={10}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || phoneNumber.length !== 10}
            className={`login-button ${
              phoneNumber.length === 10 && !isLoading
                ? 'login-button--enabled'
                : 'login-button--disabled'
            }`}
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}