import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';


export const useAuthStore = create((set) => ({
    authUser: null,
    isLoggingIn: false, 
    isSigningUp:false,
    isUpatingProfile: false,
    isCheckingAuth: true,

    checkAuth : async()=>{
        try {
            const res = await axiosInstance.get('/users/check');
            set({authUser:res.data.user,isCheckingAuth:false});
        } catch (error) {
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    }
}));