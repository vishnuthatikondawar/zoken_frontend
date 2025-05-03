import React, { useState } from 'react';
import { Modal } from '../../Modal/Modal';
import { FloatingLabelInput } from '../../FloatingLabelInput';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: { name: string; phoneNumber: string; token: string }) => void;
  slotId: string;
}

export function AddPatientModal({ isOpen, onClose, onSave, slotId }: AddPatientModalProps) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [token, setToken] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateForm = () => {
    const isNameValid = name.trim().length >= 2;
    const isTokenValid = token.trim().length > 0;
    setIsValid(isNameValid && isTokenValid);
    return isNameValid && isTokenValid;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3').trim());
    }
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setToken(value);
    validateForm();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    validateForm();
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        name: name.trim(),
        phoneNumber: phoneNumber.replace(/\s/g, ''),
        token
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setPhoneNumber('');
    setToken('');
    setIsValid(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Add Patient - Slot ${slotId}`}>
      <div className="space-y-6">
        <div className="space-y-4">
          <FloatingLabelInput
            id="patientName"
            type="text"
            label="Patient Name"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter patient's full name"
            autoFocus
          />

          <FloatingLabelInput
            id="phoneNumber"
            type="tel"
            label="Phone Number (Optional)"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Enter 10-digit mobile number"
          />

          <FloatingLabelInput
            id="token"
            type="text"
            label="Token Number"
            value={token}
            onChange={handleTokenChange}
            placeholder="Enter token number"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-medium transition-colors ${
            isValid
              ? 'bg-[#1DB954] hover:bg-[#1ed760] text-white'
              : 'bg-[#3E3E3E] text-[#B3B3B3] cursor-not-allowed'
          }`}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}