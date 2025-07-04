import { Document, Types } from 'mongoose';

export enum PropertyType {
  SALE = 'sale',
  RENT = 'rent'
}



export enum ViewingStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show'
}



export interface IProperty extends Document {
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


export interface IClient extends Document {
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface IViewing extends Document {
  propertyId: Types.ObjectId;
  clientId: Types.ObjectId;
  date: Date;
  time: string;
  status: ViewingStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
