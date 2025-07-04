import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IInquiry extends Document {
  clientId: Types.ObjectId;
  propertyId: Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}



const InquirySchema = new Schema<IInquiry>({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Indexes
InquirySchema.index({ clientId: 1 });
InquirySchema.index({ propertyId: 1 });
InquirySchema.index({ createdAt: -1 });

export const Inquiry = mongoose.model<IInquiry>('Inquiry', InquirySchema);

