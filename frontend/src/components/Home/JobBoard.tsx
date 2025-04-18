import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Job,
  JobsResponse,
  useInfiniteJobs
} from "@/lib/hooks/useQueries";
import { cn } from "@/lib/utils";
import Loader from "@/utils/Loader";
import { useEffect, useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import BorderAnimation from "../BorderAnimation";
import { Input } from "../ui/input";



export default function JobBoard() {
  const [jobType, setJobType] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [experience, setExperience] = useState<string[]>([]);
  const [salary, setSalary] = useState<string[]>([]);
  const [domain, setDomain] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { ref: loadMoreRef, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteJobs({
    jobType: jobType?.value || undefined,
    experience,
    salary,
    domain: domain || undefined,
    searchQuery,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const jobs = data?.pages.flatMap((page: JobsResponse) => page.jobs) ?? [];

  const clearFilters = () => {
    setJobType(null);
    setExperience([]);
    setSalary([]);
    setDomain("");
    setSearchQuery("");
    refetch();
  };

  const experienceOptions = [
    "More than 0 year",
    "More than 1 year",
    "More than 2 years",
    "More than 3 years",
    "More than 4 years",
  ];

  const salaryOptions = [
    "Competitive",
    "2-4 LPA",
    "4-6 LPA",
    "6-10 LPA",
    "10-20 LPA",
    "20-30 LPA",
    "30-40 LPA",
    "40+ LPA",
  ];

  return (
    <div
      className=" text-white  font-inter w-full md:p-6 flex"
      
    >
      {/* Sidebar */}
      <BorderAnimation
        time={16}
        className="w-fit h-fit rounded-xl"
        width={2}
        firstColor="#656565"
        secColor="#343434"
      >
        <aside className="md:w-[360px] hidden md:block p-4 border-[3px] rounded-xl bg-gradient-to-b from-dark-100 via-neutral-90 to-neutral-100  border-neutral-80">
          <h2 className="text-lg mb-4 justify-between  flex items-center gap-2">
            <div className="gap-2 center text-neutral-0">
              <FaFilter className="" /> Filters
            </div>
            <div
              onClick={clearFilters}
              className="cursor-pointer text-neutral-40 hover:text-neutral-30 transition-all duration-200 text-sm"
            >
              Clear all
            </div>
          </h2>
          <div className="ml-2 flex flex-col gap-2">
            <div className="mt-4 ">
              <FilterHeader>Job Type</FilterHeader>
              <div className="flex gap-2 mt-2 ml-2">
                <Button
                  className={`text-white bg-black border-neutral-80 border ${
                    jobType?.value === "full_time"
                      ? "bg-dark-40"
                      : "hover:bg-neutral-80"
                  }`}
                  onClick={() =>
                    setJobType(
                      jobType?.value === "full_time"
                        ? null
                        : { label: "Full Time", value: "full_time" }
                    )
                  }
                >
                  Full Time
                </Button>
                <Button
                  className={`text-white bg-black border-neutral-70 border ${
                    jobType?.value === "internship"
                      ? "bg-dark-40"
                      : "hover:bg-neutral-80"
                  }`}
                  onClick={() =>
                    setJobType(
                      jobType?.value === "internship"
                        ? null
                        : { label: "Internship", value: "internship" }
                    )
                  }
                >
                  Internship
                </Button>
              </div>

              {/* Display selected job type */}
            </div>
            <div className="mt-4 ">
              <FilterHeader>Experience</FilterHeader>
              <FilterCheckBox>
                {experienceOptions.map((exp) => (
                  <div
                    key={exp}
                    className=" flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      id={exp}
                      checked={experience.includes(exp)}
                      onCheckedChange={(checked) => {
                        setExperience((prev) =>
                          checked
                            ? [...prev, exp]
                            : prev.filter((e) => e !== exp)
                        );
                      }}
                      className="border-neutral-60 "
                    />
                    <Label
                      htmlFor={exp}
                      className="cursor-pointer text-neutral-20 font-rubik font-thin "
                    >
                      {exp}
                    </Label>
                  </div>
                ))}
              </FilterCheckBox>
            </div>
            <div className="mt-4 ">
              <FilterHeader>Salary</FilterHeader>
              <FilterCheckBox className="grid grid-cols-2">
                {salaryOptions.map((sal) => (
                  <div key={sal} className="flex items-center gap-2">
                    <Checkbox
                      id={sal}
                      checked={salary.includes(sal)}
                      onCheckedChange={(checked) => {
                        setSalary((prev) =>
                          checked
                            ? [...prev, sal]
                            : prev.filter((s) => s !== sal)
                        );
                      }}
                      className="border-neutral-60"
                    />
                    <Label
                      htmlFor={sal}
                      className="cursor-pointer text-neutral-20 font-rubik font-thin "
                    >
                      {sal}
                    </Label>
                  </div>
                ))}
              </FilterCheckBox>
            </div>
            <div className="mt-4 mr-8">
              <FilterHeader className="mb-2">Domain</FilterHeader>
              <Select onValueChange={setDomain} value={domain}>
                <SelectTrigger className="text-white  bg-neutral-90 border-neutral-80 ">
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-90  text-white border-neutral-80">
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>
      </BorderAnimation>

      {/* Job Listings */}
      <main className="flex-1">
        <div className="flex items-center md:pl-4 px-2   justify-between mb-6">
          <div className="w-full md:max-w-[600px] center ">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

        </div>
        <div className="flex gap-2 flex-col max-h-[580px] md:pl-4 px-2 overflow-auto no-scrollbar">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : isError ? (
            <p className="text-red-400">
              Error loading jobs. Please try again.
            </p>
          ) : jobs.length > 0 ? (
            <>
              {jobs.map((job: Job, index: number) => (
                <div
                  key={index}
                  className="bg-gradient-to-br w-full rounded-lg from-neutral-90 via-neutral-95 to-neutral-90 hover:border-neutral-70 transition-all duration-75 border-2 border-neurtal-85 cursor-pointer"
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={job.logoImg}
                      alt={job.companyName}
                      className="w-32 h-32 rounded-md"
                    />
                    <div className="flex flex-col">
                      <div className="flex flex-col h-full">
                        <h3 className="text-xl font-bold text-white">
                          {job.companyName} is hiring for {job.title}
                        </h3>
                        <p className="text-neutral-10 text-sm mt-2">
                          Posted on{" "}
                          {new Date(job.postedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-auto flex gap-2 text-xs text-neutral-20">
                        <span className="px-2 py-1 bg-neutral-75 rounded-lg">
                          {job.remote ? "Remote" : job.location}
                        </span>
                        <span className="px-2 py-1 bg-neutral-75 rounded-lg">
                          {job.salary}
                        </span>
                        <span className="px-2 py-1 bg-neutral-75 rounded-lg">
                          {job.experienceRequired} years
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Load more trigger */}
              <div ref={loadMoreRef} className="py-4 flex justify-center">
                {isFetchingNextPage ? (
                  <Loader />
                ) : hasNextPage ? (
                  <span className="text-neutral-40">Loading more jobs...</span>
                ) : (
                  <span className="text-neutral-40">No more jobs to load.</span>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-400">No jobs match your filters.</p>
          )}
        </div>
      </main>
    </div>
  );
}

const FilterHeader = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h3 className={cn("text-md text-neutral-10 font-medium", className)}>
      {children}
    </h3>
  );
};
const FilterCheckBox = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h3 className={cn("flex flex-col gap-2 mt-2 ml-2", className)}>
      {children}
    </h3>
  );
};

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search jobs...",
}: any) => {
  return (
    <div className="relative font-inter center w-full ">
      <FaSearch
        className="absolute right-3 top-1/2 mx-2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
      <Input
        type="text"
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-neutral-85 my-auto h-[52px] text-white border-2 border-neutral-80 placeholder-neutral-80 focus:border-neutral-60 rounded-full pr-12 pl-6  md:text-base"
      />
    </div>
  );
};
