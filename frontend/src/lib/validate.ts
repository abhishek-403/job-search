import {
    ACCEPTED_IMAGE_TYPES,
    MAX_FILE_SIZE,
  } from "@/lib/constants";
  
  export function validateImageType(files: File[]) {
    return files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
  }
 
  
  export function validateImageSize(files: File[]) {
    return files.every((file) => file.size <= MAX_FILE_SIZE);
  }
  export function validateVideoSize(file: File) {
    return file.size <= MAX_FILE_SIZE;
  }
  