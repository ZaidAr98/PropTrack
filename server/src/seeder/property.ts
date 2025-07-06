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
        title: "Modern Downtown Apartment",
        description: "Luxurious 2-bedroom apartment in the heart of downtown with stunning city views, premium finishes, and access to building amenities including gym and rooftop terrace.",
        price: 450000,
        type: PropertyType.SALE,
        location: "Downtown, NYC",
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        amenities: ["Gym", "Rooftop Terrace", "Concierge", "Parking"],
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
          "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",
          "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800"
        ]
      },
      {
        title: "Charming Victorian House",
        description: "Beautiful restored Victorian home featuring original hardwood floors, ornate moldings, and modern updates. Perfect blend of historic charm and contemporary comfort.",
        price: 3500,
        type: PropertyType.RENT,
        location: "Brooklyn Heights, NYC",
        bedrooms: 4,
        bathrooms: 3,
        area: 2400,
        amenities: ["Garden", "Fireplace", "Original Features", "Updated Kitchen"],
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
          "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800",
          "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800"
        ]
      },
      {
        title: "Luxury Penthouse Condo",
        description: "Spectacular penthouse with panoramic city views, private elevator access, and premium finishes throughout. Features floor-to-ceiling windows and wraparound terrace.",
        price: 1200000,
        type: PropertyType.SALE,
        location: "Upper East Side, NYC",
        bedrooms: 3,
        bathrooms: 3,
        area: 2800,
        amenities: ["Private Elevator", "Terrace", "City Views", "Premium Finishes"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
        ]
      },
      {
        title: "Cozy Studio Apartment",
        description: "Efficiently designed studio in trendy neighborhood with modern appliances, exposed brick walls, and large windows providing abundant natural light.",
        price: 2200,
        type: PropertyType.RENT,
        location: "Greenwich Village, NYC",
        bedrooms: 1,
        bathrooms: 1,
        area: 650,
        amenities: ["Exposed Brick", "Modern Appliances", "Natural Light"],
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
        ]
      },
      {
        title: "Spacious Townhouse",
        description: "Three-story townhouse with private garage, backyard, and modern renovations. Perfect for families seeking space and privacy in the city.",
        price: 950000,
        type: PropertyType.SALE,
        location: "Park Slope, Brooklyn",
        bedrooms: 4,
        bathrooms: 3,
        area: 3200,
        amenities: ["Private Garage", "Backyard", "Modern Kitchen", "Multiple Floors"],
        images: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
          "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
        ]
      },
      {
        title: "Contemporary Waterfront Villa",
        description: "Stunning waterfront property with private dock, infinity pool, and breathtaking ocean views. Designer interiors and smart home technology throughout.",
        price: 8500,
        type: PropertyType.RENT,
        location: "The Hamptons, NY",
        bedrooms: 5,
        bathrooms: 4,
        area: 4500,
        amenities: ["Private Dock", "Infinity Pool", "Ocean Views", "Smart Home"],
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
        ]
      },
      {
        title: "Industrial Loft Conversion",
        description: "Converted warehouse loft with soaring ceilings, exposed beams, and an open-concept design. Perfect for artists or those who love unique spaces.",
        price: 680000,
        type: PropertyType.SALE,
        location: "SOHO, NYC",
        bedrooms: 2,
        bathrooms: 2,
        area: 1800,
        amenities: ["High Ceilings", "Exposed Beams", "Open Concept", "Artist Friendly"],
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
          "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800"
        ]
      },
      {
        title: "Garden Level Apartment",
        description: "Bright garden-level apartment with private patio, updated kitchen, and in-unit laundry. Quiet residential street with easy transportation access.",
        price: 2800,
        type: PropertyType.RENT,
        location: "Astoria, Queens",
        bedrooms: 2,
        bathrooms: 1,
        area: 950,
        amenities: ["Private Patio", "In-Unit Laundry", "Updated Kitchen", "Garden Access"],
        images: [
          "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",
          "https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800",
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ]
      },
      {
        title: "Historic Brownstone",
        description: "Beautifully preserved brownstone with original details, updated systems, and prime location. Features parlor floor living and private garden.",
        price: 1850000,
        type: PropertyType.SALE,
        location: "Upper West Side, NYC",
        bedrooms: 5,
        bathrooms: 4,
        area: 3800,
        amenities: ["Historic Details", "Private Garden", "Parlor Floor", "Updated Systems"],
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
          "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800",
          "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800"
        ]
      },
      {
        title: "Modern High-Rise Condo",
        description: "Sleek modern condo with floor-to-ceiling windows, stainless steel appliances, and building amenities including pool, gym, and 24-hour doorman.",
        price: 4200,
        type: PropertyType.RENT,
        location: "Long Island City, Queens",
        bedrooms: 2,
        bathrooms: 2,
        area: 1400,
        amenities: ["Pool", "Gym", "24-Hour Doorman", "Modern Finishes"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
          "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
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