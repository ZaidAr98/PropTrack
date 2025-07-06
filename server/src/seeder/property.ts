import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Property } from '../model/Property'; // Adjust import path as needed
import { PropertyType } from '../model/types'; // Adjust import path as needed

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) {
      throw new Error('MONGODB_URL environment variable is not defined');
    }
    
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export const seedProperties = async (): Promise<void> => {
  try {
    console.log('Starting property seeding...');

    const propertiesData = [
      
      {
    title: "Luxury Burj Khalifa View Apartment",
    description: "Spectacular 3-bedroom apartment with direct views of Burj Khalifa and Dubai Fountain. Premium finishes, marble floors, and access to world-class amenities including infinity pool and spa.",
    price: 2800000,
    type: PropertyType.SALE,
    location: "Downtown Dubai, Dubai",
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    amenities: ["Burj Khalifa View", "Infinity Pool", "Spa", "Valet Parking", "Concierge"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
    ]
  },
  {
    title: "Palm Jumeirah Villa with Private Beach",
    description: "Exquisite 5-bedroom villa on the prestigious Palm Jumeirah with private beach access, swimming pool, and panoramic views of the Arabian Gulf. Fully furnished with designer interiors.",
    price: 45000,
    type: PropertyType.RENT,
    location: "Palm Jumeirah, Dubai",
    bedrooms: 5,
    bathrooms: 6,
    area: 6500,
    amenities: ["Private Beach", "Swimming Pool", "Maid's Room", "Driver's Room", "Garden"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ]
  },
  {
    title: "Marina Walk Penthouse",
    description: "Stunning penthouse in Dubai Marina with 360-degree views of the marina and sea. Features a private rooftop terrace, jacuzzi, and premium Italian kitchen with Miele appliances.",
    price: 3500000,
    type: PropertyType.SALE,
    location: "Dubai Marina, Dubai",
    bedrooms: 4,
    bathrooms: 5,
    area: 4200,
    amenities: ["Rooftop Terrace", "Jacuzzi", "Marina View", "Italian Kitchen", "24/7 Security"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800"
    ]
  },
  {
    title: "Modern Studio in Business Bay",
    description: "Contemporary studio apartment in the heart of Business Bay with canal views. Fully furnished with modern appliances, gym access, and walking distance to Dubai Mall.",
    price: 8500,
    type: PropertyType.RENT,
    location: "Business Bay, Dubai",
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    amenities: ["Canal View", "Fully Furnished", "Gym", "Swimming Pool", "Metro Access"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
    ]
  },
  {
    title: "Emirates Hills Mansion",
    description: "Magnificent 7-bedroom mansion in the exclusive Emirates Hills community. Features private golf course access, swimming pool, landscaped gardens, and panoramic city views.",
    price: 12500000,
    type: PropertyType.SALE,
    location: "Emirates Hills, Dubai",
    bedrooms: 7,
    bathrooms: 8,
    area: 12000,
    amenities: ["Golf Course Access", "Swimming Pool", "Landscaped Gardens", "Staff Quarters", "6-Car Garage"],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
    ]
  },
  {
    title: "Saadiyat Island Beachfront Apartment",
    description: "Elegant 2-bedroom apartment on Saadiyat Island with direct beach access and views of the Louvre Abu Dhabi. Premium amenities and world-class cultural attractions nearby.",
    price: 15000,
    type: PropertyType.RENT,
    location: "Saadiyat Island, Abu Dhabi",
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    amenities: ["Beach Access", "Cultural District", "Swimming Pool", "Gym", "Concierge"],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800"
    ]
  },
  {
    title: "Jumeirah Beach Residence Tower",
    description: "High-floor 2-bedroom apartment in JBR with stunning sea views and direct beach access. Part of a vibrant community with restaurants, shops, and entertainment at your doorstep.",
    price: 2200000,
    type: PropertyType.SALE,
    location: "Jumeirah Beach Residence, Dubai",
    bedrooms: 2,
    bathrooms: 2,
    area: 1600,
    amenities: ["Sea View", "Beach Access", "Restaurants", "Shopping", "Metro Link"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
    ]
  },
  {
    title: "Al Reem Island Modern Townhouse",
    description: "Contemporary 3-bedroom townhouse in Al Reem Island with private garden, rooftop terrace, and stunning views of the Abu Dhabi skyline. Family-friendly community with parks and schools.",
    price: 22000,
    type: PropertyType.RENT,
    location: "Al Reem Island, Abu Dhabi",
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    amenities: ["Private Garden", "Rooftop Terrace", "Skyline View", "Community Pool", "Kids Play Area"],
    images: [
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",
      "https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
    ]
  },
  {
    title: "City Walk Luxury Penthouse",
    description: "Ultra-modern penthouse in the heart of City Walk with private elevator access, rooftop pool, and unobstructed views of Burj Khalifa. Walking distance to premium shopping and dining.",
    price: 8500000,
    type: PropertyType.SALE,
    location: "City Walk, Dubai",
    bedrooms: 4,
    bathrooms: 5,
    area: 5200,
    amenities: ["Private Elevator", "Rooftop Pool", "Burj Khalifa View", "Shopping District", "Valet Service"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ]
  },
  {
    title: "The Views Golf Course Villa",
    description: "Spectacular 4-bedroom villa overlooking the Emirates Golf Club with direct golf course access. Features a private swimming pool, landscaped garden, and premium finishes throughout.",
    price: 35000,
    type: PropertyType.RENT,
    location: "The Views, Dubai",
    bedrooms: 4,
    bathrooms: 4,
    area: 4800,
    amenities: ["Golf Course View", "Private Pool", "Landscaped Garden", "Golf Club Access", "24/7 Security"],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
    ]
  }
    ];

    console.log(`Inserting ${propertiesData.length} properties...`);

    // Clear existing properties (optional - comment out if you want to keep existing data)
    await Property.deleteMany({});
    console.log('Cleared existing properties');

    // Insert properties
    const insertedProperties = await Property.insertMany(propertiesData);
    
    console.log(`Successfully seeded ${insertedProperties.length} properties!`);
    console.log('Property seeding completed!');

    // Log summary
    const saleCount = insertedProperties.filter(p => p.type === PropertyType.SALE).length;
    const rentCount = insertedProperties.filter(p => p.type === PropertyType.RENT).length;
    
    console.log(` Summary:`);
    console.log(`For Sale: ${saleCount} properties`);
    console.log(`For Rent: ${rentCount} properties`);
    
    return;

  } catch (error: any) {
    console.error(' Error during seeding:', error.message);
    throw error;
  }
};

// Main execution function
const runSeeder = async (): Promise<void> => {
  try {
    await connectDB();
    await seedProperties();
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error(' Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
    process.exit(0);
  }
};

// Auto-run when file is executed directly
runSeeder().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});