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


export enum PropertyType {
  SALE = "sale",
  RENT = "rent",
}


export interface Property{
    title: string;
  description: string;
  price: number;
  type: PropertyType;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}