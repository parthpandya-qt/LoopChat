import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isLoggingIn: false,
    isSigningUp: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/users/check');
            set({ authUser: res.data.data, isCheckingAuth: false });
        } catch (error) {
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/users/signup", data);
            set({ authUser: res.data.data });
            toast.success("Account created successfully");

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/users/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("error occured during logging out")
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/users/login", data)
            set({ authUser: res.data.data })
            toast.success("Logged in successfully");

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false })
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("/users/update-profile", data)
            set({ authUser: res.data.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            set({ isUpdatingProfile: false })
        }
    }
}));