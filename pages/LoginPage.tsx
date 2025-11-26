import React from 'react';
import { AuthPage } from '../components/AuthPage';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="absolute inset-0 z-40 bg-[#fcfaf8]">
      <AuthPage onLogin={onLogin} />
    </div>
  );
};
