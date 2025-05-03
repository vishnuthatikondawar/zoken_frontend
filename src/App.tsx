import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { LoginPage } from './components/LoginPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { TokensPage } from './components/TokensPage';
import { HospitalDashboard } from './components/HospitalDashboard/HospitalDashboard';
import { DoctorDetails } from './components/HospitalDashboard/DoctorDetails';
import { PhoneVerification } from './components/ForgotPassword/PhoneVerification';
import { OTPVerification } from './components/ForgotPassword/OTPVerification';
import { ResetPassword } from './components/ForgotPassword/ResetPassword';
import type { Appointment, AdminUser, Doctor, DoctorData } from './types';

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    sub_entity_id: '1',
    sub_entity: {
      title: 'Dr. Sridhar Vembu',
      description: 'Cardiologist',
      address: '123 Medical Center Drive'
    },
    entity_id: '1',
    entity: {
      title: 'Kims Hospital',
      description: 'Multi-specialty Hospital',
      address: '456 Healthcare Avenue, Kondapur',
      type: 'HOSPITAL'
    },
    slot_id: '1',
    user_id: '1',
    current_token: 5,
    token: '8',
    status: 'Waiting',
    is_favourite: true,
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 3600000).toISOString(),
    notes: '',
    avgTime: '30',
    createdDt: new Date().toISOString(),
    createdBy: '1',
    updatedBy: '1',
    updatedDt: new Date().toISOString()
  },
  {
    id: '2',
    sub_entity_id: '2',
    sub_entity: {
      title: 'Cafe Coffee Day',
      description: 'Coffee Shop',
      address: '789 Food Court Lane'
    },
    entity_id: '2',
    entity: {
      title: 'Food Court',
      description: 'Multi-cuisine Restaurant',
      address: '789 Food Court Lane, Hitech City',
      type: 'QSR'
    },
    slot_id: '2',
    user_id: '1',
    current_token: 12,
    token: '15',
    order: [
      { quantity: 2, item: 'Cappuccino' },
      { quantity: 1, item: 'Chocolate Brownie' }
    ],
    status: 'In Progress',
    is_favourite: false,
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 1800000).toISOString(),
    notes: '',
    avgTime: '15',
    createdDt: new Date().toISOString(),
    createdBy: '1',
    updatedBy: '1',
    updatedDt: new Date().toISOString()
  }
];

const MOCK_DOCTORS: DoctorData[] = [
  {
    "id": "1234",
    "entity_id": "1",
    "entity_title": "Kims hospital",
    "title": "Dr Sridhar vembu",
    "description": "Cardiologist",
    "slot": {
      "name": "slot 1",
      "current_token": "1",
      "pendingTokens": "25",
      "totalTokens": "30"
    },
    "is_favourite": true
  },
  {
    "id": "12345",
    "entity_id": "1",
    "entity_title": "Kims hospital",
    "title": "Dr SaiDeep",
    "description": "Sexologist",
    "slot": {
      "name": "slot 1",
      "current_token": "1",
      "pendingTokens": "25",
      "totalTokens": "30"
    },
    "is_favourite": true
  },
  {
    "id": "123456",
    "entity_id": "1",
    "entity_title": "Kims hospital",
    "title": "Dr Sai Pranaya",
    "description": "Senoir Dentist",
    "slot": {
      "name": "slot 1",
      "current_token": "1",
      "pendingTokens": "25",
      "totalTokens": "30"
    },
    "is_favourite": true
  },
  {
    "id": "1234567",
    "entity_id": "1",
    "entity_title": "Kims hospital",
    "title": "Dr Nikhil",
    "description": "Orthopedic",
    "slot": {},
    "is_favourite": true
  }
];

function transformDoctorData(doctorData: DoctorData): Doctor {
  return {
    id: doctorData.id,
    name: doctorData.title,
    specialization: doctorData.description,
    isFavorite: doctorData.is_favourite,
    isActive: true,
    slots: doctorData.slot.name ? [{
      id: doctorData.slot.name,
      currentToken: parseInt(doctorData.slot.current_token || '0'),
      pendingTokens: parseInt(doctorData.slot.pendingTokens || '0'),
      totalTokens: parseInt(doctorData.slot.totalTokens || '0'),
      isActive: true,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      patients: []
    }] : [],
    experience: 5,
    qualifications: ['MBBS', 'MD'],
    contactNumber: '+91 98765 43210',
    email: `${doctorData.title.toLowerCase().replace(/\s+/g, '.')}@kimshospitals.com`,
    address: 'Kims Hospital, Kondapur',
    about: `${doctorData.title} is a highly skilled ${doctorData.description.toLowerCase()} with extensive experience in patient care and specialized treatments.`,
    rating: 4.5,
    totalPatients: 1000,
    yearsOfExperience: 5
  };
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const hasToken = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
    return Boolean(hasToken);
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [userName, setUserName] = useState('Swaminathan');
  const [doctors, setDoctors] = useState<Doctor[]>(
    MOCK_DOCTORS.map(transformDoctorData)
  );

  const handleLogin = (phoneNumber: string) => {
    setIsLoggedIn(true);
    setAdminUser(null);
    localStorage.setItem('userToken', 'user_session_token');
  };

  const handleAdminLogin = async (credentials: { email: string; password: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
      setIsLoggedIn(true);
      setAdminUser({
        id: '1',
        email: credentials.email,
        role: 'HOSPITAL_ADMIN',
        entityId: '1'
      });
      setUserName('Admin');
      localStorage.setItem('adminToken', 'admin_session_token');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      localStorage.removeItem('userToken');
      localStorage.removeItem('adminToken');
      sessionStorage.clear();
      
      setIsLoggedIn(false);
      setAdminUser(null);
      setUserName('');
      
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  }, []);

  const handleUpdateDoctor = (updatedDoctor: Doctor) => {
    setDoctors(prevDoctors =>
      prevDoctors.map(doctor =>
        doctor.id === updatedDoctor.id ? updatedDoctor : doctor
      )
    );
  };

  const handleSendOTP = async (phoneNumber: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('OTP sent successfully');
  };

  const handleVerifyOTP = async (otp: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (otp !== '1234') {
      throw new Error('Invalid OTP');
    }
    toast.success('OTP verified successfully');
  };

  const handleResendOTP = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('OTP resent successfully');
  };

  const handleResetPassword = async (passwords: { password: string; confirmPassword: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Password reset successfully');
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const hasValidToken = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
    if (!isLoggedIn || !hasValidToken) {
      return <Navigate to="/" />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/admin" element={
          isLoggedIn && adminUser ? 
            <Navigate to="/admin/dashboard" /> : 
            <AdminLoginPage onLogin={handleAdminLogin} />
        } />
        <Route path="/forgot-password" element={
          <PhoneVerification onSubmit={handleSendOTP} />
        } />
        <Route path="/forgot-password/verify-otp" element={
          <OTPVerification onVerify={handleVerifyOTP} onResend={handleResendOTP} />
        } />
        <Route path="/forgot-password/reset" element={
          <ResetPassword onSubmit={handleResetPassword} />
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <HospitalDashboard 
              doctors={doctors} 
              onUpdateDoctor={handleUpdateDoctor}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        } />
        <Route path="/admin/doctors/:doctorId" element={
          <ProtectedRoute>
            <DoctorDetails 
              doctors={doctors}
              onUpdateDoctor={handleUpdateDoctor}
            />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          !isLoggedIn ? (
            <LoginPage onLogin={handleLogin} />
          ) : (
            <TokensPage 
              userName={userName} 
              appointments={MOCK_APPOINTMENTS}
              onLogout={handleLogout}
              config={{
                cardTypes: {
                  HOSPITAL: {
                    template: 'hospital-card',
                    titleSource: 'entity.title',
                    detailsClass: 'appointment-details'
                  },
                  QSR: {
                    template: 'qsr-card',
                    titleSource: 'sub_entity.title',
                    detailsClass: 'appointment-details'
                  },
                  PARKING: {
                    template: 'parking-card',
                    titleSource: 'entity.title',
                    detailsClass: 'appointment-details'
                  }
                },
                displayRules: {
                  statusBadge: 'data.status',
                  favorite: 'data.is_favourite',
                  address: ['data.sub_entity.address', 'data.entity.address'],
                  tokenDisplay: {
                    yourToken: {
                      value: 'data.token',
                      empty: {
                        display: '-',
                        enableAddButton: true
                      }
                    },
                    waitingTime: 'data.avgTime',
                    currentToken: 'data.current_token'
                  }
                },
                layout: 'responsive-grid',
                sorting: 'timestamp',
                refreshInterval: '30s'
              }}
            />
          )
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;