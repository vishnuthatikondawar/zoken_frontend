import React from 'react';
import { Clock, MapPin, Phone, Map } from 'lucide-react';
import { StarButton } from '../StarButton';
import { TokenManagement } from '../TokenManagement';
import chevronDown from '../../assets/chevron-down.svg';
import chevronUp from '../../assets/chevron-up.svg';
import type { AppointmentCardProps } from './types';

export function AppointmentCard({
  appointment,
  config,
  className = '',
  onExpandToggle,
  isExpanded = false,
  onStarToggle,
  isStarred = false,
  onViewMap,
  isLoading = false,
  error,
}: AppointmentCardProps) {
  if (isLoading) {
    return (
      <div className="appointment-card animate-pulse">
        <div className="h-24 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointment-card bg-red-50 border-red-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const cardType = config.cardTypes[appointment.entity.type];
  const title = appointment.entity.type === 'QSR' 
    ? appointment.sub_entity.title 
    : appointment.entity.title;

  const handleExpand = () => {
    onExpandToggle?.(appointment.id);
  };

  const handleStar = (isStarred: boolean) => {
    onStarToggle?.(appointment.id, isStarred);
  };

  const handleViewMap = () => {
    onViewMap?.(appointment.entity.address);
  };

  const formatOrderItems = (order?: { quantity: number; item: string; }[]) => {
    if (!order || order.length === 0) return '';
    return order.map(item => `${item.quantity} x ${item.item}`).join(', ');
  };

  return (
    <div 
      className={`appointment-card ${className}`}
      role="article"
      aria-label={`Appointment at ${title}`}
    >
      <div className="appointment-header">
        <div className="appointment-location">
          <div className={`appointment-icon appointment-icon--${appointment.entity.type.toLowerCase()}`}>
            <img 
              src={appointment.entity.type === 'HOSPITAL' 
                ? "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=48&h=48&fit=crop&auto=format"
                : "https://images.unsplash.com/photo-1594461185450-7a92ef113908?w=48&h=48&fit=crop&auto=format"
              }
              alt={appointment.entity.type}
              className="w-12 h-12 rounded-xl object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={cardType.detailsClass}>{title}</h3>
              <div className="flex items-center gap-2 ml-2">
                <span className="status-badge">
                  <Clock className="w-3 h-3" />
                  {appointment.status}
                </span>
                <StarButton
                  initialState={appointment.is_favourite}
                  onChange={handleStar}
                />
              </div>
            </div>
            <p className="appointment-date">
              {new Date(appointment.start_time).toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}
            </p>
          </div>
        </div>

        <TokenManagement
          location={title}
          currentToken={appointment.current_token}
          yourToken={appointment.token}
          waitingTime={parseInt(appointment.avgTime)}
          completedTokens={[]}
          onAddToken={() => {}}
        />

        {appointment.entity.type === 'HOSPITAL' ? (
          <>
            <div className="doctor-info">
              <div>
                <p className="doctor-name">{appointment.sub_entity.title}</p>
                <p className="doctor-specialization">{appointment.sub_entity.description}</p>
              </div>
              <button 
                className="expand-button"
                onClick={handleExpand}
                aria-expanded={isExpanded}
                aria-controls={`details-${appointment.id}`}
              >
                <img 
                  src={isExpanded ? chevronUp : chevronDown} 
                  alt={isExpanded ? "Collapse details" : "Expand details"} 
                  className="w-6 h-6"
                />
              </button>
            </div>
          </> 
        ) : (
          <>
            <div className="order-info">
              <p className="order-details">{formatOrderItems(appointment.order)}</p>
              <button 
                className="expand-button"
                onClick={handleExpand}
                aria-expanded={isExpanded}
                aria-controls={`details-${appointment.id}`}
              >
                <img 
                  src={isExpanded ? chevronUp : chevronDown} 
                  alt={isExpanded ? "Collapse details" : "Expand details"} 
                  className="w-6 h-6"
                />
              </button>
            </div>
          </>
        )}

        {isExpanded && (
          <div 
            id={`details-${appointment.id}`}
            className="mt-4 animate-fadeIn"
          >
            <div className="bg-[#1D1D1D] p-4 rounded-xl space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-[#1DB954]" />
                <div className="space-y-3">
                  <p className="text-white">{appointment.entity.address}</p>
                  <button
                    onClick={handleViewMap}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#1ed760] transition-colors text-sm font-medium"
                  >
                    <Map className="w-4 h-4" />
                    <span>View Map</span>
                  </button>
                </div>
              </div>
              {appointment.entity.type === 'HOSPITAL' && (
                <div className="flex items-center gap-3 border-t border-[#282828] pt-4">
                  <Phone className="w-5 h-5 flex-shrink-0 text-[#1DB954]" />
                  <p className="text-white">+91-7995854986</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}