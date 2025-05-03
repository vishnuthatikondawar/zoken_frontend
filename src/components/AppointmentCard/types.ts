import type { Appointment, AppointmentCardConfig } from '../../types';

export interface AppointmentCardProps {
  /** The appointment data */
  appointment: Appointment;
  /** Configuration for the card display */
  config: AppointmentCardConfig;
  /** Optional CSS class names to apply to the card */
  className?: string;
  /** Callback when the expand/collapse button is clicked */
  onExpandToggle?: (id: string) => void;
  /** Whether the appointment details are expanded */
  isExpanded?: boolean;
  /** Callback when the star button is clicked */
  onStarToggle?: (id: string, isStarred: boolean) => void;
  /** Whether the appointment is starred */
  isStarred?: boolean;
  /** Callback when view map button is clicked */
  onViewMap?: (address: string) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
}