// store/ViewingStore.ts
import { create } from "zustand";
import axios from "axios";

export interface ViewingResponse {
  _id: string;
  propertyId: {
    _id: string;
    title: string;
    location: string;
    price: number;
    type: string;
  };
  clientId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddViewingRequest {
  propertyId: string;
  clientId: string;
  date: string;
  time: string;
  notes?: string;
}

interface ViewingState {
  // Data
  viewings: ViewingResponse[];
  
  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;
  
  // Messages
  error: string | null;
  success: string | null;
  
  // Actions
  scheduleViewing: (viewing: AddViewingRequest) => Promise<void>;
  getViewings: () => Promise<void>;
  markAsCompleted: (id: string, notes?: string) => Promise<void>;
  cancelViewing: (id: string, notes?: string) => Promise<void>;
  markAsNoShow: (id: string, notes?: string) => Promise<void>;
  updateNotes: (id: string, notes: string) => Promise<void>;
  clearMessages: () => void;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const useViewingStore = create<ViewingState>()((set, get) => ({
  // Initial state
  viewings: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  success: null,

  // Schedule new viewing
  scheduleViewing: async (viewingData: AddViewingRequest) => {
    set({ isSubmitting: true, error: null, success: null });

    try {
      const response = await api.post("/admin/viewings", viewingData);
      
      set((state) => ({
        viewings: [response.data.viewing, ...state.viewings],
        isSubmitting: false,
        success: "Viewing scheduled successfully!",
      }));
    } catch (error: any) {
      set({
        isSubmitting: false,
        error: error.response?.data?.error || "Failed to schedule viewing",
      });
      throw error;
    }
  },

  // Get all viewings
  getViewings: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/admin/viewings");
      
      set({
        viewings: response.data.viewings || response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch viewings",
      });
    }
  },

  // Mark viewing as completed
  markAsCompleted: async (id: string, notes?: string) => {
    set({ isSubmitting: true, error: null, success: null });

    try {
      const response = await api.put(`/admin/viewings/${id}/complete`, { notes });
      const updatedViewing = response.data.viewing;

      set((state) => ({
        viewings: state.viewings.map(v => v._id === id ? updatedViewing : v),
        isSubmitting: false,
        success: "Viewing marked as completed!",
      }));
    } catch (error: any) {
      set({
        isSubmitting: false,
        error: error.response?.data?.error || "Failed to complete viewing",
      });
      throw error;
    }
  },

  // Cancel viewing
  cancelViewing: async (id: string, notes?: string) => {
    set({ isSubmitting: true, error: null, success: null });

    try {
      const response = await api.put(`/admin/viewings/${id}/cancel`, { notes });
      const updatedViewing = response.data.viewing;

      set((state) => ({
        viewings: state.viewings.map(v => v._id === id ? updatedViewing : v),
        isSubmitting: false,
        success: "Viewing cancelled!",
      }));
    } catch (error: any) {
      set({
        isSubmitting: false,
        error: error.response?.data?.error || "Failed to cancel viewing",
      });
      throw error;
    }
  },

  // Mark as no show
  markAsNoShow: async (id: string, notes?: string) => {
    set({ isSubmitting: true, error: null, success: null });

    try {
      const response = await api.put(`/admin/viewings/${id}/no-show`, { notes });
      const updatedViewing = response.data.viewing;

      set((state) => ({
        viewings: state.viewings.map(v => v._id === id ? updatedViewing : v),
        isSubmitting: false,
        success: "Viewing marked as no-show!",
      }));
    } catch (error: any) {
      set({
        isSubmitting: false,
        error: error.response?.data?.error || "Failed to mark as no-show",
      });
      throw error;
    }
  },

  // Update notes
  updateNotes: async (id: string, notes: string) => {
    set({ isSubmitting: true, error: null, success: null });

    try {
      const response = await api.put(`/admin/viewings/${id}/notes`, { notes });
      const updatedViewing = response.data.viewing;

      set((state) => ({
        viewings: state.viewings.map(v => v._id === id ? updatedViewing : v),
        isSubmitting: false,
        success: "Notes updated successfully!",
      }));
    } catch (error: any) {
      set({
        isSubmitting: false,
        error: error.response?.data?.error || "Failed to update notes",
      });
      throw error;
    }
  },

  // Clear messages
  clearMessages: () => set({ error: null, success: null }),
}));

export default useViewingStore;