import React from 'react';
import { X, ExternalLink, Clock, TrendingUp, Users, Target } from 'lucide-react';
import { CampaignURL } from '../types/analytics';

interface CampaignURLModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: string;
  urls: CampaignURL[];
  onUrlClick: (url: string) => void;
}

export const CampaignURLModal: React.FC<CampaignURLModalProps> = ({
  isOpen,
  onClose,
  campaign,
  urls,
  onUrlClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Campaign URLs</h2>
            <p className="text-sm text-gray-600 mt-1">Performance breakdown for {campaign}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid gap-4">
            {urls.map((urlData) => (
              <div
                key={urlData.url}
                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                onClick={() => onUrlClick(urlData.url)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        {urlData.url}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    urlData.conversionRate > 15 ? 'bg-green-100 text-green-800' :
                    urlData.conversionRate > 10 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {urlData.conversionRate.toFixed(1)}% conversion
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {urlData.sessions.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Sessions</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {urlData.conversions.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Conversions</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {urlData.avgSessionTime.toFixed(1)}m
                      </div>
                      <div className="text-xs text-gray-500">Avg Time</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {urlData.bounceRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">Bounce Rate</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-700"
                      style={{ width: `${Math.min(urlData.conversionRate, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};