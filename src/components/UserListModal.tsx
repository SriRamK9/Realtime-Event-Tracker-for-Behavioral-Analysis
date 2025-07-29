import React, { useState } from 'react';
import { X, User, Clock, MapPin, Smartphone, ExternalLink } from 'lucide-react';
import { UserSession } from '../types/analytics';

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignUrl: string;
  users: UserSession[];
  onUserClick: (sessionId: string) => void;
}

export const UserListModal: React.FC<UserListModalProps> = ({
  isOpen,
  onClose,
  campaignUrl,
  users,
  onUserClick,
}) => {
  const [sortBy, setSortBy] = useState<'time' | 'conversion'>('time');

  if (!isOpen) return null;

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'time') {
      return (b.timeline.updated_at - b.timeline.landing) - (a.timeline.updated_at - a.timeline.landing);
    } else {
      const aConverted = a.timeline.payment_succesfull ? 1 : 0;
      const bConverted = b.timeline.payment_succesfull ? 1 : 0;
      return bConverted - aConverted;
    }
  });

  const getConversionStatus = (user: UserSession) => {
    if (user.timeline.payment_succesfull) return { status: 'Converted', color: 'bg-green-100 text-green-800' };
    if (user.timeline.application_paythrough_bank_payment_started) return { status: 'Payment Started', color: 'bg-yellow-100 text-yellow-800' };
    if (user.timeline.user_application_under_review) return { status: 'Under Review', color: 'bg-blue-100 text-blue-800' };
    if (user.timeline.form_filled_without_login) return { status: 'Form Filled', color: 'bg-purple-100 text-purple-800' };
    if (user.timeline.form_start) return { status: 'Form Started', color: 'bg-orange-100 text-orange-800' };
    return { status: 'Landed Only', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">User Sessions</h2>
            <p className="text-sm text-gray-600 mt-1 break-all">{campaignUrl}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'time' | 'conversion')}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="time">Session Duration</option>
                <option value="conversion">Conversion Status</option>
              </select>
            </div>
            <span className="text-sm text-gray-500">{users.length} users</span>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid gap-3">
              {sortedUsers.map((user) => {
                const conversionStatus = getConversionStatus(user);
                const sessionDuration = (user.timeline.updated_at - user.timeline.landing) / 1000 / 60; // minutes
                
                return (
                  <div
                    key={user.session_id}
                    className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                    onClick={() => onUserClick(user.session_id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{user.session_id}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(user.timeline.landing).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${conversionStatus.color}`}>
                        {conversionStatus.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{user.device_type}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{user.city}, {user.country}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{sessionDuration.toFixed(1)}m</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{user.utmid || 'Direct'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};