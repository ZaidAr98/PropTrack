import { create } from "zustand";
import axios from "axios";
import { AddPropertyRequest, PropertyResponse } from "../../types/Property";

// Updated type to include existingImages
type ExtendedPropertyInput = AddPropertyRequest & {
  images?: File[];
  existingImages?: string[]; // Add this line
};

interface PropertyFilters {
  searchTerm?: string;
  propertyType?: string;
  location?: string;
  bedrooms?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface PropertyState {
  // Data
  properties: PropertyResponse[];
  filteredProperties: PropertyResponse[];
  property: PropertyResponse | null; // Single property for detail view
  totalCount: number;
  
  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;
  isSearching: boolean;
  
  // Messages
  error: string | null;
  success: string | null;
  
  // Search & Filter
  filters: PropertyFilters;
  pagination: PaginationInfo | null;
  
  // Actions
  addProperty: (property: ExtendedPropertyInput) => Promise<void>;
  getProperties: (page?: number, limit?: number) => Promise<void>;
  getPropertyById: (id: string) => Promise<void>;
  searchProperties: (filters: PropertyFilters, page?: number, limit?: number) => Promise<void>;
  searchPropertiesWithPagination: (page: number, limit: number) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  updateProperty: (id: string, propertyData: ExtendedPropertyInput) => Promise<void>;
  setFilters: (newFilters: Partial<PropertyFilters>) => void;
  clearFilters: () => void;
  clearMessages: () => void;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const usePropertyStore = create<PropertyState>()((set, get) => ({
  // Initial state
  properties: [],
  filteredProperties: [],
  property: null,
  totalCount: 0,
  isLoading: false,
  isSubmitting: false,
  isSearching: false,
  error: null,
  success: null,
  filters: {},
  pagination: null,

  // Add property (existing functionality)
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

  // Get all properties (with pagination)
  getProperties: async (page = 1, limit = 12) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/admin/properties", {
        params: { page, limit }
      });

      const { properties = [], pagination } = response.data;

      set({
        properties,
        totalCount: pagination?.totalCount || properties.length,
        pagination: pagination || {
          currentPage: page,
          totalPages: Math.ceil(properties.length / limit),
          totalCount: properties.length,
          limit,
          hasPreviousPage: page > 1,
          hasNextPage: false,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || "Failed to fetch properties",
      });
    }
  },

  // Get single property by ID
  getPropertyById: async (id: string) => {
    set({ isLoading: true, error: null, property: null });

    try {
      const response = await api.get(`/admin/properties/${id}`);
      
      set({
        property: response.data.property || response.data,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || "Failed to fetch property details",
        property: null,
      });
    }
  },

  // Search properties with filters
  searchProperties: async (filters: PropertyFilters, page = 1, limit = 12) => {
    set({ isSearching: true, error: null });

    try {
      // Build query parameters
      const params: any = { page, limit };
      
      if (filters.searchTerm) params.search = filters.searchTerm;
      if (filters.propertyType) params.type = filters.propertyType;
      if (filters.location) params.location = filters.location;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sort) params.sort = filters.sort;

      const response = await api.get("/admin/properties/search", { params });

      const { properties = [], pagination } = response.data;

      set({
        filteredProperties: properties,
        totalCount: pagination?.totalCount || properties.length,
        pagination: pagination || {
          currentPage: page,
          totalPages: Math.ceil(properties.length / limit),
          totalCount: properties.length,
          limit,
          hasPreviousPage: page > 1,
          hasNextPage: false,
        },
        isSearching: false,
      });
    } catch (error: any) {
      set({
        isSearching: false,
        error: error.response?.data?.message || error.message || "Search failed",
      });
    }
  },

  // Search with pagination (keeps current filters)
  searchPropertiesWithPagination: async (page: number, limit: number) => {
    const { filters, searchProperties } = get();
    await searchProperties(filters, page, limit);
  },

  // Delete property
  deleteProperty: async (id: string) => {
    set({ isSubmitting: true, error: null, success: null });

    try {
      await api.delete(`/admin/properties/${id}`);
      
      set((state) => ({
        properties: state.properties.filter(p => p._id !== id),
        filteredProperties: state.filteredProperties.filter(p => p._id !== id),
        property: state.property?._id === id ? null : state.property,
        isSubmitting: false,
        success: "Property deleted successfully!",
      }));
    } catch (error: any) {
      set({
        isSubmitting: false,
        error: error.response?.data?.message || error.message || "Failed to delete property",
      });
      throw error;
    }
  },

  // Update property
  updateProperty: async (id: string, propertyData: ExtendedPropertyInput) => {
    set({ isSubmitting: true, error: null, success: null });

    try {
      const formData = new FormData();

      // Add existing images as a JSON string
      if (propertyData.existingImages && propertyData.existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(propertyData.existingImages));
      } else {
        formData.append("existingImages", JSON.stringify([]));
      }

      // Add new image files
      if (propertyData.images && propertyData.images.length > 0) {
        propertyData.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      // Add other property fields
      Object.entries(propertyData).forEach(([key, value]) => {
        if (key !== "images" && key !== "existingImages" && value != null) {
          // Handle arrays properly
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      console.log("FormData contents:", {
        hasNewImages: propertyData.images?.length || 0,
        existingImagesCount: propertyData.existingImages?.length || 0,
        existingImages: propertyData.existingImages
      });

      const response = await api.put(`/admin/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const updatedProperty = response.data.property || response.data;

      set((state) => ({
        properties: state.properties.map(p => p._id === id ? updatedProperty : p),
        filteredProperties: state.filteredProperties.map(p => p._id === id ? updatedProperty : p),
        property: state.property?._id === id ? updatedProperty : state.property,
        isSubmitting: false,
        success: "Property updated successfully!",
      }));
    } catch (error: any) {
      console.error("Update property error:", error);
      set({
        isSubmitting: false,
        error: error.response?.data?.message || error.message || "Failed to update property",
      });
      throw error;
    }
  },

  // Set filters and merge with existing ones
  setFilters: (newFilters: Partial<PropertyFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  // Clear all filters
  clearFilters: () => {
    set({ 
      filters: {},
      filteredProperties: [],
      totalCount: 0,
      pagination: null 
    });
  },

  // Clear messages
  clearMessages: () => set({ error: null, success: null }),
}));

export default usePropertyStore;