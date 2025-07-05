export interface AddPropertyRequest {
  title: string;
  description: string;
  price: string | number; 
  type: string;
  location: string;
  bedrooms: string | number; 
  bathrooms: string | number; 
  area: string | number; 
  amenities?: string | string[]; 
}