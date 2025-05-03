import React from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import type { Slot } from '../../../types';

interface TimeSlotsProps {
  slots: Slot[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function TimeSlots({ slots, selectedDate, onDateChange }: TimeSlotsProps) {
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  });

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-gray-400" />
          <h2 className="text-xl font-bold">Today's Schedule</h2>
        </div>
        <button className="flex items-center gap-2 text-gray-600">
          <span>{formattedDate}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {slots.map((slot) => (
          <div key={slot.id} className="border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Slot {slot.id}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {new Date(slot.startTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  })}
                  {' - '}
                  {new Date(slot.endTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  })}
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  slot.isActive ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-orange-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-orange-500">{slot.currentToken}</p>
                <p className="text-sm text-gray-600">Current Token</p>
              </div>
              <div className="bg-pink-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-pink-500">{slot.pendingTokens}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-green-500">{slot.totalTokens}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}