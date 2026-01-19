import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useCallback } from "react";
import axiosClient from "../../utils/axiosClient";

// Utility function to convert ISO date (2004-05-02T00:00:00.000Z) to input[type="date"] format (2004-05-02)
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

// Utility function to convert ISO date to display format (DD-MM-YYYY)
const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = formatDateForInput(dateString).split("-");
  return `${day}-${month}-${year}`;
};

// Utility function to convert input[type="date"] format to ISO format for backend
const formatDateForBackend = (dateString) => {
  if (!dateString) return "";
  return `${dateString}T00:00:00.000Z`;
};

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .regex(/^[A-Za-z\s]+$/, "Name should contain only letters and spaces"),
  dob: z.string().optional(),
  phone: z.string().optional(),
});

const Toast = ({ message, type = "success" }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div
      className={`fixed bottom-6 right-6 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg animate-pulse`}
    >
      {message}
    </div>
  );
};

const FormField = ({ label, error, children }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-gray-300">{label}</label>
    {children}
    {error && (
      <span className="text-sm text-red-400 flex items-center gap-1">
        <span>⚠</span> {error}
      </span>
    )}
  </div>
);

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({ resolver: zodResolver(userSchema) });

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axiosClient.get("/auth/getProfile");
      const userData = {
        ...res.data,
        dob: formatDateForInput(res.data.dob), // Convert to YYYY-MM-DD for input[type="date"]
      };
      setUser(res.data);
      reset(userData);
    } catch (err) {
      setToast({
        message: "Failed to load profile",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data) => {
    setSaving(true);
    try {
      const dataToSend = {
        ...data,
        dob: formatDateForBackend(data.dob), // Convert back to ISO format for backend
      };
      await axiosClient.put("/auth/update/profile", dataToSend);
      setToast({ message: "Profile updated successfully!", type: "success" });
      setUser(dataToSend);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
        console.log(err);
      setToast({
        message: err.response?.data?.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const LoadingSkeleton = () => (
    <div className="w-full max-w-5xl bg-[#161616] rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32 rounded-full bg-[#2a2a2a]" />
        <div className="h-6 bg-[#2a2a2a] rounded w-24" />
        <div className="h-4 bg-[#2a2a2a] rounded w-32" />
      </div>
      <div className="md:col-span-2 space-y-4">
        <div className="h-8 bg-[#2a2a2a] rounded w-48" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-[#2a2a2a] rounded" />
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-gray-200 p-8 flex justify-center items-center">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#0f0f0f] to-[#1a1a1a] text-gray-200 p-4 md:p-8 flex justify-center items-center">
      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white bg-clip-text text-transparent">
            Account
          </h1>
          <p className="text-gray-400 mt-2">Manage your profile information</p>
        </div>

        <div className="bg-[#161616] rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-800 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* LEFT PROFILE CARD */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 flex flex-col items-center text-center space-y-6 bg-gradient-to-b from-[#1e1e1e] to-[#161616] rounded-2xl p-6 border border-gray-700">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-6xl font-bold text-black shadow-xl transform hover:scale-105 transition-transform duration-300">
                  {user.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-400 mt-1">Administrator</p>
                </div>
                <div className="w-full pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-3">Account Type</p>
                  <span className="inline-block px-4 py-1 bg-gray-600 bg-opacity-20 text-white rounded-full text-xs text-center font-semibold">
                    Admin
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <form
              onSubmit={handleSubmit(updateProfile)}
              className="lg:col-span-3 space-y-8"
            >
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full"></span>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Full Name" error={errors.name?.message}>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      {...register("name")}
                      className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-30 transition-all"
                    />
                  </FormField>

                  <FormField label="Date of Birth" error={errors.dob?.message}>
                    <div className="space-y-2">
                      <input
                        type="date"
                        {...register("dob")}
                        className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-30 transition-all"
                      />
                    </div>
                  </FormField>
                  
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="border-t border-gray-700 pt-8">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full"></span>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Phone Number" error={errors.phone?.message}>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      {...register("phone")}
                      className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-30 transition-all"
                    />
                  </FormField>

                  <FormField
                    label="Email Address"
                    error={errors.email?.message}
                  >
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      {...register("email")}
                      className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-30 transition-all"
                    />
                  </FormField>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-gray-700 w-full">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#1e1e1e] border-1 border-red-500 border-opacity-60 text-red-400 font-semibold hover:bg-red-500 hover:bg-opacity-10 hover:border-opacity-100 hover:text-white transition-all duration-200"
                >
                  Reset Password
                </button>
                <button
                  type="submit"
                  disabled={saving || !isDirty}
                  className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#1e1e1e] border-1 border-green-500 border-opacity-60 text-green-400 font-semibold hover:bg-green-500 hover:bg-opacity-10 disabled:opacity-100 hover:text-white disabled:cursor-not-allowed transition-all duration-200"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></span>
                      Saving…
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
