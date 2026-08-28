import { listenToAuthState } from "@/firebase/auth";
import { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AUTH PROVIDER MOUNTED");

    const unsubscribe = listenToAuthState((user) => {
      console.log("FIREBASE AUTH CALLBACK:", user);
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log("AUTH PROVIDER UNMOUNTED");
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
