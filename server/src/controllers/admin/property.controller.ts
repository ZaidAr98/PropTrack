import { Property } from "../../model";
import { Response, Request } from "express";
import { File } from "multer";
import { cloudinaryImageUploadMethod } from "../../util/cloudinary/cloudinaryUpload";
import { cloudinaryDeleteImages } from "../../util/cloudinary/deleteImages";
import { Inquiry } from "../../model/Inquiry";

interface MulterRequest extends Request {
  files?: File[];
}


//AddProperty
export const addProperty = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { 
      title, 
      description, 
      price, 
      type, 
      location, 
      bedrooms, 
      bathrooms, 
      area, 
      amenities 
    } = req.body;
    
    const imageUrls = [];

  
    if (!title || !description || !price || !type || !location || 
        bedrooms === undefined || bathrooms === undefined || area === undefined) {
      res.status(400).json({ error: "All required fields must be provided" });
      return;
    }

   
    if (req.files && req.files.length > 0) {
      const imageFiles = req.files as File[];
      
      for (const file of imageFiles) {
        const imageUrl = await cloudinaryImageUploadMethod(file.buffer);
        imageUrls.push(imageUrl);
      }
    }

 
    const newProperty = {
      title,
      description,
      price: Number(price), 
      type,
      location,
      bedrooms: Number(bedrooms), 
      bathrooms: Number(bathrooms),
      area: Number(area),
      amenities: amenities ? (Array.isArray(amenities) ? amenities : [amenities]) : [], // Handle array or string
      images: imageUrls 
    };

    
    const savedProperty = await Property.create(newProperty);

    
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error("Error adding property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const editProperty = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      price, 
      type, 
      location, 
      bedrooms, 
      bathrooms, 
      area, 
      amenities,
      existingImages 
    } = req.body;

 
    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    
    if (!title || !description || !price || !type || !location || 
        bedrooms === undefined || bathrooms === undefined || area === undefined) {
      res.status(400).json({ error: "All required fields must be provided" });
      return;
    }

    let updatedImages: string[] = [];

    
    if (existingImages && Array.isArray(existingImages)) {
      updatedImages = [...existingImages];
    }

    
    if (req.files && req.files.length > 0) {
      const imageFiles = req.files as File[];
      
      for (const file of imageFiles) {
        const imageUrl = await cloudinaryImageUploadMethod(file.buffer) as string;
        updatedImages.push(imageUrl);
      }
    }

 
    const imagesToDelete = existingProperty.images.filter(
      (image: string) => !updatedImages.includes(image)
    );


    if (imagesToDelete.length > 0) {
      try {
        await cloudinaryDeleteImages(imagesToDelete);
      } catch (deleteError) {
        console.error("Error deleting images from Cloudinary:", deleteError);
        
      }
    }

  
    const updateData = {
      title,
      description,
      price: Number(price),
      type,
      location,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      amenities: amenities ? (Array.isArray(amenities) ? amenities : [amenities]) : [], // Handle array or string
      images: updatedImages
    };

  
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error("Error editing property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Archive property
export const archiveProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

  
    const archivedProperty = await Property.findByIdAndUpdate(
      id,
      { archived: true },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Property archived successfully",
      property: archivedProperty
    });
  } catch (error) {
    console.error("Error archiving property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE: Permanently remove property
export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    
    await Property.findByIdAndDelete(id);

    res.status(200).json({
      message: "Property deleted permanently"
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




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
      search
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

   
    const properties = await Property.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

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
        search
      },
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalProperties: total,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error("Error filtering properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





export const getClientInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    
    const inquiries = await Inquiry.find({})
      .populate('clientId', 'name email phone')
      .populate('propertyId', 'title location price type')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Inquiry.countDocuments({});

    res.status(200).json({
      inquiries,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalInquiries: total,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error("Error fetching client inquiries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};