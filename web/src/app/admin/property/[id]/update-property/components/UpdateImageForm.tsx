import { AddPropertyRequest } from "@/types/Property";
import React, { ChangeEvent, useState, useEffect, useCallback } from "react";
import { MdDelete } from "react-icons/md";
import { TbPhotoUp } from "react-icons/tb";
import { useFormContext } from "react-hook-form";

// Extended type for form state - matching your backend expectations
type ExtendedPropertyInput = AddPropertyRequest & {
  images?: File[]; // New image files to upload
  existingImages?: string[]; // URLs of existing images to keep
};

type ImagePreview = {
  url: string;
  file?: File;
  isExisting: boolean;
  id: string; // Add unique ID for better tracking
};

const UpdateImageForm = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ExtendedPropertyInput>();

  // Watch form values
  const watchedImages = watch("images") || [];
  const watchedExistingImages = watch("existingImages") || [];
  
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [validationError, setValidationError] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoized function to update form values
  const updateFormValues = useCallback((previews: ImagePreview[]) => {
    // Separate existing images and new files
    const existingImages = previews
      .filter(p => p.isExisting)
      .map(p => p.url);
    
    const newImages = previews
      .filter(p => !p.isExisting && p.file)
      .map(p => p.file!);

    console.log("Updating form values:", {
      existingImages: existingImages.length,
      newImages: newImages.length,
      totalPreviews: previews.length,
      existingImageUrls: existingImages
    });

    // Update form values to match backend expectations
    setValue("existingImages", existingImages, { shouldDirty: true });
    setValue("images", newImages, { shouldDirty: true });
  }, [setValue]);

  // Initialize images when form loads - ONLY ONCE
  useEffect(() => {
    if (watchedExistingImages.length > 0 && !isInitialized) {
      console.log("Initializing with existing images:", watchedExistingImages);
      const existingPreviews: ImagePreview[] = watchedExistingImages.map((url: string, index: number) => ({
        url,
        isExisting: true,
        id: `existing-${index}-${Date.now()}`, // Unique ID
      }));
      setImagePreviews(existingPreviews);
      setIsInitialized(true);
    } else if (watchedExistingImages.length === 0 && !isInitialized) {
      // Handle case where there are no existing images
      setIsInitialized(true);
    }
  }, [watchedExistingImages, isInitialized]);

  // Update form values when imagePreviews changes - but NOT during render
  useEffect(() => {
    if (isInitialized) {
      updateFormValues(imagePreviews);
    }
  }, [imagePreviews, isInitialized, updateFormValues]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const files = Array.from(fileList);
    const totalAfterUpload = imagePreviews.length + files.length;

    // Validate file count
    if (totalAfterUpload > 5) {
      setValidationError("Maximum 5 images allowed");
      return;
    }

    let processedCount = 0;
    const newPreviews: ImagePreview[] = [];

    files.forEach((file, index) => {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setValidationError("Only image files are allowed");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setValidationError("Each image must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        newPreviews.push({
          url: result,
          file: file,
          isExisting: false,
          id: `new-${Date.now()}-${index}`, // Unique ID
        });
        
        processedCount++;

        // Update state when all files are processed
        if (processedCount === files.length) {
          console.log("Adding new images to existing previews");
          setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
          setValidationError("");
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset the input
    e.target.value = "";
  };

  const handleDeleteImage = (indexToDelete: number) => {
    console.log("Deleting image at index:", indexToDelete);
    const imageToDelete = imagePreviews[indexToDelete];
    console.log("Image being deleted:", { 
      isExisting: imageToDelete?.isExisting, 
      url: imageToDelete?.url?.slice(-30) 
    });
    
    setImagePreviews(prevPreviews => {
      const newPreviews = prevPreviews.filter((_, i) => i !== indexToDelete);
      console.log("New previews after deletion:", newPreviews.length);
      return newPreviews;
    });
    
    // Reset validation error if we're under the limit
    setValidationError("");
  };

  // Validate current state
  useEffect(() => {
    if (imagePreviews.length === 0 && isInitialized) {
      setValidationError("At least 1 image is required");
    } else if (imagePreviews.length > 5) {
      setValidationError("Maximum 5 images allowed");
    } else {
      setValidationError("");
    }
  }, [imagePreviews.length, isInitialized]);

  return (
    <div className="grid grid-cols-6 gap-4 w-full">
      <div className="col-start-1 col-end-2">
        <label className="block mb-2 text-md font-medium text-gray-900 dark:text-white text-left">
          Property Images
        </label>
      </div>

      <div className="col-start-1 col-end-6 overflow-auto grid-cols-1 gap-4 items-center justify-center w-full h-96 border-2 border-gray-900 border-dashed rounded-lg cursor-pointer bg-gray-50 mb-6">
        {imagePreviews.length > 0 ? (
          <div className="grid grid-cols-3 gap-8 px-10 py-5 h-full overflow-y-auto">
            {imagePreviews.map((preview, index) => (
              <div key={preview.id} className="relative group h-48">
                <img
                  src={preview.url}
                  alt="Property preview"
                  className="w-full h-full object-cover border-2 border-gray-400 rounded"
                />

                {/* Image type badge */}
                <div className={`absolute top-2 left-2 px-2 py-1 text-xs rounded text-white ${
                  preview.isExisting ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                  {preview.isExisting ? 'Existing' : 'New'}
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  className="absolute top-2 right-2 w-8 h-8 grid items-center justify-center bg-red-600 bg-opacity-80 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-opacity-100 transition-opacity"
                  onClick={() => handleDeleteImage(index)}
                  title="Delete image"
                >
                  <MdDelete size="16px" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid w-full justify-center items-center h-full">
            <TbPhotoUp size="60px" className="text-gray-400" />
            <p className="text-gray-500 mt-2">Click to select images</p>
          </div>
        )}
      </div>

      <div className="col-start-1 col-end-3">
        <label className="inline-block px-4 py-2 text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
          Add Images
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {validationError && (
        <span className="text-red-500 text-sm font-bold col-start-1 col-end-6">
          {validationError}
        </span>
      )}

      {/* Image count display */}
      <div className="col-start-4 col-end-6 text-sm text-gray-600 flex items-center">
        <span>
          {imagePreviews.length} image{imagePreviews.length !== 1 ? "s" : ""} selected
          {imagePreviews.filter(p => !p.isExisting).length > 0 && (
            <span className="ml-2 text-green-600">
              ({imagePreviews.filter(p => !p.isExisting).length} new)
            </span>
          )}
        </span>
      </div>

      {/* Status messages */}
      {imagePreviews.some(p => !p.isExisting) && (
        <div className="col-start-1 col-end-6 text-sm text-green-600">
          <p>New images will be uploaded when you save.</p>
        </div>
      )}

      {imagePreviews.length !== watchedExistingImages.length && (
        <div className="col-start-1 col-end-6 text-sm text-blue-600">
          <p>Image changes will be applied when you save the property.</p>
        </div>
      )}

      {errors.images && (
        <div className="col-start-1 col-end-6">
          <span className="text-red-500 text-sm font-bold">
            {errors.images.message}
          </span>
        </div>
      )}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="col-start-1 col-end-6 text-xs text-gray-400 border-t pt-2">
          <p>Debug: Previews: {imagePreviews.length}, Existing: {imagePreviews.filter(p => p.isExisting).length}, New: {imagePreviews.filter(p => !p.isExisting).length}</p>
          <p>Form Values - Existing: {watchedExistingImages.length}, New: {watchedImages.length}</p>
        </div>
      )}
    </div>
  );
};

export default UpdateImageForm;