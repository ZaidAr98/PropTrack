import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Viewing } from '../model/Viewing';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  const mongoUrl = process.env.MONGODB_URL;
  if (!mongoUrl) {
    throw new Error('MONGODB_URL environment variable is not defined');
  }
  await mongoose.connect(mongoUrl);
  console.log('MongoDB connected');
};

const seedViewings = async () => {
  const viewingsData = [
    {
      propertyId: "686969b7978d5966cc418ebf",
      clientId: "686a056bbed0346ae7a66c90",
      date: new Date("2025-07-08"),
      time: "14:30",
      status: "scheduled",
      notes: "Client interested in penthouse views"
    },
    {
      propertyId: "686969b7978d5966cc418ec0",
      clientId: "686a056bbed0346ae7a66c91",
      date: new Date("2025-07-09"),
      time: "10:00",
      status: "scheduled",
      notes: "First-time buyer"
    },
    {
      propertyId: "686969b7978d5966cc418ec1",
      clientId: "686a056bbed0346ae7a66c92",
      date: new Date("2025-07-07"),
      time: "15:00",
      status: "completed",
      notes: "Family loved the space, making offer"
    },
    {
      propertyId: "686969b7978d5966cc418ec2",
      clientId: "686a056bbed0346ae7a66c93",
      date: new Date("2025-07-10"),
      time: "11:30",
      status: "scheduled",
      notes: "Luxury client, VIP treatment"
    },
    {
      propertyId: "686969b7978d5966cc418ec3",
      clientId: "686a056bbed0346ae7a66c94",
      date: new Date("2025-07-06"),
      time: "16:00",
      status: "no_show",
      notes: "No response to calls"
    },
    {
      propertyId: "686969b7978d5966cc418ec4",
      clientId: "686a056bbed0346ae7a66c95",
      date: new Date("2025-07-11"),
      time: "13:00",
      status: "scheduled",
      notes: "Interested in garden access"
    },
    {
      propertyId: "686969b7978d5966cc418ec5",
      clientId: "686a056bbed0346ae7a66c96",
      date: new Date("2025-07-05"),
      time: "12:00",
      status: "cancelled",
      notes: "Budget constraints"
    },
    {
      propertyId: "686969b7978d5966cc418ec6",
      clientId: "686a056bbed0346ae7a66c97",
      date: new Date("2025-07-12"),
      time: "09:30",
      status: "scheduled",
      notes: "Relocating from another state"
    },
    {
      propertyId: "686969b7978d5966cc418ebf",
      clientId: "686a056bbed0346ae7a66c98",
      date: new Date("2025-07-13"),
      time: "17:00",
      status: "scheduled",
      notes: "Investment buyer"
    },
    {
      propertyId: "686969b7978d5966cc418ec0",
      clientId: "686a056bbed0346ae7a66c99",
      date: new Date("2025-07-04"),
      time: "14:00",
      status: "completed",
      notes: "Ready to submit application"
    }
  ];

  await Viewing.deleteMany({});
  const viewings = await Viewing.insertMany(viewingsData);
  console.log(`Seeded ${viewings.length} viewings`);
};

const runSeeder = async () => {
  try {
    await connectDB();
    await seedViewings();
    console.log('Viewing seeding completed');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

runSeeder();