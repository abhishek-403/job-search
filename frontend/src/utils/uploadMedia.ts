import { CloudinaryCredentials } from "@/lib/constants";

export async function uploadImage(image: File): Promise<string> {
  if (!CloudinaryCredentials.cloud_name || !CloudinaryCredentials.upload_preset)
    throw new Error("Cloudinary not configured");

  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", CloudinaryCredentials.upload_preset);
  formData.append("folder", "mstanley/profileImg");
  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${CloudinaryCredentials.cloud_name}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image");
  }

  const uploadedImageData = await uploadResponse.json();
  return uploadedImageData.secure_url;
}
// export async function uploadVideo(video: File): Promise<string> {
//   if (!CloudinaryCredentials.cloud_name || !CloudinaryCredentials.upload_preset)
//     throw new Error("Cloudinary not configured");

//   const formData = new FormData();
//   formData.append("file", video);
//   formData.append("upload_preset", CloudinaryCredentials.upload_preset);

//   const uploadResponse = await fetch(
//     `https://api.cloudinary.com/v1_1/${CloudinaryCredentials.cloud_name}/video/upload`,
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   if (!uploadResponse.ok) {
//     throw new Error("Failed to upload image");
//   }

//   const uploadedImageData = await uploadResponse.json();
//   return uploadedImageData.secure_url;
// }
