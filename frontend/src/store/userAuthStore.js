// This is where we can store global states
import {create} from "zustand";
import { axiosInstance } from "../lib/axios";

// set is a function that allows us to update the state
// the stuff in the brackets is the inital state
export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({authUser:res.data})
    } catch (error) {
      console.error("Error checking auth:", error);
      set({authUser:null})
    } finally {
      set({isCheckingAuth:false})
    }
  },
  signup: async (data) => {
  }
}));