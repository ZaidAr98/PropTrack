import cloudinary from "../../config/cloudinaryConfig";

export const cloudinaryImageUploadMethod = async (fileBuffer: Buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "real-estate-app",
      },

      (err, result) => {
        if (err) {
          reject("Upload image error");
        } else {
          resolve(result.secure_url); 
        }
      }
    )
    .end(fileBuffer);
  });
};
