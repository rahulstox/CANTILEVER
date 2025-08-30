// app/context/AuthContext.tsx
"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

// Define the shape of the user object we get from the token
interface User {
  userId: string;
  name: string;
}

// Define the shape of our context
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

// Create the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // This effect runs when the component loads to check for a token in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      const decodedUser: User = jwtDecode(storedToken);
      setUser(decodedUser);
      setToken(storedToken);
    }
  }, []);

  // The login function
  const login = (newToken: string) => {
    const decodedUser: User = jwtDecode(newToken);
    localStorage.setItem("authToken", newToken); // Persist token
    setUser(decodedUser);
    setToken(newToken);
  };

  // The logout function
  const logout = () => {
    localStorage.removeItem("authToken"); // Remove token
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
