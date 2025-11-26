import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../components/UserProfile';
import { UserProfile as UserProfileType, Transaction, DownloadRecord, Template } from '../types';

interface ProfilePageProps {
  user: UserProfileType;
  transactions: Transaction[];
  downloadRecords: DownloadRecord[];
  favoriteTemplates: Template[];
  onLogout: () => void;
  onUpdateProfile: (updated: Partial<UserProfileType>) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  transactions,
  downloadRecords,
  favoriteTemplates,
  onLogout,
  onUpdateProfile
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleTemplateClick = (template: Template) => {
    navigate(`/template/${template.id}`);
  };

  return (
    <UserProfile
      user={user}
      transactions={transactions}
      downloadRecords={downloadRecords}
      favoriteTemplates={favoriteTemplates}
      onLogout={handleLogout}
      onUpdateProfile={onUpdateProfile}
      onTemplateClick={handleTemplateClick}
      onHome={() => navigate('/')}
    />
  );
};
