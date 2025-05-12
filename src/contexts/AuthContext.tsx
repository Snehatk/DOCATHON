
import React, { createContext, useState, useContext, useEffect } from "react";

type UserRole = "doctor" | "staff" | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (id: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("healthcareUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (id: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // This is a mock implementation
      // In a real app, this would call an API
      console.log(`Logging in with ID: ${id}, role: ${role}`);
      
      // Mock validation - in real app would be done by backend
      if (id && password && role) {
        // Create a mock user based on the role
        const mockUser = {
          id,
          name: role === "doctor" ? `Dr. ${id.substring(0, 5)}` : `Staff ${id.substring(0, 5)}`,
          role,
        };
        
        // Store user in localStorage
        localStorage.setItem("healthcareUser", JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("healthcareUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
