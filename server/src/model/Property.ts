import mongoose, { Schema } from 'mongoose';
import { IProperty, PropertyType } from './types';

const PropertySchema = new Schema<IProperty>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: Object.values(PropertyType),
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  area: {
    type: Number,
    required: true,
    min: 0
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});



//indexes 
PropertySchema.index({ type: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ location: 1 });
PropertySchema.index({ bedrooms: 1 });
PropertySchema.index({ bathrooms: 1 });
PropertySchema.index({ area: 1 });
PropertySchema.index({ createdAt: -1 });
PropertySchema.index({ title: 'text', description: 'text' });




PropertySchema.index({ 
  type: 1, 
  price: 1, 
  location: 1,
  bedrooms: 1 
});


export const Property = mongoose.model<IProperty>('Property', PropertySchema);
