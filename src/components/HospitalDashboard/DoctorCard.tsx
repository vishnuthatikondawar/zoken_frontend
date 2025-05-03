import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Star, ChevronRight, Edit2, Trash2, PieChart } from 'lucide-react';
import type { Doctor } from '../../types';
import { TokenManagementModal } from './TokenManagementModal';
import tokenDiamond from '../../assets/token-diamond.svg';
import tokenClock from '../../assets/token-clock.svg';
import tokenRefresh from '../../assets/token-refresh.svg';

interface DoctorCardProps {
  doctor: Doctor;
  onEdit: (doctorId: string) => void;
  onDelete: (doctorId: string) => void;
  onToggleFavorite: (doctorId: string) => void;
}

export function DoctorCard({ doctor, onEdit, onDelete, onToggleFavorite }: DoctorCardProps) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [completedTokens, setCompletedTokens] = useState<Array<{ number: string; status: 'completed' | 'partial' }>>([]);
  const activeSlot = doctor.slots.find(slot => slot.isActive);

  const handleCardClick = (event: React.MouseEvent) => {
    if (
      (event.target as HTMLElement).closest('.doctor-menu') ||
      (event.target as HTMLElement).closest('.token-boxes-container')
    ) {
      return;
    }
    navigate(`/admin/doctors/${doctor.id}`);
  };

  const handleTokenUpdate = (token: string, status: 'completed' | 'partial') => {
    setCompletedTokens(prev => {
      const existing = prev.find(t => t.number === token);
      if (existing) {
        return prev.map(t =>
          t.number === token ? { ...t, status } : t
        );
      }
      return [...prev, { number: token, status }].sort((a, b) => 
        parseInt(a.number) - parseInt(b.number)
      );
    });
  };

  return (
    <>
      <div 
        className="bg-[#282828] rounded-2xl p-4 shadow-sm cursor-pointer relative hover:bg-[#3E3E3E] transition-colors"
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between relative">
              <div className="space-y-0.5">
                <h3 className="text-xl font-semibold text-white">{doctor.name}</h3>
                <p className="text-[#B3B3B3] text-sm">{doctor.specialization}</p>
              </div>
              <div className="flex items-center gap-2 doctor-menu">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(!showMenu);
                    }}
                    className="p-2 hover:bg-[#3E3E3E] rounded-full transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-[#B3B3B3]" />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-[#282828] rounded-xl shadow-lg py-1 z-[60]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(doctor.id);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[#3E3E3E] text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(doctor.id);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-500 hover:bg-[#3E3E3E]"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(doctor.id);
                  }}
                  className="p-2 hover:bg-[#3E3E3E] rounded-full transition-colors"
                >
                  <Star
                    className={`w-5 h-5 ${
                      doctor.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-[#B3B3B3]'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {activeSlot ? (
          <div className="mt-3">
            <p className="text-sm font-medium mb-2 text-white">Slot {activeSlot.id}</p>
            <div className="token-boxes-container relative z-10">
              <div className="token-box">
                <h3 className="token-label">Current Token</h3>
                <div className="token-content">
                  <p className="token-number text-orange-500">{activeSlot.currentToken}</p>
                </div>
                <img src={tokenDiamond} alt="" className="absolute -bottom-2 -right-2 w-12 h-12 opacity-20" />
              </div>

              <div 
                className="token-box cursor-pointer hover:scale-105 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTokenModal(true);
                }}
              >
                <h3 className="token-label">Completed Tokens</h3>
                <div className="token-content">
                  <p className="token-number text-pink-500">{completedTokens.length}</p>
                </div>
                <img src={tokenClock} alt="" className="absolute -bottom-2 -right-2 w-12 h-12 opacity-20" />
              </div>

              <div className="token-box">
                <h3 className="token-label">Total Tokens</h3>
                <div className="token-content">
                  <p className="token-number text-[#1DB954]">{activeSlot.totalTokens}</p>
                </div>
                <img src={tokenRefresh} alt="" className="absolute -bottom-2 -right-2 w-12 h-12 opacity-20" />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[#B3B3B3] mt-4">No active queue or slot</p>
        )}

        <ChevronRight className="absolute right-4 bottom-4 w-6 h-6 text-[#B3B3B3]" />
      </div>

      <TokenManagementModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        title={doctor.name}
        completedTokens={completedTokens}
        onTokenUpdate={handleTokenUpdate}
      />
    </>
  );
}