import { PropertyType } from "../model";

interface AddPropertyRequest {
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
}
