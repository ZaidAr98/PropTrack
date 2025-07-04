import cloudinary from "../../config/cloudinaryConfig";


export const cloudinaryDeleteImages = async (imageUrls) =>{
const getPublicIdFromUrl = (url) => {
   const parts = url.split('/');
   const fileWithExtension = parts.pop();
   const folderPath = parts.slice(-1)[0] === 'real-estate-app' ? '' : 'real-estate-app/';
   const [publicId] = fileWithExtension.split('.');
   return `${folderPath}${publicId}`;
  }


  const deletePromises = imageUrls.map((url) => {
    const publicId = getPublicIdFromUrl(url);
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error(`Error deleting image ${publicId}:`, error);
          reject(error);
        } else {
          console.log(`Image ${publicId} deleted successfully.`);
          resolve(result);
        }
      });
    });
  })

return Promise.all(deletePromises)
}