import { store } from "@/store";
import axios from "axios";
import { authService } from "./auth.service";
import { clearAuth, setAccessToken } from "@/store/slices/authSlice";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers:{
        "Content-Type": "application/json",
    },
    timeout: 10000,
})

// attach access token to the request headers  
apiClient.interceptors.request.use(
(config) => {
        const state= store.getState(); //get the redux state using the store
        const token = state.auth.accessToken;

        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) =>{
        return Promise.reject(error);
    }
);

// renew expired refresh tokens
apiClient.interceptors.request.use(
    (response)=>response,
    async(error)=>{
        const originalRequest = error.config;
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            const state= store.getState();
            const refreshtoken = state.auth.refreshToken;

            //refresh access token using AuthService
            if(refreshtoken){
                const newAccessToken = await authService.refreshToken(refreshtoken);
                if (newAccessToken){
                    store.dispatch(setAccessToken(newAccessToken));
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return apiClient(originalRequest)
                }
            }
            // clear tokens and logout the user
            store.dispatch(clearAuth());
            // if refresh fails redirect the user the login page
            if(typeof window !== 'undefined'){
                window.location.href ='/auth/login';
            }
        }
        return Promise.reject(error);
    }
)