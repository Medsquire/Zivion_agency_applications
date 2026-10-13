import React, { createContext, useContext, useState } from 'react';

const STORAGE_KEY = 'bee_agency_admin_profile';

export const DEFAULT_ADMIN_PROFILE = {
  fullName: 'John Doe',
  email: 'john.doe@agency.com',
  phone: '+91 98765 43210',
  role: 'Agency Admin',
  subtitle: 'Administrator',
  agencyName: 'BEE Property Management',
  photoUrl: '',
};

const UserContext = createContext({
  user: DEFAULT_ADMIN_PROFILE,
  updateUser: async () => {},
  uploadPhoto: async () => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.fullName === 'Agency Administrator') {
          return { ...DEFAULT_ADMIN_PROFILE, photoUrl: parsed.photoUrl || '' };
        }
        return { ...DEFAULT_ADMIN_PROFILE, ...parsed };
      }
    } catch (err) {
      console.warn('Could not read user profile from storage', err);
    }
    return DEFAULT_ADMIN_PROFILE;
  });

  const updateUser = async (updates) => {
    // Simulate API delay for profile update
    await new Promise((resolve) => setTimeout(resolve, 400));
    setUser((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.warn('Could not persist user profile to localStorage', err);
      }
      return next;
    });
    return { success: true };
  };

  const uploadPhoto = async (photoUrl) => {
    return await updateUser({ photoUrl });
  };

  return (
    <UserContext.Provider value={{ user, updateUser, uploadPhoto }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export default UserContext;
