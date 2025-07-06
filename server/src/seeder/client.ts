import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Client } from '../model/Client';

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

const seedClients = async () => {
  const clientsData = [
    { name: "John Smith", email: "john.smith@gmail.com", phone: "+1 (555) 123-4567" },
    { name: "Sarah Johnson", email: "sarah.johnson@yahoo.com", phone: "+1 (555) 234-5678" },
    { name: "Michael Brown", email: "michael.brown@outlook.com", phone: "+1 (555) 345-6789" },
    { name: "Emily Davis", email: "emily.davis@gmail.com", phone: "+1 (555) 456-7890" },
    { name: "David Wilson", email: "david.wilson@hotmail.com", phone: "+1 (555) 567-8901" },
    { name: "Jessica Miller", email: "jessica.miller@gmail.com", phone: "+1 (555) 678-9012" },
    { name: "Robert Garcia", email: "robert.garcia@yahoo.com", phone: "+1 (555) 789-0123" },
    { name: "Ashley Martinez", email: "ashley.martinez@outlook.com", phone: "+1 (555) 890-1234" },
    { name: "Christopher Lee", email: "christopher.lee@gmail.com", phone: "+1 (555) 901-2345" },
    { name: "Amanda Taylor", email: "amanda.taylor@hotmail.com", phone: "+1 (555) 012-3456" },
    { name: "Matthew Anderson", email: "matthew.anderson@gmail.com", phone: "+1 (555) 123-7890" },
    { name: "Jennifer White", email: "jennifer.white@yahoo.com", phone: "+1 (555) 234-8901" },
    { name: "Daniel Thompson", email: "daniel.thompson@outlook.com", phone: "+1 (555) 345-9012" },
    { name: "Lisa Rodriguez", email: "lisa.rodriguez@gmail.com", phone: "+1 (555) 456-0123" },
    { name: "James Clark", email: "james.clark@hotmail.com", phone: "+1 (555) 567-1234" },
    { name: "Maria Gonzalez", email: "maria.gonzalez@gmail.com", phone: "+1 (555) 678-2345" },
    { name: "Ryan Harris", email: "ryan.harris@yahoo.com", phone: "+1 (555) 789-3456" },
    { name: "Nicole Lewis", email: "nicole.lewis@outlook.com", phone: "+1 (555) 890-4567" },
    { name: "Kevin Walker", email: "kevin.walker@gmail.com", phone: "+1 (555) 901-5678" },
    { name: "Rachel Hall", email: "rachel.hall@hotmail.com", phone: "+1 (555) 012-6789" }
  ];

  await Client.deleteMany({});
  const clients = await Client.insertMany(clientsData);
  console.log(`Seeded ${clients.length} clients`);
};

const runSeeder = async () => {
  try {
    await connectDB();
    await seedClients();
    console.log('Client seeding completed');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

runSeeder();