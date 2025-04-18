import { useState } from "react";

type Props = {};

export default function JobFilterMobile({}: Props) {
  const [activeTab, setActiveTab] = useState("Experience"); // Default active tab
  const [selectedExperience, setSelectedExperience] = useState(null); // Track selected experience

  const tabs = ["Job Type", "Experience", "Salary", "Domain"];
  const experienceOptions = [
    "More than 0 year",
    "More than 1 year",
    "More than 2 years",
    "More than 3 years",
    "More than 4 years",
  ];

  const handleTabClick = (tab:any) => {
    setActiveTab(tab);
    setSelectedExperience(null); // Reset selection when changing tabs
  };

  const handleExperienceClick = (exp:any) => {
    setSelectedExperience(exp);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mx-auto">
      <div className="flex space-x-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 rounded-full text-sm ${
              activeTab === tab
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Experience" && (
        <div className="grid grid-cols-2 gap-2">
          {experienceOptions.map((exp) => (
            <button
              key={exp}
              onClick={() => handleExperienceClick(exp)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedExperience === exp
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      )}

      {/* Add logic for Salary and Domain tabs here if needed */}
    </div>
  );
}
