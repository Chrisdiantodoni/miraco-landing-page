"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "@/i18n/navigation";
import { Member } from "@/lib/types/member";
import { login as loginApi, me as meApi } from "@/lib/api/queries/member";
import { useCartStore } from "@/lib/store/cart";

const TOKEN_KEY = "miraco_token";
const MEMBER_KEY = "miraco_member";

interface AuthState {
  member: Member | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!member;

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    meApi()
      .then((res) => {
      if (res?.data) {
        setToken(storedToken);
        setMember(res.data);
        useCartStore.getState().setFavourites(
          res.data.favourite_ids || [],
        );
        localStorage.setItem(MEMBER_KEY, JSON.stringify(res.data));
        } else {
          clearStoredAuth();
        }
      })
      .catch(() => {
        clearStoredAuth();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const clearStoredAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(MEMBER_KEY);
    setToken(null);
    setMember(null);
  };

  const login = useCallback(
    async (login: string, password: string) => {
      const res = await loginApi({ login, password });

      if (!res?.data?.access_token || !res?.data?.member) {
        throw new Error(res?.message || "Login failed");
      }

      const { access_token, member: memberData } = res.data;

      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem(MEMBER_KEY, JSON.stringify(memberData));
      setToken(access_token);
      setMember(memberData);
      useCartStore.getState().setFavourites(
        memberData.favourite_ids || [],
      );

      router.push("/dashboard");
    },
    [router],
  );

  const logout = useCallback(() => {
    clearStoredAuth();
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ member, token, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
