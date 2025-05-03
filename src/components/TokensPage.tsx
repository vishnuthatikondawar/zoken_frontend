import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Appointment, AppointmentCardConfig } from '../types';
import { AppointmentCard } from './AppointmentCard';
import { UserMenu } from './UserMenu';
import zokenLogo from '../assets/zoken_logo.svg';

interface TokensPageProps {
  userName: string;
  appointments: Appointment[];
  config: AppointmentCardConfig;
  onLogout: () => Promise<boolean>;
}

export function TokensPage({ userName, appointments, config, onLogout }: TokensPageProps) {
  const [expandedAppointments, setExpandedAppointments] = useState<string[]>([]);
  const [starredAppointments, setStarredAppointments] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleExpand = (appointmentId: string) => {
    setExpandedAppointments(prev => 
      prev.includes(appointmentId)
        ? prev.filter(id => id !== appointmentId)
        : [...prev, appointmentId]
    );
  };

  const handleViewMap = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleStarToggle = (appointmentId: string, isStarred: boolean) => {
    setStarredAppointments(prev =>
      isStarred
        ? [...prev, appointmentId]
        : prev.filter(id => id !== appointmentId)
    );
  };

  return (
    <div className="tokens-container">
      <header className="tokens-header">
        <div>
          <h1 className="tokens-greeting">
            Hi, <span className="tokens-greeting-name">{userName}!</span>
          </h1>
        </div>
        <UserMenu onLogout={onLogout} />
      </header>

      <main className="tokens-content">
        <h2 className="tokens-section-title">Today</h2>
        <div className="appointment-list">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              config={config}
              isExpanded={expandedAppointments.includes(appointment.id)}
              isStarred={starredAppointments.includes(appointment.id)}
              onExpandToggle={toggleExpand}
              onStarToggle={handleStarToggle}
              onViewMap={handleViewMap}
            />
          ))}
        </div>
      </main>
      
      <footer className="tokens-footer">
        <img src={zokenLogo} alt="Zoken" className="footer-logo-image" />
      </footer>
    </div>
  );
}