import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DoctorProfile } from './DoctorProfile/DoctorProfile';
import type { Doctor } from '../../types';

interface DoctorDetailsProps {
  doctors: Doctor[];
  onUpdateDoctor: (doctor: Doctor) => void;
}

export function DoctorDetails({ doctors, onUpdateDoctor }: DoctorDetailsProps) {
  const { doctorId } = useParams<{ doctorId: string }>();
  const doctor = doctors.find(d => d.id === doctorId);

  if (!doctor) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <DoctorProfile doctor={doctor} onUpdateDoctor={onUpdateDoctor} />;
}