import { create } from "zustand";
import axios from "axios";

export interface IClient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ClientFilters {
  search?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface ClientStats {
  totalClients: number;
  recentClients: number;
  thisMonthClients: number;
}

interface ClientState {
  // Data
  clients: IClient[];
  client: IClient | null;
  stats: ClientStats | null;
  
  // Loading states
  isLoading: boolean;
  isSearching: boolean;
  isDeleting: boolean;
  
  // Messages
  error: string | null;
  success: string | null;
  
  // Search & Filter
  filters: ClientFilters;
  pagination: PaginationInfo | null;
  
  // Actions
  getClients: (page?: number, limit?: number) => Promise<void>;
  getClientById: (id: string) => Promise<void>;
  searchClients: (search: string, page?: number, limit?: number) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClientStats: () => Promise<void>;
  setFilters: (filters: Partial<ClientFilters>) => void;
  clearFilters: () => void;
  clearMessages: () => void;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const useClientStore = create<ClientState>()((set, get) => ({
  // Initial state
  clients: [],
  client: null,
  stats: null,
  isLoading: false,
  isSearching: false,
  isDeleting: false,
  error: null,
  success: null,
  filters: {},
  pagination: null,

  // Get all clients
  getClients: async (page = 1, limit = 12) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/admin/clients", {
        params: { page, limit }
      });

      const { clients = [], pagination } = response.data;

      set({
        clients,
        pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || "Failed to fetch clients",
      });
    }
  },

  // Get single client by ID
  getClientById: async (id: string) => {
    set({ isLoading: true, error: null, client: null });

    try {
      const response = await api.get(`/admin/clients/${id}`);
      
      set({
        client: response.data.client,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || "Failed to fetch client details",
        client: null,
      });
    }
  },

  // Search clients
  searchClients: async (search: string, page = 1, limit = 12) => {
    set({ isSearching: true, error: null });

    try {
      const response = await api.get("/admin/clients", {
        params: { search, page, limit }
      });

      const { clients = [], pagination } = response.data;

      set({
        clients,
        pagination,
        isSearching: false,
      });
    } catch (error: any) {
      set({
        isSearching: false,
        error: error.response?.data?.message || error.message || "Search failed",
      });
    }
  },

  // Delete client
  deleteClient: async (id: string) => {
    set({ isDeleting: true, error: null, success: null });

    try {
      await api.delete(`/admin/clients/${id}`);
      
      set((state) => ({
        clients: state.clients.filter(c => c._id !== id),
        client: state.client?._id === id ? null : state.client,
        isDeleting: false,
        success: "Client deleted successfully!",
      }));
    } catch (error: any) {
      set({
        isDeleting: false,
        error: error.response?.data?.message || error.message || "Failed to delete client",
      });
      throw error;
    }
  },

  // Get client statistics
  getClientStats: async () => {
    try {
      const response = await api.get("/admin/clients/stats");
      
      set({
        stats: response.data.stats,
      });
    } catch (error: any) {
      console.error("Failed to fetch client stats:", error);
    }
  },

  // Set filters
  setFilters: (newFilters: Partial<ClientFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  // Clear all filters
  clearFilters: () => {
    set({ filters: {} });
  },

  // Clear messages
  clearMessages: () => set({ error: null, success: null }),
}));

export default useClientStore;