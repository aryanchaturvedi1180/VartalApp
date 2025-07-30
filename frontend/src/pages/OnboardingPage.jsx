import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircleIcon, GlobeIcon, MapPinIcon, SparklesIcon } from "lucide-react";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { LANGUAGES } from "../constants/index.js";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "https://avatar.iran.liara.run/public/1.png",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong!");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormData((prev) => ({ ...prev, profilePic: randomAvatar }));
    toast.success("Random profile picture generated!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a0b10] 
        backdrop-blur-md flex items-center justify-center px-4 py-8">

      <div className="flex flex-col lg:flex-row bg-[#111827] rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden">
        <div className="w-full p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircleIcon className="text-yellow-400 size-9" />
            <h1 className="text-3xl font-bold tracking-wide text-white">VartalApp</h1>
          </div>

          <div className="flex flex-col items-center text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Create an Account</h2>
            <p className="text-gray-400">Let others know about you and your goals</p>
          </div>

          {/* Avatar + Button */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <img
              src={formData.profilePic}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-yellow-400"
            />
            <button
              type="button"
              onClick={handleRandomAvatar}
              className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-4 py-1.5 text-sm rounded-full flex items-center gap-2"
            >
              <SparklesIcon className="size-4" /> Generate Random Avatar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm text-white mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your Full Name"
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm text-white mb-1">Bio</label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell others about yourself and your language learning goals"
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
              />
            </div>

            {/* Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white mb-1">Native Language</label>
                <select
                  name="nativeLanguage"
                  value={formData.nativeLanguage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white mb-1">Learning Language</label>
                <select
                  name="learningLanguage"
                  value={formData.learningLanguage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learn-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm text-white mb-1">Location</label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 -translate-y-1/2 left-3 size-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-4 bg-yellow-500 text-black font-semibold py-2 rounded-md hover:bg-yellow-400 transition flex items-center justify-center gap-2"
            >
              <GlobeIcon className="size-4" />
              {isPending ? "Submitting..." : "Complete Onboarding"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
