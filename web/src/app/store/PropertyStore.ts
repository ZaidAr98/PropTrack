import { create } from "zustand";
import axios from "axios";
import { AddPropertyRequest, Property } from "../../types/Property";

type ExtendedPropertyInput = AddPropertyRequest & {
  images?: File[];
};

interface PropertyState {
  properties: Property[];
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
  addProperty: (property: ExtendedPropertyInput) => Promise<void>;
  clearMessages: () => void;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const usePropertyStore = create<PropertyState>()((set) => ({
  properties: [],
  isSubmitting: false,
  error: null,
  success: null,

  addProperty: async (propertyData: ExtendedPropertyInput) => {
    set({ isSubmitting: true, error: null, success: null });

    try {
      const formData = new FormData();

      // Add images
      if (propertyData.images) {
        propertyData.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      // Add other fields
      Object.entries(propertyData).forEach(([key, value]) => {
        if (key !== "images" && value != null) {
          formData.append(key, String(value));
        }
      });

      const response = await api.post("/admin/properties", formData);

      set((state) => ({
        properties: [...state.properties, response.data.property || response.data],
        isSubmitting: false,
        success: "Property added successfully!",
      }));
    } catch (error: any) {
      set({
        isSubmitting: false,
        error: error.response?.data?.message || error.message || "Failed to add property",
      });
      throw error;
    }
  },

  clearMessages: () => set({ error: null, success: null }),
}));

export default usePropertyStore;