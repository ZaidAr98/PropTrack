import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Inquiry } from '../model/Inquiry.js';

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('MongoDB connected');
};

const seedInquiries = async () => {
  // Your actual property IDs
  const propertyIds = [
    "686a7e2bb1b71b218a2cf391", "686a7e2bb1b71b218a2cf392", "686a7e2bb1b71b218a2cf393",
    "686a7e2bb1b71b218a2cf394", "686a7e2bb1b71b218a2cf395", "686a7e2bb1b71b218a2cf396",
    "686a7e2bb1b71b218a2cf397", "686a7e2bb1b71b218a2cf398", "686a7e2bb1b71b218a2cf399",
    "686a7e2bb1b71b218a2cf39a", "686a7e2bb1b71b218a2cf39b", "686a7e2bb1b71b218a2cf39c"
  ];

  // Your actual client IDs
  const clientIds = [
    "686a056bbed0346ae7a66c90", "686a056bbed0346ae7a66c91", "686a056bbed0346ae7a66c92",
    "686a056bbed0346ae7a66c93", "686a056bbed0346ae7a66c94", "686a056bbed0346ae7a66c95",
    "686a056bbed0346ae7a66c96", "686a056bbed0346ae7a66c97", "686a056bbed0346ae7a66c98"
  ];

  const messages = [
    "I'm interested in viewing this property. When is the earliest available time?",
    "Could you provide more details about the neighborhood and nearby amenities?",
    "I'm ready to make an offer. What's the next step in the process?",
    "Is this property still available? I'd like to schedule a viewing this week.",
    "What are the monthly maintenance fees and what do they cover?",
    "I'm relocating for work. Can you help with the entire moving process?",
    "Are pets allowed in this property? I have a small dog.",
    "What's included in the rent/sale price? Are appliances staying?",
    "I need financing options. Do you work with preferred lenders?",
    "Can you send me more photos of the kitchen and bathrooms?",
    "What's the parking situation like for this property?",
    "I'm a first-time buyer. Can you guide me through the process?",
    "Is there a possibility for a virtual tour? I'm currently out of town.",
    "What's the timeline for closing if I decide to move forward?",
    "Are there any upcoming repairs or renovations planned for the building?"
  ];

  const inquiriesData = [];

  // Generate 25 random inquiries
  for (let i = 0; i < 25; i++) {
    inquiriesData.push({
      propertyId: propertyIds[Math.floor(Math.random() * propertyIds.length)],
      clientId: clientIds[Math.floor(Math.random() * clientIds.length)],
      message: messages[Math.floor(Math.random() * messages.length)]
    });
  }

  await Inquiry.deleteMany({});
  const inquiries = await Inquiry.insertMany(inquiriesData);
  console.log(`Seeded ${inquiries.length} inquiries`);
};

const runSeeder = async () => {
  try {
    await connectDB();
    await seedInquiries();
    console.log('Seeding completed');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

runSeeder();