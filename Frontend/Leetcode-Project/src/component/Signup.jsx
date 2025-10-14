import { useForm } from "react-hook-form";
import { Link } from "react-router";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <form
        onSubmit={handleSubmit((data) => console.log(data))}
        className="relative bg-gray-900/70 backdrop-blur-md border border-gray-700 shadow-2xl rounded-2xl p-8 flex flex-col w-[420px]  text-gray-200"
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2  text-white text-2xl px-6 py-2 rounded-full shadow-lg font-bold tracking-wide">
          Sign Up
        </div>

        <div className="mt-15 flex flex-col gap-5 font-medium">
          <div>
            <label htmlFor="name" className="text-sm text-gray-400">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="w-full p-2.5 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-900 outline-none"
              required
              {...register("fullName", { required: true })}
            />
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
              {...register("email", { required: true })}
            />
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
              {...register("password", { required: true })}
            />
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
