// Auth endpoints
export const AUTH = {
  LOGIN: '/api/v1/login',
  ADMIN_LOGIN: '/auth/admin/login',
  VERIFY_OTP: '/api/v1/verify-otp',
  RESET_PASSWORD: '/auth/reset-password',
};

// Doctor endpoints
export const DOCTORS = {
  LIST: '/doctors',
  DETAIL: (id: string) => `/doctors/${id}`,
  CREATE: '/doctors',
  UPDATE: (id: string) => `/doctors/${id}`,
  DELETE: (id: string) => `/doctors/${id}`,
};

// Appointment endpoints
export const APPOINTMENTS = {
  LIST: '/appointments',
  DETAIL: (id: string) => `/appointments/${id}`,
  CREATE: '/appointments',
  UPDATE: (id: string) => `/appointments/${id}`,
  DELETE: (id: string) => `/appointments/${id}`,
};

// Token management endpoints
export const TOKENS = {
  CURRENT: (doctorId: string) => `/doctors/${doctorId}/tokens/current`,
  UPDATE: (doctorId: string, tokenId: string) => `/doctors/${doctorId}/tokens/${tokenId}`,
  COMPLETED: (doctorId: string) => `/doctors/${doctorId}/tokens/completed`,
};