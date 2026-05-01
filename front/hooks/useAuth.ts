import { authService } from "@/services/api/auth.service";
import { IRootState } from "@/store";
import { useState } from "react";
import { useSelector } from "react-redux";

export function useAuth(){
    const authState= useSelector((state: IRootState)=>state.auth); //get the state from the store
    const [isLoading, setIsLoading]=useState(false);
    const [error, setError] =useState<string | null>(null);

    const logout = async ()=>{
        setIsLoading(true);
        setError(null);
        try{
            authService.logout();
        }catch(error) {
            console.error('logout failed', error);
        }
    }

    return {
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading,
        error,
        logout,
        }
}