import { authService } from "@/services/api/auth.service";
import { IRootState, useAppDispacth } from "@/store";
import { setAuth } from "@/store/slices/authSlice";
import { LoginCredentials } from "@/types/auth.types";
import { refresh } from "next/cache";
import { useState } from "react";
import { useSelector } from "react-redux";

export function useAuth() {
  const authState = useSelector((state: IRootState) => state.auth); //get the state from the store
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispacth();

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const respose = await authService.login(credentials);
      dispatch(
        setAuth({
          accessToken: respose.accessToken,
          refreshToken: respose.refreshToken,
          user: respose.user,
        }),
      );
      return true;
    } catch (error) {
      setError("Login failed. Please try again" + error);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      authService.logout();
    } catch (error) {
      console.error("logout failed", error);
    }
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}