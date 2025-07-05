import React, { ChangeEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AddPropertyRequest } from "@/types/Property";
import { TbPhotoUp } from "react-icons/tb";
import { MdDelete } from "react-icons/md";

// Extended type to match your main form
type ExtendedPropertyInput = AddPropertyRequest & {
  images?: File[];
  imageUrls?: string[];
};

interface ImagePreview {
  url: string;
  file: File;
}

const ImageForm: React.FC = () => {
  const {
    setValue,
    formState: { errors },
    clearErrors,
  } = useFormContext<ExtendedPropertyInput>();

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [validationError, setValidationError] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const files = Array.from(fileList);
    let processedCount = 0;
    const newPreviews: ImagePreview[] = [];

    
    const totalAfterUpload = imagePreviews.length + files.length;
    if (totalAfterUpload > 5) {
      setValidationError("Maximum 5 images allowed");
      return;
    }

    files.forEach((file) => {
   
      if (!file.type.startsWith('image/')) {
        setValidationError("Only image files are allowed");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { 
        setValidationError("Each image must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        newPreviews.push({
          url: result,
          file: file,
        });
        
        processedCount++;

        // Update state when all files are processed
        if (processedCount === files.length) {
          const updatedPreviews = [...imagePreviews, ...newPreviews];
          setImagePreviews(updatedPreviews);

          // Convert to File array for proper typing
          const fileArray = updatedPreviews.map(preview => preview.file);
          setValue("images", fileArray);
          setValidationError("");
          clearErrors("images");
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset the input
    e.target.value = "";
  };

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    event.preventDefault();

    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);

    // Update form with remaining files
    const fileArray = updatedPreviews.map(preview => preview.file);
    setValue("images", fileArray);

    // Reset validation error if needed
    if (updatedPreviews.length >= 1) {
      setValidationError("");
    }
  };

  // Validate current state
  React.useEffect(() => {
    if (imagePreviews.length === 0) {
      setValidationError("At least 1 image is required");
    } else if (imagePreviews.length > 5) {
      setValidationError("Maximum 5 images allowed");
    } else {
      setValidationError("");
    }
  }, [imagePreviews.length]);

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
              <div key={index} className="relative group h-48">
                <img
                  src={preview.url}
                  alt="Property preview"
                  className="w-full h-full object-cover border-2 border-gray-400 rounded"
                />

                {/* Delete button */}
                <button
                  type="button"
                  className="absolute top-2 right-2 w-8 h-8 grid items-center justify-center bg-red-600 bg-opacity-80 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-opacity-100"
                  onClick={(event) => handleDelete(event, index)}
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
          Select Images
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

     
      <div className="col-start-4 col-end-6 text-sm text-gray-600 flex items-center">
        <span>
          {imagePreviews.length} image{imagePreviews.length !== 1 ? "s" : ""} selected
        </span>
      </div>
    </div>
  );
};

export default ImageForm;
