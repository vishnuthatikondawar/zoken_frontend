import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { FloatingLabelInput } from '../FloatingLabelInput';
import zokenLogo from '../../assets/zoken_logo.svg';
import zokenArrow from '../../assets/zoken_arrow.svg';

interface ResetPasswordProps {
  onSubmit: (passwords: { password: string; confirmPassword: string }) => Promise<void>;
}

export function ResetPassword({ onSubmit }: ResetPasswordProps) {
  const [searchParams] = useSearchParams();
  const phoneNumber = searchParams.get('phone') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!phoneNumber) {
      navigate('/forgot-password');
    }
  }, [phoneNumber, navigate]);

  const validatePasswords = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) return;

    setIsLoading(true);
    try {
      await onSubmit({ password, confirmPassword });
      navigate('/admin');
    } catch (error) {
      setError('Failed to reset password. Please try again.');
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
          onClick={() => navigate('/forgot-password/verify-otp')}
          className="flex items-center gap-2 text-[#B3B3B3] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="login-title">Reset Password</h2>
        <p className="login-subtitle">Enter your new password</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <div className="password-input-container">
              <FloatingLabelInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="New Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-button"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <div className="password-input-container">
              <FloatingLabelInput
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle-button"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className={`login-button ${
              password && confirmPassword && !isLoading
                ? 'login-button--enabled'
                : 'login-button--disabled'
            }`}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}