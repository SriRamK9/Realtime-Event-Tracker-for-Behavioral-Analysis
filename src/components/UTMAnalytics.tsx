import React, { useState } from 'react';
import { UTMMetrics, UTMUrl } from '../types/analytics';
import { CampaignURLModal } from './CampaignURLModal';
import { UserListModal } from './UserListModal';
import { UserBehaviorModal } from './UserBehaviorModal';
import { UserSession } from '../types/analytics';

interface UTMAnalyticsProps {
  utmMetrics: UTMMetrics[];
  utmUrls: UTMUrl[];
  getCampaignUrls: (campaign: string) => any[];
  getUserBehavior: (sessionId: string) => any;
  sessions: UserSession[];
}

export const UTMAnalytics: React.FC<UTMAnalyticsProps> = ({ 
  utmMetrics, 
  utmUrls,
  getCampaignUrls, 
  getUserBehavior,
  sessions
}) => {
  const sortedMetrics = [...utmMetrics].sort((a, b) => b.conversions - a.conversions);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [showUserBehaviorModal, setShowUserBehaviorModal] = useState(false);

  const handleCampaignClick = (campaign: string) => {
    setSelectedCampaign(campaign);
    setShowCampaignModal(true);
  };

  const handleUrlClick = (url: string) => {
    setSelectedUrl(url);
    setShowCampaignModal(false);
    setShowUserListModal(true);
  };

  const handleUserClick = (sessionId: string) => {
    setSelectedUser(sessionId);
    setShowUserListModal(false);
    setShowUserBehaviorModal(true);
  };

  const getUrlUsers = (url: string) => {
    // Find sessions that match the URL pattern
    return sessions.filter(session => {
      if (url === 'Direct Traffic') return !session.utmid;
      
      const utmInfo = utmUrls.find(utm => utm.utmid === session.utmid);
      if (!utmInfo) return false;
      
      const expectedUrl = `${utmInfo.utm_source}.com/${utmInfo.utm_campaign}-${utmInfo.utm_medium}`;
      return url === expectedUrl;
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Campaign Performance</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Campaign</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Sessions</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Conversions</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Rate</th>
            </tr>
          </thead>
          <tbody>
            {sortedMetrics.map((metric) => (
              <tr 
                key={metric.campaign} 
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => handleCampaignClick(metric.campaign)}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      metric.campaign === 'Direct' ? 'bg-gray-500' :
                      metric.campaign.includes('google') ? 'bg-red-500' :
                      metric.campaign.includes('facebook') ? 'bg-blue-600' :
                      metric.campaign.includes('instagram') ? 'bg-pink-500' :
                      metric.campaign.includes('linkedin') ? 'bg-blue-700' :
                      metric.campaign.includes('bing') ? 'bg-orange-500' :
                      metric.campaign.includes('email') ? 'bg-green-500' :
                      metric.campaign.includes('newsletter') ? 'bg-green-600' :
                      'bg-purple-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-800">
                      {metric.campaign}
                    </span>
                  </div>
                </td>
                <td className="text-right py-3 px-4 text-sm text-gray-600">
                  {metric.sessions.toLocaleString()}
                </td>
                <td className="text-right py-3 px-4 text-sm text-gray-600">
                  {metric.conversions.toLocaleString()}
                </td>
                <td className="text-right py-3 px-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    metric.conversionRate > 15 ? 'bg-green-100 text-green-800' :
                    metric.conversionRate > 10 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {metric.conversionRate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      <CampaignURLModal
        isOpen={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        campaign={selectedCampaign || ''}
        urls={selectedCampaign ? getCampaignUrls(selectedCampaign) : []}
        onUrlClick={handleUrlClick}
      />

      <UserListModal
        isOpen={showUserListModal}
        onClose={() => setShowUserListModal(false)}
        campaignUrl={selectedUrl || ''}
        users={selectedUrl ? getUrlUsers(selectedUrl) : []}
        onUserClick={handleUserClick}
      />

      <UserBehaviorModal
        isOpen={showUserBehaviorModal}
        onClose={() => setShowUserBehaviorModal(false)}
        userBehavior={selectedUser ? getUserBehavior(selectedUser) : null}
        campaignUrl={selectedUrl || ''}
      />
    </>
  );
};