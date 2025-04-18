import { Request, Response } from "express";
import prisma from "../lib/PrismaClient";
import { JobType, Domain } from "@prisma/client";
import { errorResponse, successResponse } from "../lib/responseWrapper";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      jobType,
      experience,
      salary,
      domain,
    } = req.query;

    // Convert page and limit to numbers
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};

    if (jobType) {
      // Convert from display format to enum format
      // Assuming jobType could be 'Full Time', 'Internship', etc.
      const typeMapping: Record<string, JobType> = {
        "Full Time": JobType.FULL_TIME,
        "Part Time": JobType.PART_TIME,
        Contract: JobType.CONTRACT,
        Internship: JobType.INTERNSHIP,
        Freelance: JobType.FREELANCE,
      };

      filter.jobType = typeMapping[jobType as string];
    }

    // Experience filter
    if (experience) {
      // Parse experience query param (e.g., "More than 2 years")
      const years = parseInt((experience as string).replace("More than ", ""));
      filter.experienceRequired = {
        gte: years,
      };
    }

    // Salary filter - handle different formats from UI
    if (salary) {
      if (salary === "Competitive") {
        filter.salary = { contains: "Competitive" };
      } else {
        // Parse salary range like "4-6 LPA"
        const salaryStr = salary as string;

        if (salaryStr.includes("-")) {
          // Handle "4-6 LPA" case
          const range = salaryStr.replace(" LPA", "").split("-");
          if (range.length === 2) {
            filter.salaryMin = { gte: parseInt(range[0]) };
            filter.salaryMax = { lte: parseInt(range[1]) };
          }
        } else if (salaryStr.includes("+")) {
          // Handle "40+ LPA" case
          const minSalary = parseInt(salaryStr.replace("+ LPA", ""));
          filter.salaryMin = { gte: minSalary };
        }
      }
    }

    // Domain filter - convert to enum value
    if (domain) {
      // Convert from display format to enum format
      const domainMapping: Record<string, Domain> = {
        Design: Domain.DESIGN,
        Development: Domain.DEVELOPMENT,
        Marketing: Domain.MARKETING,
        Product: Domain.PRODUCT,
        Data: Domain.DATA,
        Sales: Domain.SALES,
        "Customer Service": Domain.CUSTOMER_SERVICE,
        Operations: Domain.OPERATIONS,
        Finance: Domain.FINANCE,
        HR: Domain.HR,
        Legal: Domain.LEGAL,
        Other: Domain.OTHER,
      };

      filter.domain = domainMapping[domain as string];
    }

    // Get total count for pagination
    const totalJobs = await prisma.job.count({
      where: filter,
    });

    const jobs = await prisma.job.findMany({
      where: filter,
      skip,
      take: limitNum,

      orderBy: {
        postedAt: "desc",
      },
    });

    // Return jobs with pagination info
    res.json({
      data: jobs,
      pagination: {
        total: totalJobs,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(totalJobs / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      error: "Failed to fetch jobs",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const {
      title,
      companyName,
      logoImg,
      description,
      salary,
      salaryMin,
      salaryMax,
      location,
      remote = false,
      experienceRequired = 0,
      skills = [],
      deadline,
      isActive = true,
    } = req.body;

    // Validate required fields
    if (!title || !companyName || !description) {
      res.status(400).json({
        error: "Missing required fields",
        details: "Title, company name, and description are required",
      });
      return;
    }

    // Create job with the provided data
    const job = await prisma.job.create({
      data: {
        title,
        companyName,
        logoImg,
        description,
        salary,
        salaryMin,
        salaryMax,
        location,
        remote,
        experienceRequired,
        skills,
        deadline: deadline ? new Date(deadline) : null,
        isActive,
      },
    });

    res.send(successResponse(200, job));
    return;
  } catch (error) {
    console.error("Error creating job:", error);
    res.send(errorResponse(500, "Internal Error"));
    return;
  }
};

export const createBulkJob = async (req: Request, res: Response) => {
  try {
    const { jobs } = req.body;

    // Validate if jobs array exists and is not empty
    if (!Array.isArray(jobs) || jobs.length === 0) {
      res.send(
        errorResponse(400, "Jobs array is required and cannot be empty")
      );
      return;
    }

    // Validate each job in the array
    const invalidJobs = jobs.filter(
      (job) => !job.title || !job.companyName || !job.description
    );
    if (invalidJobs.length > 0) {
      res.send(
        errorResponse(
          400,
          "All jobs must have title, company name, and description"
        )
      );
      return;
    }

    // Process each job with default values and date conversion
    const processedJobs = jobs.map((job) => ({
      ...job,
      remote: job.remote ?? false,
      experienceRequired: job.experienceRequired ?? 0,
      skills: job.skills ?? [],
      deadline: job.deadline ? new Date(job.deadline) : null,
      isActive: job.isActive ?? true,
    }));

    // Create all jobs in a transaction
    const createdJobs = await prisma.$transaction(
      processedJobs.map((job) =>
        prisma.job.create({
          data: job,
        })
      )
    );

    res.send(successResponse(201, createdJobs));
    return;
  } catch (error) {
    console.error("Error creating bulk jobs:", error);
    res.send(errorResponse(500, "Failed to create jobs"));
    return;
  }
};

export const getBulkJobs = async (req: Request, res: Response) => {
  try {
    const { page = 1, jobType, experience, salary, domain } = req.query;

    const limit = 5; // Fixed limit of 5 jobs
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * limit;

    // Build filter object
    const filter: any = {
      isActive: true,
    };

    // Job Type filter
    if (jobType) {
      const typeMapping: Record<string, JobType> = {
        "Full Time": JobType.FULL_TIME,
        "Part Time": JobType.PART_TIME,
        Contract: JobType.CONTRACT,
        Internship: JobType.INTERNSHIP,
        Freelance: JobType.FREELANCE,
      };
      filter.jobType = typeMapping[jobType as string];
    }

    // Experience filter
    if (experience) {
      const years = parseInt((experience as string).replace("More than ", ""));
      filter.experienceRequired = {
        gte: years,
      };
    }

    // Salary filter
    if (salary) {
      if (salary === "Competitive") {
        filter.salary = { contains: "Competitive" };
      } else {
        const salaryStr = salary as string;
        if (salaryStr.includes("-")) {
          // Handle ranges like "4-6 LPA"
          const [min, max] = salaryStr
            .replace(" LPA", "")
            .split("-")
            .map(Number);
          filter.salaryMin = { gte: min * 100000 }; // Convert to actual salary amount
          filter.salaryMax = { lte: max * 100000 };
        } else if (salaryStr.includes("+")) {
          // Handle "40+ LPA"
          const minSalary = parseInt(salaryStr.replace("+ LPA", ""));
          filter.salaryMin = { gte: minSalary * 100000 };
        }
      }
    }

    // Domain filter
    if (domain) {
      const domainMapping: Record<string, Domain> = {
        Design: Domain.DESIGN,
        Development: Domain.DEVELOPMENT,
        Marketing: Domain.MARKETING,
        Product: Domain.PRODUCT,
        Data: Domain.DATA,
        Sales: Domain.SALES,
        "Customer Service": Domain.CUSTOMER_SERVICE,
        Operations: Domain.OPERATIONS,
        Finance: Domain.FINANCE,
        HR: Domain.HR,
        Legal: Domain.LEGAL,
        Other: Domain.OTHER,
      };
      filter.domain = domainMapping[domain as string];
    }

    // Get total count for pagination
    const totalJobs = await prisma.job.count({
      where: filter,
    });

    // Get jobs with filters and pagination
    const jobs = await prisma.job.findMany({
      where: filter,
      select: {
        id: true,
        title: true,
        companyName: true,
        logoImg: true,
        description: true,
        salary: true,
        salaryMin: true,
        salaryMax: true,
        location: true,
        remote: true,
        experienceRequired: true,
        skills: true,
        postedAt: true,
        deadline: true,
        isActive: true,
      },
      skip,
      take: limit,
      orderBy: {
        postedAt: "desc",
      },
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalJobs / limit);
    const hasMore = pageNum < totalPages;
    const nextPage = hasMore ? pageNum + 1 : null;

    res.send(
      successResponse(200, {
        jobs,
        pagination: {
          total: totalJobs,
          currentPage: pageNum,
          totalPages,
          hasMore,
          nextPage,
          limit,
        },
        filters: {
          appliedFilters: {
            jobType,
            experience,
            salary,
            domain,
          },
        },
      })
    );
    return;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.send(errorResponse(500, "Failed to fetch jobs"));
    return;
  }
};
