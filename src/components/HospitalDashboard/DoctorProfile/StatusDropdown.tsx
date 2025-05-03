import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { StatusButton, StatusType, STATUS_CONFIGS } from './StatusButton';

interface StatusDropdownProps {
  value: StatusType;
  onChange: (value: StatusType) => void;
}

export function StatusDropdown({ value, onChange }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (newValue: StatusType) => {
    onChange(newValue);
    setIsOpen(false);
  };

  const dropdownId = `status-dropdown-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center">
        <StatusButton
          status={value}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={dropdownId}
          aria-label="Select status"
          className="pr-2"
        />
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div
          id={dropdownId}
          className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg py-1 z-10"
        >
          {(Object.keys(STATUS_CONFIGS) as StatusType[]).map((status) => (
            <StatusButton
              key={status}
              status={status}
              onClick={() => handleOptionClick(status)}
              className={`w-full justify-start ${
                value === status ? 'bg-opacity-10' : 'hover:bg-opacity-5'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}