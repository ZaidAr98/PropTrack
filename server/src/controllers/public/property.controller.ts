import { Response, Request } from "express";
import { Property } from "../../model";



export const getProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10 
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const properties = await Property.find({})
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments({});

    res.status(200).json({
      properties,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalProperties: total,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





export const getPropertyDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find property by ID
    const property = await Property.findById(id);

    if (!property) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("Error fetching property details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};







export const filterProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      minPrice,
      maxPrice,
      location,
      type,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      amenities,
      search,
      sort // Add sort parameter
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (type) {
      query.type = type;
    }

    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }

    if (bathrooms) {
      query.bathrooms = Number(bathrooms);
    }

    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = Number(minArea);
      if (maxArea) query.area.$lte = Number(maxArea);
    }

    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
      query.amenities = { $in: amenitiesArray };
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    // Handle sorting
    let sortOption: any = { createdAt: -1 }; // Default sort by newest

    if (sort) {
      switch (sort) {
        case 'priceLowHigh':
          sortOption = { price: 1 };
          break;
        case 'priceHighLow':
          sortOption = { price: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'oldest':
          sortOption = { createdAt: 1 };
          break;
        case 'areaLowHigh':
          sortOption = { area: 1 };
          break;
        case 'areaHighLow':
          sortOption = { area: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    const properties = await Property.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort(sortOption); // Apply the sort option

    const total = await Property.countDocuments(query);

    res.status(200).json({
      properties,
      filters: {
        minPrice,
        maxPrice,
        location,
        type,
        bedrooms,
        bathrooms,
        minArea,
        maxArea,
        amenities,
        search,
        sort 
      },
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalCount: total, 
        limit: limitNum,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
        hasPreviousPage: pageNum > 1 
      }
    });
  } catch (error) {
    console.error("Error filtering properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
