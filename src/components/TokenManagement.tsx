import React, { useState } from 'react';
import { Modal } from './Modal/Modal';
import tokenDiamond from '../assets/token-diamond.svg';
import tokenClock from '../assets/token-clock.svg';
import tokenRefresh from '../assets/token-refresh.svg';
import addButton from '../assets/add_button.svg';
import prevButton from '../assets/prev_button.svg';

interface TokenManagementProps {
  location: string;
  currentToken: number;
  yourToken?: string;
  waitingTime: number;
  completedTokens: number[];
  onAddToken: (token: number) => void;
}

export function TokenManagement({ 
  location, 
  currentToken, 
  yourToken,
  waitingTime,
  completedTokens, 
  onAddToken 
}: TokenManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCompletedTokens, setShowCompletedTokens] = useState(false);
  const [newToken, setNewToken] = useState('');
  const [error, setError] = useState('');

  const sortedCompletedTokens = [...completedTokens].sort((a, b) => a - b);
  const lastCompletedToken = sortedCompletedTokens[sortedCompletedTokens.length - 1];

  const handleAddToken = () => {
    const tokenNumber = parseInt(newToken, 10);
    if (isNaN(tokenNumber) || tokenNumber < 1) {
      setError('Please enter a valid token number');
      return;
    }
    onAddToken(tokenNumber);
    setShowAddModal(false);
    setNewToken('');
    setError('');
  };

  return (
    <>
      <div className="token-boxes-container">
        <div className="token-box">
          <h3 className="token-label">Your Token</h3>
          <div className="token-content">
            <p className="token-number text-orange-500">{yourToken || '-'}</p>
            {!yourToken && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 text-[#607AFF] font-medium"
              >
                <img src={addButton} alt="" className="w-[18px] h-[18px]" />
                <span>ADD</span>
              </button>
            )}
          </div>
          <img src={tokenDiamond} alt="" className="absolute -bottom-2 -right-2 w-12 h-12 opacity-20" />
        </div>

        <div className="token-box">
          <h3 className="token-label">Waiting Time</h3>
          <div className="token-content items-start">
            <div className="waiting-time-display text-left">
              <span className="token-number text-pink-500">{waitingTime}</span>
              <span className="waiting-time-unit">min<br/>approx.</span>
            </div>
          </div>
          <img src={tokenClock} alt="" className="absolute -bottom-2 -right-2 w-12 h-12 opacity-20" />
        </div>

        <div className="token-box">
          <h3 className="token-label">Current Token</h3>
          <div className="token-content">
            <div className="flex flex-col items-center">
              <p className="token-number text-green-500">
                {String(currentToken).padStart(2, '0')}
              </p>
              {lastCompletedToken && (
                <p className="text-sm text-gray-500 -mt-1">
                  Last: {String(lastCompletedToken).padStart(2, '0')}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowCompletedTokens(true)}
              className="flex items-center gap-2 text-[#607AFF] font-medium"
            >
              <img src={prevButton} alt="" className="w-[18px] h-[18px]" />
              <span>PREV</span>
            </button>
          </div>
          <img src={tokenRefresh} alt="" className="absolute -bottom-2 -right-2 w-12 h-12 opacity-20" />
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setError('');
          setNewToken('');
        }}
        title={location}
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-6">Add Your Token</h3>
            <input
              type="number"
              value={newToken}
              onChange={(e) => {
                setNewToken(e.target.value);
                setError('');
              }}
              className="w-full p-4 text-xl rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#89FF60]"
              placeholder="Enter token number"
              autoFocus
            />
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </div>
          <button
            onClick={handleAddToken}
            className="w-full py-4 bg-[#89FF60] text-black rounded-2xl font-medium hover:bg-[#7aeb56] transition-colors"
          >
            Save
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showCompletedTokens}
        onClose={() => setShowCompletedTokens(false)}
        title={location}
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-6">Completed Tokens</h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {sortedCompletedTokens.map((token, index) => (
                <div 
                  key={token}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-2xl font-bold text-gray-600">
                      {String(token).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {index === sortedCompletedTokens.length - 1 ? 'Latest' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}