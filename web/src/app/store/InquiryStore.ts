import { create } from "zustand";
import axios from "axios";

export interface InquiryResponse {
  _id: string;
  clientId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  propertyId: {
    _id: string;
    title: string;
    location: string;
    price: number;
    type: string;
  };
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitInquiryRequest {
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  message: string;
}

interface InquiryState {
  // Data
  inquiries: InquiryResponse[];
  
  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  
  // Messages
  error: string | null;
  success: string | null;
  
  // Admin Functions
  getClientInquiries: () => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  
  // Public Functions
  submitInquiry: (inquiry: SubmitInquiryRequest) => Promise<void>;
  
  // Utilities
  clearMessages: () => void;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const useInquiryStore = create<InquiryState>()((set, get) => ({
  inquiries: [],
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: null,
  success: null,

  getClientInquiries: async () => {
    set({ isLoading: true, error: null });

    try {
      // Fixed: Corrected endpoint to match your backend route
      const response = await api.get("/admin/inquiries");
      
      set({
        inquiries: response.data.inquiries || response.data,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Failed to fetch inquiries:", error);
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch inquiries",
      });
    }
  },

  // Delete inquiry (Admin only)
  deleteInquiry: async (id: string) => {
    set({ isDeleting: true, error: null, success: null });

    try {
      // Fixed: Corrected endpoint to match your backend route
      await api.delete(`/admin/inquiries/${id}`);
      
      set((state) => ({
        inquiries: state.inquiries.filter(inquiry => inquiry._id !== id),
        isDeleting: false,
        success: "Inquiry deleted successfully!",
      }));
    } catch (error: any) {
      console.error("Failed to delete inquiry:", error);
      set({
        isDeleting: false,
        error: error.response?.data?.error || "Failed to delete inquiry",
      });
      throw error;
    }
  },

  submitInquiry: async (inquiryData: SubmitInquiryRequest) => {
    set({ isSubmitting: true, error: null, success: null });

    try {
      const response = await api.post("/client/inquiries", inquiryData);

      set({
        isSubmitting: false,
        success: "Thank you! Your inquiry has been submitted successfully. We'll contact you soon.",
      });

      return response.data;
    } catch (error: any) {
      console.error("Failed to submit inquiry:", error);
      set({
        isSubmitting: false,
        error: error.response?.data?.error || "Failed to submit inquiry. Please try again.",
      });
      throw error;
    }
  },

  clearMessages: () => set({ error: null, success: null }),
}));

export default useInquiryStore;