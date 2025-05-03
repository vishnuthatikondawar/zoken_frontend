import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface DatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export function DatePicker({ selectedDate, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowMonthDropdown(false);
        setShowYearDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showYearDropdown && yearListRef.current) {
      const currentYearElement = yearListRef.current.querySelector(`[data-year="${currentMonth.getFullYear()}"]`);
      if (currentYearElement) {
        currentYearElement.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
    }
  }, [showYearDropdown]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days: (number | null)[] = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${month} ${day}, ${weekday}`;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onChange(newDate);
    setIsOpen(false);
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex));
    setShowMonthDropdown(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth()));
    setShowYearDropdown(false);
  };

  const isCurrentDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === new Date().toDateString();
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from(
    { length: 2050 - 2010 + 1 }, 
    (_, i) => 2010 + i
  );

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-[#282828] rounded-xl border border-[#3E3E3E] 
                   hover:border-[#1DB954] focus:outline-none focus:ring-2 focus:ring-[#1DB954] 
                   transition-all text-base font-medium"
        aria-label="Select date"
        aria-expanded={isOpen}
      >
        <CalendarIcon className="w-5 h-5 text-[#B3B3B3]" />
        <span className="text-white">{formatDate(selectedDate)}</span>
        <ChevronLeft 
          className={`w-4 h-4 text-[#B3B3B3] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 p-6 bg-[#282828] rounded-2xl shadow-xl border border-[#3E3E3E] 
                     z-50 min-w-[320px] transform origin-top-right transition-all duration-200"
          role="dialog"
          aria-label="Calendar"
        >
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-[#3E3E3E] rounded-xl transition-colors 
                       text-[#B3B3B3] hover:text-white"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => {
                    setShowMonthDropdown(!showMonthDropdown);
                    setShowYearDropdown(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#3E3E3E] transition-colors"
                >
                  <span className="text-lg font-semibold text-white">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#B3B3B3] transition-transform ${showMonthDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showMonthDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 max-h-64 overflow-y-auto bg-[#282828] rounded-xl shadow-lg border border-[#3E3E3E] py-2 z-50">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => handleMonthSelect(index)}
                        className={`w-full px-4 py-2 text-left hover:bg-[#3E3E3E] transition-colors ${
                          currentMonth.getMonth() === index ? 'bg-[#1DB954] text-white' : 'text-white'
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowYearDropdown(!showYearDropdown);
                    setShowMonthDropdown(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#3E3E3E] transition-colors"
                >
                  <span className="text-lg font-semibold text-white">{currentMonth.getFullYear()}</span>
                  <ChevronDown className={`w-4 h-4 text-[#B3B3B3] transition-transform ${showYearDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showYearDropdown && (
                  <div 
                    ref={yearListRef}
                    className="absolute top-full left-0 mt-1 w-32 max-h-64 overflow-y-auto bg-[#282828] rounded-xl shadow-lg border border-[#3E3E3E] py-2 z-50"
                  >
                    {years.map((year) => (
                      <button
                        key={year}
                        data-year={year}
                        onClick={() => handleYearSelect(year)}
                        className={`w-full px-4 py-2 text-left hover:bg-[#3E3E3E] transition-colors ${
                          currentMonth.getFullYear() === year ? 'bg-[#1DB954] text-white' : 'text-white'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-[#3E3E3E] rounded-xl transition-colors 
                       text-[#B3B3B3] hover:text-white"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-[#B3B3B3] pb-2"
              >
                {day}
              </div>
            ))}
            {getDaysInMonth(currentMonth).map((day, index) => (
              <button
                key={index}
                onClick={() => day !== null && handleDateSelect(day)}
                disabled={day === null}
                className={`
                  relative aspect-square p-2 text-sm font-medium rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:ring-offset-2
                  disabled:cursor-default
                  ${day === null ? 'invisible' : 'hover:bg-[#3E3E3E]'}
                  ${isCurrentDate(day as number) 
                    ? 'bg-[#1DB954] text-white hover:bg-[#1ed760]' 
                    : 'text-white'}
                  ${isToday(day as number) && !isCurrentDate(day as number)
                    ? 'after:content-[""] after:absolute after:bottom-1 after:left-1/2 ' +
                      'after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#1DB954] ' +
                      'after:rounded-full'
                    : ''}
                  transition-all duration-200
                `}
                aria-label={day 
                  ? `Select ${new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toLocaleDateString()}` 
                  : undefined
                }
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}