import React, { useState } from 'react';

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FloatingLabelInput({ 
  label, 
  error, 
  id,
  value,
  onChange,
  type = 'text',
  disabled = false,
  ...props 
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || Boolean(value);

  return (
    <div className="form-field">
      <div className="floating-input-container">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`floating-input ${error ? 'border-red-500' : 'border-[#1DB954]'} leading-normal`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=" "
          style={{ lineHeight: '1.5' }}
          {...props}
        />
        <label 
          htmlFor={id}
          className={`floating-label ${isFloating ? 'floating-label-active' : ''}`}
        >
          {label}
        </label>
      </div>
    </div>
  );
}