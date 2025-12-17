// src/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../screens/ProfileScreen/profile';
import { AuthHelper } from '../helpers/AuthHelper';

interface UserContextType {
  user: UserProfile | null;
  setUser: (u: UserProfile) => void;
  getUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => { },
  getUser: async () => { },
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    getUser()
  }, []);

  const getUser = async () => {
    const profile = await AuthHelper.getUserProfile();
    if (profile) setUser(profile);
  };

  return (
    <UserContext.Provider value={{ user, setUser, getUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
