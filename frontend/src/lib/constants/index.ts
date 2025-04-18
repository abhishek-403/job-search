export const CloudinaryCredentials = {
    cloud_name: import.meta.env.VITE_CLOUDINARY_NAME as string,
    upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string,
  };

  export const MAX_FILE_SIZE = 5 * 1024 * 1024;

  export const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];