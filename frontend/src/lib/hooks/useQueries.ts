import {
  getUserProfile,
  getUserProfileImg,
  updateUserProfile,
} from "@/services/user";
import { axiosClient } from "@/utils/axiosConfig";
import { queryClient } from "@/utils/Providers";
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });
};
export const useGetUserProfileImg = () => {
  return useQuery({
    queryKey: ["userProfileImg"],
    queryFn: getUserProfileImg,
  });
};
export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
    },
  });
};

export interface Job {
  id: string;
  title: string;
  companyName: string;
  logoImg: string;
  description: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  remote: boolean;
  experienceRequired: number;
  skills: string[];
  postedAt: string;
  deadline: string;
  isActive: boolean;
}

export interface PaginationData {
  total: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  nextPage: number;
  limit: number;
}

export interface JobsResponse {
  jobs: Job[];
  pagination: PaginationData;
}

export const useInfiniteJobs = (filters: {
  jobType?: string;
  experience?: string[];
  salary?: string[];
  domain?: string;
  searchQuery?: string;
}) => {
  return useInfiniteQuery<JobsResponse>({
    queryKey: ["jobs", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      params.append("page", String(pageParam));

      if (filters.jobType) params.append("jobType", filters.jobType);
      if (filters.experience?.length)
        params.append("experience", filters.experience[0]);
      if (filters.salary?.length) params.append("salary", filters.salary[0]);
      if (filters.domain) params.append("domain", filters.domain);
      if (filters.searchQuery) params.append("search", filters.searchQuery);

      const { data } = await axiosClient.get(
        `/job/get-bulk-jobs?${params.toString()}`
      );
      return {
        jobs: data.result.jobs,
        pagination: data.result.pagination,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasMore) return undefined;
      return lastPage.pagination.currentPage + 1;
    },
    initialPageParam: 1,
  });
};
