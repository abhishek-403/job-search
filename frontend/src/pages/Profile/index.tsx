import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/utils/firbaseConfig";
import React, { ChangeEvent, useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {
  FiCamera,
  FiEdit,
  FiGithub,
  FiLinkedin,
  FiLogOut,
  FiSave,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MultiSelect } from "@/components/multi-select";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { profileSchema, resumeSchema } from "@/utils/types";
import {
  useGetUserProfile,
  useUpdateProfileMutation,
} from "@/lib/hooks/useQueries";
import toast from "react-hot-toast";
import ProfileSkeleton from "@/skeletons/ProfileSkeleton";
import { uploadImage } from "@/utils/uploadMedia";
import { validateImageSize, validateImageType } from "@/lib/validate";

type ProfileSchemaType = z.infer<typeof profileSchema>;

export const skillsOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "react", label: "React" },
  { value: "nodejs", label: "Node.js" },
  { value: "typescript", label: "TypeScript" },
  { value: "mongodb", label: "MongoDB" },
  { value: "express", label: "Express.js" },
  { value: "docker", label: "Docker" },
  { value: "aws", label: "AWS" },
  { value: "java", label: "Java" },
  { value: "springboot", label: "Springboot" },
];

interface InputWithEditProps {
  label: string;
  type?: string;
  icon?: React.ReactNode;
  name: string;
  editMode: boolean;
  onToggleEdit: () => void;
  error?: string;
  register: any;
}

const JobApplicationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: isUserLoading } = useGetUserProfile();
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [image, setImage] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [resume, setResume] = useState<File | null>(null);
  const [resumeURL, setResumeURL] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const { mutate: updateProfile } = useUpdateProfileMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      designation: "",
      experienceYears: 0,
      linkedIn: "",
      github: "",
      skills: [],
      resumeUrl: "",
      profileImage: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        designation: user.designation || "",
        experienceYears: user.experienceYears
          ? Number(user.experienceYears)
          : 0,
        linkedIn: user.linkedIn || "",
        github: user.github || "",
        skills: user.skills,
        resumeUrl: user.resumeUrl || "",
        profileImage: user.profileImage || "",
      });

      if (user.resumeUrl) {
        setResumeURL(user.resumeUrl);
      }
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileSchemaType) => {
    setIsSubmitting(true);
    try {
      const profileImage = image;
      if (profileImage && profileImage !== user?.profileImage) {
        const imageUrl = await uploadImage(profileImage);
        data.profileImage = imageUrl;
      }
      console.log("Form submitted: ", data);
      updateProfile(data, {
        onSuccess: () => {
          toast.success("Profile updated successfully!");
        },
        onError: () => {
          toast.error("Failed to update profile");
        },
      });
      setEditMode({});
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEditMode = (field: string) => {
    setEditMode((prev) => ({ [field]: !prev[field] }));
  };

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateImageSize([file])) {
        toast.error("Image should be less than 5MB");
        return;
      }

      if (!validateImageType([file])) {
        toast.error("PNG or JPG only");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setValue("profileImage", e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file using Zod
    const validation = resumeSchema.safeParse(file);
    if (!validation.success) {
      // Set error in form
      setValue("resumeUrl", "", { shouldValidate: false });
      return;
    }

    // If valid, update form and preview
    setResume(file);
    const url = URL.createObjectURL(file);
    setResumeURL(url);
    setValue("resumeUrl", url, { shouldValidate: true });
  };

  const arraysEqual = (arr1: string[] = [], arr2: string[] = []) => {
    return (
      arr1.length === arr2.length &&
      arr1.every((val, index) => val === arr2[index])
    );
  };

  // Check if form has been modified
  const formValues = watch();
  const changesHaveBeenMade =
    user &&
    (formValues.name !== user.name ||
      formValues.email !== user.email ||
      formValues.designation !== user.designation ||
      formValues.experienceYears !== user.experienceYears ||
      formValues.linkedIn !== user.linkedIn ||
      formValues.github !== user.github ||
      formValues.resumeUrl !== user.resumeUrl ||
      !arraysEqual(formValues.skills, user.skills) ||
      !!image);

  if (isUserLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="p-4 md:p-6 relative text-white min-h-screen">
      <div
        onClick={() => navigate(-1)}
        className="absolute center top-4 left-4 md:top-8 md:left-8 py-2 px-3 bg-neutral-85 cursor-pointer rounded-lg hover:bg-neutral-80 flex text-md gap-2 text-neutral-10 font-rubik"
      >
        <FaArrowLeft size={18} />
      </div>
      <Card className="w-full max-w-4xl md:mt-2 mt-12 min-h-[88vh] mx-auto bg-neutral-90">
        <CardContent className="p-4 md:p-6">
          <div className="flex mb-6 justify-between relative">
            <div className="flex gap-3">
              <div className="relative items-center flex">
                <Avatar className="md:h-[74px] h-16 w-full aspect-square border border-zinc-700">
                  {watch("profileImage") ? (
                    <AvatarImage
                      key={watch("profileImage")}
                      src={watch("profileImage")}
                      alt="Profile"
                    />
                  ) : (
                    <AvatarFallback className="bg-zinc-800 text-zinc-400">
                      {watch("name")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <label className="absolute bottom-0 right-0 bg-zinc-800 hover:bg-zinc-700 rounded-full p-1 md:p-[6px]  cursor-pointer border border-zinc-600">
                  <FiCamera className="text-[12px]" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                </label>
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-md md:text-xl font-medium">
                  {watch("name")}
                </h2>
                <p className="text-xs md:text-sm text-zinc-400">
                  {watch("designation")}
                </p>
              </div>
            </div>

            <div className="flex flex-col mt-4">
              <span
                onClick={() => auth.signOut()}
                className="bg-neutral-80 p-3 py-2 rounded-lg hover:bg-red-400 hover:text-white transition-all duration-200 cursor-pointer text-red-400 flex gap-2 center text-xs md:text-sm"
              >
                Logout
                <FiLogOut />
              </span>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-fit h-[40px] grid grid-cols-2 mb-4 bg-neutral-85">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-neutral-90 text-base"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="applied"
                className="data-[state=active]:bg-neutral-90 text-base"
              >
                Applied Jobs
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <TabsContent value="profile">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithEdit
                    label="Name"
                    name="name"
                    editMode={!!editMode.name}
                    onToggleEdit={() => toggleEditMode("name")}
                    register={register}
                    error={errors.name?.message}
                  />
                  <InputWithEdit
                    label="Designation"
                    name="designation"
                    editMode={!!editMode.designation}
                    onToggleEdit={() => toggleEditMode("designation")}
                    register={register}
                    error={errors.designation?.message}
                  />
                  <InputWithEdit
                    label="Email"
                    type="email"
                    name="email"
                    editMode={!!editMode.email}
                    onToggleEdit={() => toggleEditMode("email")}
                    register={register}
                    error={errors.email?.message}
                  />

                  <div className="flex justify-between flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm text-zinc-400">
                        Skills
                      </label>
                    </div>
                    <div>
                      <MultiSelect
                        options={skillsOptions}
                        onValueChange={(selected) =>
                          setValue("skills", selected)
                        }
                        value={watch("skills")}
                        placeholder="Select Skills"
                        variant="default"
                        animation={1}
                        maxCount={isMobile ? 2 : 3}
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    {errors.skills && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.skills.message}
                      </p>
                    )}
                  </div>

                  <InputWithEdit
                    label="LinkedIn"
                    name="linkedIn"
                    icon={<FiLinkedin />}
                    editMode={!!editMode.linkedIn}
                    onToggleEdit={() => toggleEditMode("linkedIn")}
                    register={register}
                    error={errors.linkedIn?.message}
                  />
                  <InputWithEdit
                    label="Experience"
                    name="experienceYears"
                    editMode={!!editMode.experience}
                    onToggleEdit={() => toggleEditMode("experience")}
                    register={register}
                    error={errors.experienceYears?.message}
                    type="number"
                  />
                  <InputWithEdit
                    label="Github"
                    name="github"
                    icon={<FiGithub />}
                    editMode={!!editMode.github}
                    onToggleEdit={() => toggleEditMode("github")}
                    register={register}
                    error={errors.github?.message}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-6 justify-between">
                  <div className="flex flex-col md:flex-row gap-4 mt-2 justify-between">
                    <div className="flex gap-4 items-center">
                      {!resume && !resumeURL ? (
                        <label className="flex text-sm font-medium items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md cursor-pointer">
                          <FiUpload className="h-4 w-4" />
                          Upload Resume
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleResumeUpload}
                          />
                        </label>
                      ) : (
                        <div className="flex gap-2 text-sm font-medium">
                          <Button
                            type="button"
                            className="bg-neutral-80 hover:bg-neutral-70 text-white px-4 py-2 rounded-md"
                            onClick={() => setShowPreview(true)}
                          >
                            Preview Resume
                          </Button>
                          <label className="w-fit flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md cursor-pointer">
                            <FiUpload className="h-4 w-4" />
                            Change Resume
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={handleResumeUpload}
                            />
                          </label>
                        </div>
                      )}
                      {errors.resumeUrl && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors.resumeUrl.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="flex mt-auto items-center gap-2 bg-dark-40 hover:bg-dark-50 text-white"
                    disabled={!changesHaveBeenMade || isSubmitting}
                  >
                    {isSubmitting ? (
                      "Saving..."
                    ) : (
                      <>
                        <FiSave className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>

                {/* Resume Preview Modal */}
                {showPreview && resumeURL && (
                  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-neutral-90 border-2 border-neutral-70 w-[90%] md:w-[60%] h-[90%] p-4 rounded-lg relative">
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-white"
                        onClick={() => setShowPreview(false)}
                      >
                        <FiX size={24} />
                      </button>
                      <h3 className="text-lg font-bold text-white mb-4">
                        Resume Preview
                      </h3>
                      <iframe
                        src={resumeURL}
                        className="w-full h-[90%]"
                        title="Resume Preview"
                      ></iframe>
                    </div>
                  </div>
                )}
              </TabsContent>
            </form>

            <TabsContent value="applied">
              <div className="space-y-4">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardContent className="p-4">
                    <h3 className="font-medium">XYZ Company</h3>
                    <p className="text-sm text-zinc-400">CTC - 20lpa</p>
                    <p className="text-sm text-zinc-400">
                      Status - Interview on 20th May
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800 border-zinc-700">
                  <CardContent className="p-4">
                    <h3 className="font-medium">XYZ Company</h3>
                    <p className="text-sm text-zinc-400">CTC - 20lpa</p>
                    <p className="text-sm text-zinc-400">Status - Rejected</p>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800 border-zinc-700">
                  <CardContent className="p-4">
                    <h3 className="font-medium">XYZ Company</h3>
                    <p className="text-sm text-zinc-400">CTC - 20lpa</p>
                    <p className="text-sm text-zinc-400">
                      Status - Resume shortlisted
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const EditableInput: React.FC<{
  type?: string;
  disabled: boolean;
  className: string;
  icon?: React.ReactNode;
  register: any;
}> = ({ type = "text", disabled, className, icon, register }) => {
  return (
    <div className="relative">
      <input
        type={type}
        disabled={disabled}
        className={`w-full px-3 py-2 rounded-md bg-zinc-800 border ${
          disabled ? "border-zinc-700 opacity-50" : "border-zinc-500"
        } text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 ${
          icon ? "pl-8" : ""
        }`}
        autoFocus={!disabled}
        {...register}
      />
      {icon && (
        <div className="absolute left-2 top-2.5 text-zinc-400">{icon}</div>
      )}
    </div>
  );
};

const InputWithEdit: React.FC<InputWithEditProps> = ({
  label,
  type = "text",
  icon = null,
  name,
  editMode,
  onToggleEdit,
  error,
  register,
}) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <label className="block text-sm text-zinc-400">{label}</label>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onToggleEdit}
        className="h-6 w-6 p-0 text-zinc-400 hover:text-white"
      >
        {editMode ? <FiX size={14} /> : <FiEdit size={14} />}
      </Button>
    </div>
    <EditableInput
      type={type}
      disabled={!editMode}
      className={`bg-zinc-800 border-zinc-700 ${icon ? "pl-8" : ""} ${
        editMode ? "border-zinc-500" : ""
      }`}
      icon={icon}
      register={register(name)}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default JobApplicationDashboard;
