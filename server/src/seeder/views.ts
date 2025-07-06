
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Viewing } from '../model/Viewing';

dotenv.config();

const seedViewings = async () => {
  await mongoose.connect(process.env.MONGODB_URL);

  const propertyIds = [
    "686a7e2bb1b71b218a2cf391", "686a7e2bb1b71b218a2cf392", "686a7e2bb1b71b218a2cf393",
    "686a7e2bb1b71b218a2cf394", "686a7e2bb1b71b218a2cf395", "686a7e2bb1b71b218a2cf396"
  ];

  const clientIds = [
    "686a056bbed0346ae7a66c90", "686a056bbed0346ae7a66c91", "686a056bbed0346ae7a66c92",
    "686a056bbed0346ae7a66c93", "686a056bbed0346ae7a66c94", "686a056bbed0346ae7a66c95"
  ];

  const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
  const statuses = ["scheduled", "completed", "no_show", "cancelled"];
  const notes = [
    "Client interested in kitchen",
    "Family viewing",
    "First-time buyer",
    "Investment inquiry", 
    "Loves the location",
    "Ready to make offer"
  ];

  const viewingsData = [];
  for (let i = 0; i < 20; i++) {
    const randomDays = Math.floor(Math.random() * 30);
    const viewDate = new Date();
    viewDate.setDate(viewDate.getDate() + randomDays);

    viewingsData.push({
      propertyId: propertyIds[Math.floor(Math.random() * propertyIds.length)],
      clientId: clientIds[Math.floor(Math.random() * clientIds.length)],
      date: viewDate,
      time: times[Math.floor(Math.random() * times.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      notes: notes[Math.floor(Math.random() * notes.length)]
    });
  }

  await Viewing.deleteMany({});
  const views = await Viewing.insertMany(viewingsData);
  console.log(`Seeded ${views.length} viewings`);
  
  await mongoose.disconnect();
  process.exit(0);
};

seedViewings().catch(console.error);