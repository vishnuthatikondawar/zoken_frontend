import React, { useState, useEffect } from 'react';
import { FloatingLabelInput } from './FloatingLabelInput';
import { OTPVerification } from './OTPVerification';
import { api } from '../api/client';
import { AUTH } from '../api/endpoints';
import { toast } from 'sonner';
import zokenLogo from '../assets/zoken_logo.svg';
import zokenArrow from '../assets/zoken_arrow.svg';

interface LoginPageProps {
  onLogin: (phoneNumber: string) => void;
}

const COUNTRY_CODES = [
  { code: '+91'},
  { code: '+1' },
  { code: '+44'},
  { code: '+81' },
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    setIsValid(phoneNumber.length === 10);
  }, [phoneNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    setApiError(null);

    try {
      if (!import.meta.env.VITE_API_URL) {
        throw new Error('Server configuration error. Please contact support.');
      }

      const response = await api.post(AUTH.LOGIN, {
        mobile: `${countryCode}${phoneNumber}`,
        deviceId: 'web',
        deviceType: 'WEB'
      });

      if (response.data) {
        setShowOTP(true);
        toast.success('OTP sent successfully');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof Error) {
        // Display a more user-friendly error message
        const errorMessage = error.message.includes('Network error') 
          ? 'Unable to connect to the server. Please check your internet connection and try again.'
          : error.message;
        
        setApiError(errorMessage);
      } else {
        setApiError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setApiError(null);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setApiError(null);
    try {
      const response = await api.post(AUTH.VERIFY_OTP, {
        mobile: `${countryCode}${phoneNumber}`,
        otp
      });

      if (response.data?.token) {
        api.setToken(response.data.token);
        localStorage.setItem('userToken', response.data.token);
        onLogin(`${countryCode}${phoneNumber}`);
        toast.success('Login successful');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Failed to verify OTP. Please try again.');
      }
    }
  };

  const handleOTPResend = async () => {
    setApiError(null);
    try {
      await api.post(AUTH.LOGIN, {
        mobile: `${countryCode}${phoneNumber}`,
        deviceId: 'web',
        deviceType: 'WEB'
      });
      toast.success('OTP resent successfully');
    } catch (error) {
      console.error('OTP resend error:', error);
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Failed to resend OTP. Please try again.');
      }
    }
  };

  if (showOTP) {
    return (
      <div className="login-container">
        <div className="login-content">
          <div className="login-logo-container">
            <h1 className="login-logo">
              <img src={zokenLogo} alt="ZOKEN" className="h-8" />
              <img src={zokenArrow} alt="" className="text-[#89FF60] h-6" />
            </h1>
          </div>

          <OTPVerification
            phoneNumber={`${countryCode} ${phoneNumber}`}
            onVerify={handleOTPVerify}
            onResend={handleOTPResend}
            onBack={() => {
              setShowOTP(false);
              setApiError(null);
            }}
          />
          
          {apiError && (
            <div className="mt-4 text-red-600 text-sm text-center">
              {apiError}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-logo-container">
          <h1 className="login-logo">
            <img src={zokenLogo} alt="ZOKEN" className="h-8" />
            <img src={zokenArrow} alt="" className="text-[#89FF60] h-6" />
          </h1>
        </div>

        <h2 className="login-title">Check Your Appointment Status</h2>
        <p className="login-subtitle">Just Your Phone Number Needed</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="phone-input-container">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="country-code-select"
            >
              {COUNTRY_CODES.map(({ code }) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <FloatingLabelInput
              id="phone"
              type="tel"
              label="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneChange}
              maxLength={10}
              disabled={isLoading}
            />
          </div>
          
          {apiError && (
            <div className="mt-2 text-red-600 text-sm text-center">
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`login-button ${
              isValid && !isLoading ? 'login-button--enabled' : 'login-button--disabled'
            }`}
          >
            {isLoading ? 'Sending OTP...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}