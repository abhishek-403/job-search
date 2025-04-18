import { axiosClient } from "@/utils/axiosConfig";

export const getUserProfile = async () => {
  try {
    const response = await axiosClient.get("/user/get-profile");
    return response.data.result;
  } catch (error) {
    console.log(error);
  }
};
export const getUserProfileImg = async () => {
  try {
    const response = await axiosClient.get("/user/get-partial-profile");
    return response.data.result;
  } catch (error) {
    console.log(error);
  }
};
export const updateUserProfile = async (profileData: any) => {
  try {
    const response = await axiosClient.patch("/user/update-profile", profileData);
    return response.data.result.user;
  } catch (error) {
    console.log(error);
  }
};
