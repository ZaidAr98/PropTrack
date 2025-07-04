import mongoose, { Schema } from 'mongoose';
import { IViewing, ViewingStatus } from './types';

const ViewingSchema = new Schema<IViewing>({
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ViewingStatus),
    default: ViewingStatus.SCHEDULED
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
ViewingSchema.index({ propertyId: 1, date: 1 });
ViewingSchema.index({ clientId: 1, date: 1 });
ViewingSchema.index({ status: 1 });
ViewingSchema.index({ date: 1 });

export const Viewing = mongoose.model<IViewing>('Viewing', ViewingSchema);