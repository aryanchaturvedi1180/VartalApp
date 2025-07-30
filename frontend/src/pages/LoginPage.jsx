import { useState } from "react";
import { MessageCircleIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api"; // Replace with your actual login function

const LoginPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { mutate: loginMutation, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a0b10] 
  backdrop-blur-md flex items-center justify-center px-4 py-8">
 
      <div className="flex flex-col lg:flex-row bg-[#111827] rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden">

        {/* LEFT: Form Section */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircleIcon className="text-yellow-400 size-9" />
            <h1 className="text-3xl font-bold tracking-wide text-white">VartalApp</h1>
          </div>

          <h2 className="text-2xl font-bold mb-1 text-white">Welcome Back</h2>
          <p className="text-gray-400 mb-6">Sign in to your account to continue your language journey</p>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error.response?.data?.message || error.message || "Something went wrong!"}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-white mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="hello@gmail.com"
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
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
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-md hover:bg-yellow-300 transition"
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-400 underline">Create one</Link>
          </p>
        </div>

        {/* RIGHT: Image + Message */}
        <div className="hidden lg:flex w-1/2 bg-gray-900 p-8 flex-col items-center justify-center text-center">
          <img
            src="/i2.png" // same as your signup page
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

export default LoginPage;
