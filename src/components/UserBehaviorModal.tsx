import React from 'react';
import { X, Clock, MapPin, Smartphone, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { UserBehavior } from '../types/analytics';

interface UserBehaviorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBehavior: UserBehavior | null;
  campaignUrl: string;
}

export const UserBehaviorModal: React.FC<UserBehaviorModalProps> = ({
  isOpen,
  onClose,
  userBehavior,
  campaignUrl,
}) => {
  if (!isOpen || !userBehavior) return null;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStageIcon = (stage: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">User Journey Details</h2>
            <p className="text-sm text-gray-600 mt-1">Session: {userBehavior.session.id}</p>
            <p className="text-sm text-gray-600 mt-1">Session: {userBehavior.session.session_id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* User Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Device</span>
              </div>
              <p className="text-blue-700">{userBehavior.deviceInfo.type}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Location</span>
              </div>
              <p className="text-green-700">{userBehavior.deviceInfo.location}</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-800">Total Time</span>
              </div>
              <p className="text-purple-700">{userBehavior.totalDuration.toFixed(1)} minutes</p>
            </div>
          </div>

          {/* Campaign URL */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Campaign URL</h3>
            <p className="text-sm text-blue-600 break-all">{campaignUrl}</p>
          </div>

          {/* Journey Timeline */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">User Journey Timeline</h3>
            <div className="space-y-4">
              {userBehavior.stageTimings.map((timing, index) => (
                <div key={timing.stage} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    {getStageIcon(timing.stage, true)}
                    {index < userBehavior.stageTimings.length - 1 && (
                      <div className="w-px h-8 bg-gray-300 mt-2" />
                    )}
                  </div>
                  
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-800">{timing.stage}</h4>
                      <span className="text-sm text-gray-500">
                        {formatTime(timing.timestamp)}
                      </span>
                    </div>
                    
                    {timing.duration && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Spent {timing.duration.toFixed(1)} minutes at this stage</span>
                        {index < userBehavior.stageTimings.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    )}
                    
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000"
                        style={{ width: `${((index + 1) / userBehavior.stageTimings.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completion Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">Journey Completion</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      userBehavior.completionRate === 100 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${userBehavior.completionRate}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {userBehavior.completionRate.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};