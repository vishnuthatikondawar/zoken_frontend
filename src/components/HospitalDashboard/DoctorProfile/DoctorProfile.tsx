import React, { useState, useRef } from 'react';
import { ArrowLeft, MoreVertical, Plus, ChevronDown, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusDropdown } from './StatusDropdown';
import { AddPatientModal } from './AddPatientModal';
import { DatePicker } from '../../DatePicker/DatePicker';
import type { Doctor, Patient, Slot } from '../../../types';

const MOCK_PATIENTS: Patient[] = [
  { id: '1', name: 'Venkatesh Raghavan', token: '01', status: 'Pending' },
  { id: '2', name: 'Priya Subramanian', token: '02', status: 'Pending' },
  { id: '3', name: 'Karthik Srinivasan', token: '03', status: 'Pending' },
  { id: '4', name: 'Deepa Krishnan', token: '04', status: 'Pending' },
  { id: '5', name: 'Rajesh Kumar', token: '05', status: 'Pending' },
  { id: '6', name: 'Anita Desai', token: '06', status: 'Pending' },
  { id: '7', name: 'Suresh Menon', token: '07', status: 'Pending' },
  { id: '8', name: 'Lakshmi Narayan', token: '08', status: 'Pending' },
  { id: '9', name: 'Arun Prakash', token: '09', status: 'Pending' },
  { id: '10', name: 'Meena Iyer', token: '10', status: 'Pending' }
];

interface DoctorProfileProps {
  doctor: Doctor;
  onUpdateDoctor: (doctor: Doctor) => void;
}

type PatientStatus = 'none' | 'rejected' | 'approved';

interface PatientStatusState {
  [key: string]: PatientStatus;
}

export function DoctorProfile({ doctor, onUpdateDoctor }: DoctorProfileProps) {
  const navigate = useNavigate();
  const [expandedSlots, setExpandedSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotStatus, setSlotStatus] = useState('start');
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [patientStatuses, setPatientStatuses] = useState<PatientStatusState>({});
  const slot2Ref = useRef<HTMLDivElement>(null);

  const getScheduleText = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);

    if (selectedDay.getTime() === today.getTime()) {
      return "Today's Schedule";
    } else if (selectedDay > today) {
      return "Upcoming Schedule";
    } else {
      return "Previous Schedule";
    }
  };

  const handleAddSlot = () => {
    const newSlotNumber = (doctor.slots.length + 1).toString();
    const newSlot: Slot = {
      id: newSlotNumber,
      currentToken: 0,
      pendingTokens: 0,
      totalTokens: 0,
      isActive: true,
      patients: []
    };

    const updatedDoctor = {
      ...doctor,
      slots: [...doctor.slots, newSlot]
    };

    onUpdateDoctor(updatedDoctor);

    setTimeout(() => {
      const newSlotElement = document.getElementById(`slot-${newSlotNumber}`);
      if (newSlotElement) {
        newSlotElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const toggleSlot = (slotId: string) => {
    setExpandedSlots(prev => {
      const newExpandedSlots = prev.includes(slotId)
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId];

      if (slotId === '2' && !prev.includes('2')) {
        setTimeout(() => {
          slot2Ref.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }

      return newExpandedSlots;
    });
  };

  const handleAddPatient = (slotId: string) => {
    setSelectedSlotId(slotId);
    setShowAddPatientModal(true);
  };

  const handleSavePatient = (patientData: { name: string; phoneNumber: string; token: string }) => {
    const newPatient: Patient = {
      id: Date.now().toString(),
      name: patientData.name,
      token: patientData.token,
      status: 'Pending'
    };

    const updatedDoctor = {
      ...doctor,
      slots: doctor.slots.map(slot => {
        if (slot.id === selectedSlotId) {
          return {
            ...slot,
            patients: [...slot.patients, newPatient],
            pendingTokens: slot.pendingTokens + 1,
            totalTokens: slot.totalTokens + 1
          };
        }
        return slot;
      })
    };

    onUpdateDoctor(updatedDoctor);
    setShowAddPatientModal(false);
  };

  const handleStatusToggle = (patientId: string, status: 'rejected' | 'approved') => {
    setPatientStatuses(prev => {
      const currentStatus = prev[patientId];
      if (currentStatus === status) {
        const { [patientId]: _, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [patientId]: status };
      }
    });
  };

  const scheduleText = getScheduleText(selectedDate);
  const isUpcoming = scheduleText === "Upcoming Schedule";

  return (
    <div className="min-h-screen bg-[#121212]">
      <header className="sticky top-0 bg-[#282828] border-b border-[#3E3E3E] z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-[#3E3E3E] rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">{doctor.name}</h1>
                <p className="text-[#B3B3B3]">{doctor.specialization}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-[#3E3E3E] rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <h2 className={`font-bold ${isUpcoming ? 'text-xl' : 'text-2xl'} text-white whitespace-nowrap`}>
                {scheduleText}
              </h2>
            </div>
            <div className="flex-shrink-0">
              <DatePicker
                selectedDate={selectedDate}
                onChange={setSelectedDate}
              />
            </div>
          </div>

          <div className="space-y-4">
            {doctor.slots.map((slot, index) => {
              const hasPatients = index === 0 ? MOCK_PATIENTS.length > 0 : slot.patients.length > 0;
              const isExpanded = expandedSlots.includes((index + 1).toString());
              
              return (
                <div 
                  key={slot.id}
                  id={`slot-${index + 1}`}
                  ref={index + 1 === 2 ? slot2Ref : null}
                  className={`bg-[#282828] rounded-2xl overflow-hidden transition-all duration-300 ${
                    !hasPatients && !isExpanded ? 'shadow-sm' : 'shadow-md'
                  }`}
                >
                  <div className={`p-4 ${!hasPatients ? 'pb-2' : ''}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">Slot {index + 1}</h3>
                      <div className="flex items-center gap-2">
                        <StatusDropdown 
                          value={index === 0 ? slotStatus : "start"} 
                          onChange={index === 0 ? setSlotStatus : () => {}}
                        />
                        <button 
                          onClick={() => handleAddPatient((index + 1).toString())}
                          className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white rounded-xl hover:bg-[#1ed760] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Patient</span>
                        </button>
                        <button 
                          onClick={() => toggleSlot((index + 1).toString())}
                          className="p-2 hover:bg-[#3E3E3E] rounded-full transition-colors"
                          aria-label={isExpanded ? "Collapse slot" : "Expand slot"}
                          aria-expanded={isExpanded}
                        >
                          <ChevronDown 
                            className={`w-5 h-5 text-white transform transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-[#3E3E3E]">
                      <div className="sticky top-0 z-10 bg-[#282828]">
                        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm text-[#B3B3B3]">
                          <div className="col-span-6">Patient</div>
                          <div className="col-span-3">Token</div>
                          <div className="col-span-3">Status</div>
                        </div>
                      </div>
                      <div className={`overflow-y-auto scrollbar-thin scrollbar-thumb-[#3E3E3E] scrollbar-track-[#282828] scroll-smooth ${
                        hasPatients ? 'h-[400px]' : 'h-auto'
                      }`}>
                        <div className="divide-y divide-[#3E3E3E]">
                          {(index === 0 ? MOCK_PATIENTS : slot.patients).map((patient) => (
                            <div key={patient.id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-[#3E3E3E] transition-colors">
                              <div className="col-span-6 font-medium text-white">{patient.name}</div>
                              <div className="col-span-3 text-[#B3B3B3]">{patient.token}</div>
                              <div className="col-span-3 flex gap-2">
                                <button 
                                  onClick={() => handleStatusToggle(patient.id, 'rejected')}
                                  className={`p-2 rounded-full transition-colors ${
                                    patientStatuses[patient.id] === 'rejected'
                                      ? 'bg-red-900'
                                      : 'hover:bg-[#3E3E3E]'
                                  }`}
                                >
                                  <X className={`w-5 h-5 ${
                                    patientStatuses[patient.id] === 'rejected'
                                      ? 'text-red-500'
                                      : 'text-white'
                                  }`} />
                                </button>
                                <button 
                                  onClick={() => handleStatusToggle(patient.id, 'approved')}
                                  className={`p-2 rounded-full transition-colors ${
                                    patientStatuses[patient.id] === 'approved'
                                      ? 'bg-green-900'
                                      : 'hover:bg-[#3E3E3E]'
                                  }`}
                                >
                                  <Check className={`w-5 h-5 ${
                                    patientStatuses[patient.id] === 'approved'
                                      ? 'text-green-500'
                                      : 'text-white'
                                  }`} />
                                </button>
                              </div>
                            </div>
                          ))}
                          {!hasPatients && (
                            <div className="px-4 py-6 text-center text-[#B3B3B3]">
                              No appointments scheduled yet.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button 
            onClick={handleAddSlot}
            className="fixed right-6 bottom-6 bg-[#1DB954] text-white rounded-full px-6 py-3 
                     flex items-center gap-2 shadow-lg hover:bg-[#1ed760] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Slot</span>
          </button>
        </div>
      </main>

      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onSave={handleSavePatient}
        slotId={selectedSlotId}
      />
    </div>
  );
}