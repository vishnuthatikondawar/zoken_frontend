import React, { useState } from 'react';
import { PieChart } from 'lucide-react';
import { Modal } from '../Modal/Modal';

interface TokenManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  completedTokens: Array<{
    number: string;
    status: 'completed' | 'partial';
  }>;
  onTokenUpdate: (token: string, status: 'completed' | 'partial') => void;
}

export function TokenManagementModal({
  isOpen,
  onClose,
  title,
  completedTokens,
  onTokenUpdate
}: TokenManagementModalProps) {
  const [tokenNumber, setTokenNumber] = useState('');
  const [error, setError] = useState('');

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 100)) {
      setTokenNumber(value);
      setError('');
    }
  };

  const handleStatusUpdate = (status: 'completed' | 'partial') => {
    if (!tokenNumber) {
      setError('Please enter a token number');
      return;
    }

    const tokenValue = parseInt(tokenNumber);
    if (tokenValue < 1 || tokenValue > 100) {
      setError('Token number must be between 1 and 100');
      return;
    }

    onTokenUpdate(tokenNumber.padStart(2, '0'), status);
    setTokenNumber('');
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div>
          <input
            type="text"
            value={tokenNumber}
            onChange={handleTokenChange}
            placeholder="Enter token number"
            className="w-full p-3 text-lg rounded-xl border border-[#3E3E3E] bg-[#282828] text-white 
                     focus:outline-none focus:ring-2 focus:ring-[#1DB954] placeholder-[#B3B3B3]"
            maxLength={3}
          />
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleStatusUpdate('partial')}
            className="flex-1 py-3 bg-[#3E3E3E] rounded-xl font-medium text-white 
                     hover:bg-[#4E4E4E] transition-colors"
          >
            Partially Done
          </button>
          <button
            onClick={() => handleStatusUpdate('completed')}
            className="flex-1 py-3 bg-[#1DB954] rounded-xl font-medium text-white 
                     hover:bg-[#1ed760] transition-colors"
          >
            Completed
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Completed Tokens</h3>
          <div className="max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#3E3E3E] scrollbar-track-[#282828]">
            <div className="grid grid-cols-4 gap-3">
              {completedTokens.map((token) => (
                <div
                  key={token.number}
                  className="relative aspect-square"
                >
                  <div className={`absolute inset-0 rounded-2xl flex items-center justify-center border-2 ${
                    token.status === 'completed' 
                      ? 'border-[#1DB954] bg-[#1DB95420]' 
                      : 'border-[#FF9800] bg-[#FF980020]'
                  }`}>
                    <span className={`text-[2.5rem] font-bold ${
                      token.status === 'completed' ? 'text-[#1DB954]' : 'text-[#FF9800]'
                    }`}>
                      {token.number}
                    </span>
                    {token.status === 'partial' && (
                      <div className="absolute top-2 right-2">
                        <PieChart className="w-4 h-4 text-[#FF9800]" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}