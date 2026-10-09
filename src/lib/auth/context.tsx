'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithCredentials: (emailOrPhone: string, password?: string) => Promise<boolean>;
  loginWithOtp: (phone: string, otp: string) => Promise<boolean>;
  loginDemo: (role: Role) => void;
  register: (name: string, email: string, phone: string, role?: Role) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const DEMO_USERS: Record<Role, User> = {
  PATIENT: {
    id: 'user-patient-1',
    name: 'Kazi Farhan Ahmed',
    email: 'patient@nidaan.bd',
    phone: '01711223344',
    role: 'PATIENT',
    language: 'bn',
    theme: 'light',
    createdAt: '2026-08-01T00:00:00Z',
  },
  PHARMACIST: {
    id: 'user-pharmacist-1',
    name: 'Dr. Tanvir Hasan (Pharm.D)',
    email: 'pharmacist@nidaan.bd',
    phone: '01811223344',
    role: 'PHARMACIST',
    language: 'en',
    theme: 'light',
    createdAt: '2026-07-15T00:00:00Z',
  },
  ADMIN: {
    id: 'user-admin-1',
    name: 'Admin System Lead',
    email: 'admin@nidaan.bd',
    phone: '01911223344',
    role: 'ADMIN',
    language: 'en',
    theme: 'dark',
    createdAt: '2026-06-01T00:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session
    const savedUser = localStorage.getItem('nidaan_current_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    } else {
      // Default to Demo Patient for instant seamless testing
      setUser(DEMO_USERS.PATIENT);
      localStorage.setItem('nidaan_current_user', JSON.stringify(DEMO_USERS.PATIENT));
    }
    setIsLoading(false);
  }, []);

  const loginWithCredentials = async (emailOrPhone: string, _password?: string): Promise<boolean> => {
    setIsLoading(true);
    // Match against demo users or create patient session
    let target = Object.values(DEMO_USERS).find(
      (u) => u.email === emailOrPhone || u.phone === emailOrPhone
    );

    if (!target) {
      target = {
        id: `user-${Date.now()}`,
        name: emailOrPhone.split('@')[0] || 'Nidaan User',
        email: emailOrPhone.includes('@') ? emailOrPhone : undefined,
        phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined,
        role: 'PATIENT',
        language: 'bn',
        theme: 'light',
        createdAt: new Date().toISOString(),
      };
    }

    setUser(target);
    localStorage.setItem('nidaan_current_user', JSON.stringify(target));
    setIsLoading(false);
    return true;
  };

  const loginWithOtp = async (phone: string, _otp: string): Promise<boolean> => {
    return loginWithCredentials(phone);
  };

  const loginDemo = (role: Role) => {
    const demoUser = DEMO_USERS[role] || DEMO_USERS.PATIENT;
    setUser(demoUser);
    localStorage.setItem('nidaan_current_user', JSON.stringify(demoUser));
  };

  const register = async (name: string, email: string, phone: string, role: Role = 'PATIENT'): Promise<boolean> => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role,
      language: 'bn',
      theme: 'light',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('nidaan_current_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nidaan_current_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('nidaan_current_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginWithCredentials,
        loginWithOtp,
        loginDemo,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
