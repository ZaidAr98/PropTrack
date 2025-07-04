import mongoose, { Schema } from 'mongoose';
import { IClient } from './types';




const ClientSchema = new Schema<IClient>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
ClientSchema.index({ email: 1 });
ClientSchema.index({ createdAt: -1 });

export const Client = mongoose.model<IClient>('Client', ClientSchema);