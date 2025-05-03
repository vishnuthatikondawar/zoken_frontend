import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { DoctorCard } from './DoctorCard';
import { AddDoctorModal } from './AddDoctorModal';
import { EditDoctorModal } from './EditDoctorModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { AdminMenu } from './AdminMenu';
import type { Doctor } from '../../types';
import zokenLogo from '../../assets/zoken_logo.svg';

interface HospitalDashboardProps {
  doctors: Doctor[];
  onUpdateDoctor: (doctor: Doctor) => void;
  onLogout: () => Promise<boolean>;
}

export function HospitalDashboard({ doctors, onUpdateDoctor, onLogout }: HospitalDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deletingDoctor, setDeletingDoctor] = useState<Doctor | null>(null);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      setEditingDoctor(doctor);
    }
  };

  const handleDelete = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      setDeletingDoctor(doctor);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingDoctor) {
      const updatedDoctors = doctors.filter(d => d.id !== deletingDoctor.id);
      onUpdateDoctor({ ...deletingDoctor, isActive: false });
      toast.success(`${deletingDoctor.name} has been deleted`);
      setDeletingDoctor(null);
    }
  };

  const handleSaveEdit = (updatedDoctor: Doctor) => {
    onUpdateDoctor(updatedDoctor);
    toast.success(`${updatedDoctor.name}'s details have been updated`);
    setEditingDoctor(null);
  };

  const handleToggleFavorite = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      onUpdateDoctor({
        ...doctor,
        isFavorite: !doctor.isFavorite
      });
    }
  };

  const handleAddDoctor = (newDoctor: { name: string; specialization: string }) => {
    const doctor: Doctor = {
      id: (doctors.length + 1).toString(),
      name: newDoctor.name,
      specialization: newDoctor.specialization,
      isFavorite: false,
      isActive: true,
      slots: [],
      experience: 0,
      qualifications: [],
      rating: 0,
      totalPatients: 0,
      yearsOfExperience: 0
    };
    onUpdateDoctor(doctor);
    toast.success(`${doctor.name} has been added successfully`);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="sticky top-0 z-50">
        <header className="bg-[#282828] border-b border-[#3E3E3E]">
          <div className="max-w-2xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=48&h=48&fit=crop"
                  alt="Hospital Logo"
                  className="w-12 h-12 rounded-xl"
                />
                <h1 className="text-2xl font-bold text-white">Kims Hospitals</h1>
              </div>
              <AdminMenu onLogout={onLogout} />
            </div>
          </div>
        </header>
        <div className="bg-[#121212] pt-2 pb-1">
          <div className="max-w-2xl mx-auto px-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B3B3B3] w-5 h-5" />
              <input
                type="text"
                placeholder="Search doctor"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#282828] text-white rounded-2xl border-none focus:ring-2 focus:ring-[#1DB954] placeholder-[#B3B3B3]"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 pt-2 pb-24">
        <div className="space-y-4">
          {filteredDoctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </main>

      <div className="fixed bottom-20 right-6 z-50">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#1DB954] text-white rounded-full px-6 py-3 flex items-center gap-2 shadow-lg hover:bg-[#1ed760] transition-colors"
          aria-label="Add new doctor"
        >
          <Plus className="w-5 h-5" />
          <span>Doctor</span>
        </button>
      </div>

      <footer className="tokens-footer">
        <img src={zokenLogo} alt="Zoken" className="footer-logo-image" />
      </footer>

      <AddDoctorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddDoctor}
      />

      {editingDoctor && (
        <EditDoctorModal
          isOpen={true}
          onClose={() => setEditingDoctor(null)}
          onSave={handleSaveEdit}
          doctor={editingDoctor}
        />
      )}

      {deletingDoctor && (
        <DeleteConfirmationModal
          isOpen={true}
          onClose={() => setDeletingDoctor(null)}
          onConfirm={handleConfirmDelete}
          doctorName={deletingDoctor.name}
        />
      )}
    </div>
  );
}