"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthToken } from "@/types";

interface UserContextValue {
  user: AuthToken | null;
  setUser: (user: AuthToken | null) => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
});

export function UserProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: AuthToken | null;
}) {
  const [user, setUser] = useState<AuthToken | null>(initialUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
