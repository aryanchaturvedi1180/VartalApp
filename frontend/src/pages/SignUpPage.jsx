import React, { useState } from 'react';
import { MessageCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api.js";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate: signupMutation, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      // Optional: redirect to login or dashboard here
      navigate("/");
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a0b10] 
        backdrop-blur-md flex items-center justify-center px-4 py-8">

      <div className="flex flex-col lg:flex-row bg-[#111827] rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden">

        {/* LEFT: Form Area */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircleIcon className="text-yellow-400 size-9" />
            <h1 className="text-3xl font-bold tracking-wide text-white">VartalApp</h1>
          </div>

          <h2 className="text-2xl font-bold mb-1 text-white">Create an Account</h2>
          <p className="text-gray-400 mb-6">Join VartalApp and start your conversation journey</p>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error.response?.data?.message || error.message || "Something went wrong!"}
            </p>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm text-white mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Aryan Chaturvedi"
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
                value={signupData.fullName}
                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-white mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="hello@gmail.com"
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-white mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Terms */}
            <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                      <span className="text-blue-400 hover:underline">terms of service</span> and{" "}
                      <span className="text-blue-400 hover:underline">privacy policy</span>
                      </span>
                  </label>
              </div>
              

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-md hover:bg-yellow-300 transition"
              disabled={isPending}
            >
              {isPending ? "Signing up..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 underline">Sign in</Link>
          </p>
        </div>

        {/* RIGHT: Illustration & Text */}
        <div className="hidden lg:flex w-1/2 bg-gray-900 p-8 flex-col items-center justify-center text-center">
          <img
            src="/i2.png"
            alt="Illustration"
            className="w-full h-auto rounded-xl mb-6 shadow-lg"
          />
          <h3 className="text-xl font-bold text-white mb-2">
            Connect with language partners worldwide
          </h3>
          <p className="text-gray-400 text-sm">
            Practice conversations, make friends, and improve your language skills together.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
