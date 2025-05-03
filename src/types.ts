import type { ReactNode } from 'react';

export interface SubEntity {
  title: string;
  description: string;
  address?: string;
}

export interface Entity {
  title: string;
  description: string;
  address: string;
  type: 'HOSPITAL' | 'QSR' | 'PARKING';
}

export interface OrderItem {
  quantity: number;
  item: string;
}

export interface Appointment {
  id: string;
  sub_entity_id: string;
  sub_entity: SubEntity;
  entity_id: string;
  entity: Entity;
  slot_id: string;
  user_id: string;
  current_token: number;
  token: string;
  order?: OrderItem[];
  status: string;
  is_favourite: boolean;
  start_time: string;
  end_time: string;
  notes: string;
  avgTime: string;
  createdDt: string;
  createdBy: string;
  updatedBy: string;
  updatedDt: string;
}

export interface DoctorSlot {
  name: string;
  current_token: string;
  pendingTokens: string;
  totalTokens: string;
}

export interface DoctorData {
  id: string;
  entity_id: string;
  entity_title: string;
  title: string;
  description: string;
  slot: DoctorSlot;
  is_favourite: boolean;
}

export interface Patient {
  id: string;
  name: string;
  token: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface Slot {
  id: string;
  currentToken: number;
  pendingTokens: number;
  totalTokens: number;
  isActive: boolean;
  patients: Patient[];
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  slots: Slot[];
  isFavorite: boolean;
  isActive?: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'HOSPITAL_ADMIN' | 'QSR_ADMIN';
  entityId: string;
}

export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CardConfig {
  template: string;
  titleSource: string;
  detailsClass: string;
}

export interface CardTypes {
  HOSPITAL: CardConfig;
  QSR: CardConfig;
  PARKING: CardConfig;
}

export interface TokenDisplay {
  yourToken: {
    value: string;
    empty: {
      display: string;
      enableAddButton: boolean;
    };
  };
  waitingTime: string;
  currentToken: string;
}

export interface DisplayRules {
  statusBadge: string;
  favorite: string;
  address: string[];
  tokenDisplay: TokenDisplay;
}

export interface AppointmentCardConfig {
  cardTypes: CardTypes;
  displayRules: DisplayRules;
  layout: string;
  sorting: string;
  refreshInterval: string;
}