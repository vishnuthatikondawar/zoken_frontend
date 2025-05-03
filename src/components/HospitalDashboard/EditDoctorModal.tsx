import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Modal } from '../Modal/Modal';
import { FloatingLabelInput } from '../FloatingLabelInput';
import type { Doctor } from '../../types';

const SPECIALIZATIONS = [
  'Cardio Surgeon',
  'Cardiologist',
  'Endocrinologist',
  'Neurologist',
  'Pulmonologist',
  'Orthopedic Surgeon',
  'Pediatrician',
  'Dermatologist'
];

interface EditDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doctor: Doctor) => void;
  doctor: Doctor;
}

export function EditDoctorModal({ isOpen, onClose, onSave, doctor }: EditDoctorModalProps) {
  const [name, setName] = useState(doctor.name);
  const [specialization, setSpecialization] = useState(doctor.specialization);
  const [specializationSearch, setSpecializationSearch] = useState('');
  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(false);
  const [experience, setExperience] = useState(doctor.yearsOfExperience?.toString() || '');
  const [qualifications, setQualifications] = useState(doctor.qualifications?.join(', ') || '');
  const [contactNumber, setContactNumber] = useState(doctor.contactNumber || '');
  const [email, setEmail] = useState(doctor.email || '');
  const [isValid, setIsValid] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsValid(
      name.length >= 2 && 
      specialization.length >= 2 &&
      (!experience || (parseInt(experience) >= 0 && parseInt(experience) <= 50))
    );
  }, [name, specialization, experience]);

  useEffect(() => {
    if (showSpecializationDropdown && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSpecializationDropdown]);

  const handleClose = () => {
    setName(doctor.name);
    setSpecialization(doctor.specialization);
    setSpecializationSearch('');
    setShowSpecializationDropdown(false);
    setExperience(doctor.yearsOfExperience?.toString() || '');
    setQualifications(doctor.qualifications?.join(', ') || '');
    setContactNumber(doctor.contactNumber || '');
    setEmail(doctor.email || '');
    onClose();
  };

  const handleSave = () => {
    if (!isValid) return;

    const updatedDoctor: Doctor = {
      ...doctor,
      name,
      specialization,
      yearsOfExperience: experience ? parseInt(experience) : undefined,
      qualifications: qualifications.split(',').map(q => q.trim()).filter(Boolean),
      contactNumber: contactNumber.trim(),
      email: email.trim()
    };

    onSave(updatedDoctor);
    handleClose();
  };

  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setContactNumber(value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3').trim());
    }
  };

  const filteredSpecializations = SPECIALIZATIONS.filter(spec =>
    spec.toLowerCase().includes(specializationSearch.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Doctor">
      <div className="space-y-6">
        <FloatingLabelInput
          id="doctorName"
          type="text"
          label="Doctor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSpecializationDropdown(!showSpecializationDropdown)}
            className={`w-full p-4 text-left rounded-xl border border-[#1DB954] 
                       focus:outline-none focus:ring-2 focus:ring-[#1DB954] bg-[#282828] text-white`}
          >
            {specialization || 'Select Specialization'}
          </button>
          
          {showSpecializationDropdown && (
            <div className="absolute z-10 w-full mt-2 bg-[#282828] rounded-xl shadow-lg overflow-hidden border border-[#3E3E3E]">
              <div className="p-2 border-b border-[#3E3E3E]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3] w-5 h-5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={specializationSearch}
                    onChange={(e) => setSpecializationSearch(e.target.value)}
                    placeholder="Search specialization..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#3E3E3E] 
                             focus:outline-none focus:ring-2 focus:ring-[#1DB954] bg-[#282828] 
                             text-white placeholder-[#B3B3B3]"
                  />
                </div>
              </div>
              <div className="max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-[#3E3E3E] scrollbar-track-[#282828]">
                {filteredSpecializations.length > 0 ? (
                  filteredSpecializations.map((spec) => (
                    <button
                      key={spec}
                      className="w-full px-4 py-3 text-left hover:bg-[#3E3E3E] focus:outline-none 
                               focus:bg-[#3E3E3E] text-white transition-colors"
                      onClick={() => {
                        setSpecialization(spec);
                        setShowSpecializationDropdown(false);
                        setSpecializationSearch('');
                      }}
                    >
                      {spec}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-[#B3B3B3] text-center">
                    No specializations found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <FloatingLabelInput
          id="experience"
          type="number"
          label="Years of Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <FloatingLabelInput
          id="qualifications"
          type="text"
          label="Qualifications (comma-separated)"
          value={qualifications}
          onChange={(e) => setQualifications(e.target.value)}
        />

        <FloatingLabelInput
          id="contactNumber"
          type="tel"
          label="Contact Number"
          value={contactNumber}
          onChange={handleContactNumberChange}
        />

        <FloatingLabelInput
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex gap-4">
          <button
            onClick={handleClose}
            className="flex-1 py-4 rounded-xl border border-[#3E3E3E] font-medium 
                     text-white hover:bg-[#3E3E3E] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`flex-1 py-4 rounded-xl font-medium transition-colors ${
              isValid
                ? 'bg-[#1DB954] hover:bg-[#1ed760] text-white'
                : 'bg-[#3E3E3E] text-[#B3B3B3] cursor-not-allowed'
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}