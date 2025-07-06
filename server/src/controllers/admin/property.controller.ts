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
    
    console.log("Add property request:", {
      hasFiles: req.files?.length || 0,
      amenities: amenities,
      amenitiesType: typeof amenities
    });
    
    const imageUrls = [];

    // Validate required fields
    if (!title || !description || !price || !type || !location || 
        bedrooms === undefined || bathrooms === undefined || area === undefined) {
      res.status(400).json({ error: "All required fields must be provided" });
      return;
    }

    // Upload images if any
    if (req.files && req.files.length > 0) {
      const imageFiles = req.files as File[];
      
      for (const file of imageFiles) {
        try {
          const imageUrl = await cloudinaryImageUploadMethod(file.buffer);
          imageUrls.push(imageUrl);
          console.log("Uploaded image:", imageUrl);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          // Continue with other images, don't fail completely
        }
      }
    }

    // Parse amenities properly - handle comma-separated string from frontend
    let parsedAmenities: string[] = [];
    if (amenities) {
      try {
        if (typeof amenities === 'string') {
          // Check if it's a JSON string first
          try {
            const parsed = JSON.parse(amenities);
            if (Array.isArray(parsed)) {
              parsedAmenities = parsed;
            } else {
              // If not JSON, split by comma and clean up
              parsedAmenities = amenities
                .split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0);
            }
          } catch {
            // If not JSON, treat as comma-separated string
            parsedAmenities = amenities
              .split(',')
              .map(item => item.trim())
              .filter(item => item.length > 0);
          }
        } else if (Array.isArray(amenities)) {
          parsedAmenities = amenities;
        }
      } catch (error) {
        console.error("Error parsing amenities:", error);
        parsedAmenities = [];
      }
    }

    console.log("Parsed amenities:", parsedAmenities);

    // Prepare new property data
    const newProperty = {
      title,
      description,
      price: Number(price), 
      type,
      location,
      bedrooms: Number(bedrooms), 
      bathrooms: Number(bathrooms),
      area: Number(area),
      amenities: parsedAmenities,
      images: imageUrls 
    };

    console.log("Creating property with data:", {
      ...newProperty,
      images: `${newProperty.images.length} images`
    });
    
    const savedProperty = await Property.create(newProperty);

    console.log("Property created successfully:", savedProperty._id);
    
    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property: savedProperty
    });
  } catch (error) {
    console.error("Error adding property:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

    console.log("Edit property request:", {
      id,
      hasNewFiles: req.files?.length || 0,
      existingImages: existingImages,
      existingImagesType: typeof existingImages
    });

    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    // Validate required fields
    if (!title || !description || !price || !type || !location ||
        bedrooms === undefined || bathrooms === undefined || area === undefined) {
      res.status(400).json({ error: "All required fields must be provided" });
      return;
    }

    let updatedImages: string[] = [];

    // Parse existing images - handle both string and array cases
    if (existingImages) {
      try {
        if (typeof existingImages === 'string') {
          // If it's a JSON string, parse it
          const parsed = JSON.parse(existingImages);
          if (Array.isArray(parsed)) {
            updatedImages = [...parsed];
          }
        } else if (Array.isArray(existingImages)) {
          // If it's already an array, use it directly
          updatedImages = [...existingImages];
        }
      } catch (parseError) {
        console.error("Error parsing existingImages:", parseError);
        // If parsing fails, treat as empty array
        updatedImages = [];
      }
    }

    console.log("Processed existing images:", updatedImages);

    // Upload new images if any
    if (req.files && req.files.length > 0) {
      console.log("Processing new image files:", req.files.length);
      const imageFiles = req.files as File[]; // Changed this line to match addProperty
      
      for (const file of imageFiles) {
        try {
          const imageUrl = await cloudinaryImageUploadMethod(file.buffer) as string;
          updatedImages.push(imageUrl);
          console.log("Uploaded new image:", imageUrl);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          // Continue with other images, don't fail completely
        }
      }
    }

    console.log("Final images array:", updatedImages);

    // Find images to delete (existed before but not in updated list)
    const imagesToDelete = existingProperty.images.filter(
      (image: string) => !updatedImages.includes(image)
    );

    console.log("Images to delete:", imagesToDelete);

    // Delete removed images from Cloudinary
    if (imagesToDelete.length > 0) {
      try {
        await cloudinaryDeleteImages(imagesToDelete);
        console.log("Successfully deleted images from Cloudinary");
      } catch (deleteError) {
        console.error("Error deleting images from Cloudinary:", deleteError);
        // Don't fail the update if image deletion fails
      }
    }

    // Parse amenities properly
    let parsedAmenities: string[] = [];
    if (amenities) {
      try {
        if (typeof amenities === 'string') {
          // Try to parse as JSON first
          try {
            const parsed = JSON.parse(amenities);
            parsedAmenities = Array.isArray(parsed) ? parsed : [amenities];
          } catch {
            // If not JSON, treat as single amenity
            parsedAmenities = [amenities];
          }
        } else if (Array.isArray(amenities)) {
          parsedAmenities = amenities;
        }
      } catch (error) {
        console.error("Error parsing amenities:", error);
        parsedAmenities = [];
      }
    }

    // Prepare update data
    const updateData = {
      title,
      description,
      price: Number(price),
      type,
      location,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      amenities: parsedAmenities,
      images: updatedImages
    };

    console.log("Updating property with data:", {
      ...updateData,
      images: `${updateData.images.length} images`
    });

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      res.status(404).json({ error: "Property not found after update" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty
    });

  } catch (error) {
    console.error("Error editing property:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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