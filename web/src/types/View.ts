// types/Viewing.ts

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