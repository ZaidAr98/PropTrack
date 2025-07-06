import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Inquiry } from '../model/Inquiry.js';

dotenv.config();

const connectDB = async () => {
  const mongoUrl = process.env.MONGODB_URL;
  if (!mongoUrl) {
    throw new Error('MONGODB_URL environment variable is not defined');
  }
  await mongoose.connect(mongoUrl);
  console.log('MongoDB connected');
};

const seedInquiries = async () => {
  const inquiriesData = [
    {
      propertyId: "686969b7978d5966cc418ebf",
      clientId: "686a056bbed0346ae7a66c90",
      inquiryType: "viewing_request",
      subject: "Interested in penthouse viewing",
      message: "Hi, I'm very interested in viewing this penthouse property. I'm particularly interested in the views and amenities. Could we schedule a viewing for this week?",
      priority: "high",
      status: "resolved",
      dateCreated: new Date("2025-07-07"),
      dateResolved: new Date("2025-07-07"),
      assignedAgent: "John Smith",
      contactMethod: "email",
      followUpRequired: false
    },
    {
      propertyId: "686969b7978d5966cc418ec0",
      clientId: "686a056bbed0346ae7a66c91",
      inquiryType: "general_info",
      subject: "First time buyer - need guidance",
      message: "I'm a first-time buyer and would like more information about this property. What's included in the price? Are there any additional fees I should be aware of?",
      priority: "medium",
      status: "resolved",
      dateCreated: new Date("2025-07-08"),
      dateResolved: new Date("2025-07-08"),
      assignedAgent: "Sarah Johnson",
      contactMethod: "phone",
      followUpRequired: true
    },
    {
      propertyId: "686969b7978d5966cc418ec1",
      clientId: "686a056bbed0346ae7a66c92",
      inquiryType: "offer_submission",
      subject: "Ready to make an offer",
      message: "After viewing the property, my family and I are very interested. We'd like to discuss making an offer. What's the process and timeline?",
      priority: "urgent",
      status: "in_progress",
      dateCreated: new Date("2025-07-07"),
      assignedAgent: "Michael Brown",
      contactMethod: "email",
      followUpRequired: true
    },
    {
      propertyId: "686969b7978d5966cc418ec2",
      clientId: "686a056bbed0346ae7a66c93",
      inquiryType: "viewing_request",
      subject: "VIP viewing request",
      message: "I'm looking for a luxury property in this area. I understand this is a premium listing. Could you arrange a private viewing with full amenities tour?",
      priority: "high",
      status: "resolved",
      dateCreated: new Date("2025-07-09"),
      dateResolved: new Date("2025-07-09"),
      assignedAgent: "Emma Davis",
      contactMethod: "phone",
      followUpRequired: false
    },
    {
      propertyId: "686969b7978d5966cc418ec3",
      clientId: "686a056bbed0346ae7a66c94",
      inquiryType: "viewing_request",
      subject: "Viewing appointment request",
      message: "I'd like to schedule a viewing for this property. I'm available this weekend. Please let me know what times work best.",
      priority: "medium",
      status: "closed",
      dateCreated: new Date("2025-07-05"),
      dateResolved: new Date("2025-07-06"),
      assignedAgent: "Robert Wilson",
      contactMethod: "email",
      followUpRequired: false,
      notes: "Client was a no-show for scheduled viewing"
    },
    {
      propertyId: "686969b7978d5966cc418ec4",
      clientId: "686a056bbed0346ae7a66c95",
      inquiryType: "general_info",
      subject: "Garden and outdoor space inquiry",
      message: "I'm very interested in this property, particularly the garden access mentioned in the listing. Could you provide more details about the outdoor spaces and maintenance requirements?",
      priority: "medium",
      status: "resolved",
      dateCreated: new Date("2025-07-10"),
      dateResolved: new Date("2025-07-10"),
      assignedAgent: "Lisa Anderson",
      contactMethod: "email",
      followUpRequired: false
    },
    {
      propertyId: "686969b7978d5966cc418ec5",
      clientId: "686a056bbed0346ae7a66c96",
      inquiryType: "price_negotiation",
      subject: "Price and payment options",
      message: "I'm interested in this property but need to discuss pricing options. Are there any flexible payment plans or room for negotiation on the asking price?",
      priority: "medium",
      status: "closed",
      dateCreated: new Date("2025-07-04"),
      dateResolved: new Date("2025-07-05"),
      assignedAgent: "David Taylor",
      contactMethod: "phone",
      followUpRequired: false,
      notes: "Client cancelled due to budget constraints"
    },
    {
      propertyId: "686969b7978d5966cc418ec6",
      clientId: "686a056bbed0346ae7a66c97",
      inquiryType: "relocation_assistance",
      subject: "Out-of-state relocation inquiry",
      message: "I'm relocating from another state and need assistance with the entire process. Can you help coordinate the viewing and provide information about the local area?",
      priority: "high",
      status: "in_progress",
      dateCreated: new Date("2025-07-11"),
      assignedAgent: "Jennifer Martinez",
      contactMethod: "email",
      followUpRequired: true
    },
    {
      propertyId: "686969b7978d5966cc418ebf",
      clientId: "686a056bbed0346ae7a66c98",
      inquiryType: "investment_inquiry",
      subject: "Investment property analysis",
      message: "I'm considering this property as an investment opportunity. Could you provide rental yield information and market analysis for this area?",
      priority: "medium",
      status: "resolved",
      dateCreated: new Date("2025-07-12"),
      dateResolved: new Date("2025-07-12"),
      assignedAgent: "Christopher Lee",
      contactMethod: "email",
      followUpRequired: true
    },
    {
      propertyId: "686969b7978d5966cc418ec0",
      clientId: "686a056bbed0346ae7a66c99",
      inquiryType: "application_process",
      subject: "Ready to submit application",
      message: "After viewing the property, I'm ready to move forward with the application process. What documents do I need to prepare and what are the next steps?",
      priority: "urgent",
      status: "resolved",
      dateCreated: new Date("2025-07-04"),
      dateResolved: new Date("2025-07-04"),
      assignedAgent: "Amanda White",
      contactMethod: "phone",
      followUpRequired: true
    },
    {
      propertyId: "686969b7978d5966cc418ec1",
      clientId: "686a056bbed0346ae7a66c90",
      inquiryType: "general_info",
      subject: "Neighborhood information request",
      message: "I'm interested in learning more about the neighborhood. Could you provide information about local schools, transportation, and amenities?",
      priority: "low",
      status: "pending",
      dateCreated: new Date("2025-07-06"),
      assignedAgent: "John Smith",
      contactMethod: "email",
      followUpRequired: true
    },
    {
      propertyId: "686969b7978d5966cc418ec2",
      clientId: "686a056bbed0346ae7a66c91",
      inquiryType: "technical_inquiry",
      subject: "Property condition and inspections",
      message: "Before proceeding, I'd like to know about recent inspections, property condition reports, and any maintenance issues I should be aware of.",
      priority: "medium",
      status: "in_progress",
      dateCreated: new Date("2025-07-08"),
      assignedAgent: "Sarah Johnson",
      contactMethod: "email",
      followUpRequired: true
    }
  ];

  await Inquiry.deleteMany({});
  const inquiries = await Inquiry.insertMany(inquiriesData);
  console.log(`Seeded ${inquiries.length} inquiries`);
};

const runSeeder = async () => {
  try {
    await connectDB();
    await seedInquiries();
    console.log('Inquiry seeding completed');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

runSeeder();