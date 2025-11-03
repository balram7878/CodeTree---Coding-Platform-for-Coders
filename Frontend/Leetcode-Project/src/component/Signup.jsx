import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { registerUser } from "../utils/authSlice";

const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be length of 8")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[@$!%*?&]/, "Password must include at least one special character"),
  firstName: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .regex(/^[A-Za-z\s]+$/, "Name should contain only letters and spaces"),
});

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  const formSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <form
        onSubmit={handleSubmit(formSubmit)}
        className="relative bg-gray-900/70 backdrop-blur-md border border-gray-700 shadow-2xl rounded-2xl p-8 flex flex-col w-[420px]  text-gray-200"
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2  text-white text-2xl px-6 py-2 rounded-full shadow-lg font-bold tracking-wide">
          LeetCode
        </div>

        <div className="mt-15 flex flex-col gap-5 font-medium">
          <div>
            <label htmlFor="name" className="text-sm text-gray-400">
              First Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="w-full p-2.5 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-900 outline-none"
              required
              {...register("firstName")}
            />
            {errors.fullName && (
              <span className="text-red-600 text-sm">
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="email" className="text-sm text-gray-400">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-2.5 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-900 outline-none"
              required
              {...register("email")}
            />
            {errors.email ? (
              <span className="text-red-600 text-sm">
                {errors.email.message}
              </span>
            ) : (
              ""
            )}
          </div>

          <div>
            <label htmlFor="pass" className="text-sm text-gray-400">
              Password
            </label>
            <input
              id="pass"
              type="password"
              placeholder="Create a password"
              className="w-full p-2.5 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-900 outline-none"
              required
              {...register("password")}
            />
            {errors.password && (
              <span className="text-red-600 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 bg-gradient-to-br from-gray-900  to-black hover:from-gray-800 hover:to-gray-900 cursor-pointer transition-all duration-200 text-white py-2.5 rounded-lg font-semibold shadow-md"
          >
            Create Account
          </button>

          <p className="text-sm text-gray-400 text-center mt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
