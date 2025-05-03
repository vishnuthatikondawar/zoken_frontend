import React from 'react';
import { Play, Circle, Clock, CheckCircle2 } from 'lucide-react';

export type StatusType = 'start' | 'in-progress' | 'on-hold' | 'done';

interface StatusConfig {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  textColor: string;
  hoverBg: string;
  activeBg: string;
}

export const STATUS_CONFIGS: Record<StatusType, StatusConfig> = {
  'start': {
    icon: <Play className="w-4 h-4" />,
    label: 'Start',
    bgColor: '#1DB954',
    textColor: '#FFFFFF',
    hoverBg: '#1ed760',
    activeBg: '#1ed760'
  },
  'in-progress': {
    icon: <Circle className="w-4 h-4" fill="#FF9800" />,
    label: 'In Progress',
    bgColor: '#3E3E3E',
    textColor: '#FF9800',
    hoverBg: '#4E4E4E',
    activeBg: '#4E4E4E'
  },
  'on-hold': {
    icon: <Clock className="w-4 h-4" />,
    label: 'On Hold',
    bgColor: '#3E3E3E',
    textColor: '#FF3B3B',
    hoverBg: '#4E4E4E',
    activeBg: '#4E4E4E'
  },
  'done': {
    icon: <CheckCircle2 className="w-4 h-4" />,
    label: 'Done',
    bgColor: '#3E3E3E',
    textColor: '#1DB954',
    hoverBg: '#4E4E4E',
    activeBg: '#4E4E4E'
  }
};

interface StatusButtonProps {
  status: StatusType;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
}

export function StatusButton({
  status,
  onClick,
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
  'aria-expanded': ariaExpanded,
  'aria-controls': ariaControls,
}: StatusButtonProps) {
  const config = STATUS_CONFIGS[status];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl transition-colors
        ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        '--hover-bg': config.hoverBg,
        '--active-bg': config.activeBg,
      } as React.CSSProperties}
    >
      {config.icon}
      <span className="font-medium">{config.label}</span>
    </button>
  );
}