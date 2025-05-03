import React from 'react';
import { Phone, Mail, MapPin, Edit2 } from 'lucide-react';
import type { Doctor } from '../../../types';

interface DoctorInfoProps {
  doctor: Doctor;
  onUpdateDoctor: (doctor: Doctor) => void;
}

export function DoctorInfo({ doctor, onUpdateDoctor }: DoctorInfoProps) {
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Doctor Information</h2>
          <p className="text-gray-600">Personal & professional details</p>
        </div>
        <button
          onClick={() => {/* Implement edit functionality */}}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          aria-label="Edit doctor information"
        >
          <Edit2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
          <p className="text-gray-700">{doctor.about || 'No information available'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Qualifications</h3>
          <ul className="list-disc list-inside text-gray-700">
            {doctor.qualifications?.map((qual, index) => (
              <li key={index}>{qual}</li>
            )) || <li>No qualifications listed</li>}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Experience</h3>
          <p className="text-gray-700">
            {doctor.yearsOfExperience 
              ? `${doctor.yearsOfExperience} years of experience`
              : 'Experience not specified'}
          </p>
        </div>

        <div className="pt-6 border-t">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Contact Information</h3>
          <div className="space-y-4">
            {doctor.contactNumber && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{doctor.contactNumber}</span>
              </div>
            )}
            {doctor.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{doctor.email}</span>
              </div>
            )}
            {doctor.address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{doctor.address}</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-[#89FF60]">{doctor.totalPatients || 0}</p>
              <p className="text-sm text-gray-600">Total Patients</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-[#89FF60]">{doctor.rating || 0}/5</p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}