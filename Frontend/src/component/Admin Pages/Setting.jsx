import { useState, useEffect } from "react";

export default function SettingPage() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#0f0f0f] to-[#1a1a1a] text-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Content Card */}
        <div className="text-center space-y-8">
          {/* Animated Icon */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-yellow-400 border-r-orange-500 animate-spin"></div>

              {/* Inner static ring */}
              <div className="absolute inset-2 rounded-full border border-gray-700"></div>

              {/* Center icon */}
              <div className="relative z-10 text-5xl">⚙️</div>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
              Settings
            </h1>
            <p className="text-lg text-gray-400 flex items-center justify-center gap-2">
              We're crafting something special{dots}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              Our team is working hard to bring you powerful settings and customization options. Check back soon for an enhanced experience tailored just for you.
            </p>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 py-10 border-t border-b border-gray-700">
            <div className="bg-[#161616] border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all duration-300">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-sm font-semibold text-white mb-2">Appearance</h3>
              <p className="text-xs text-gray-500">Customize theme & display</p>
            </div>

            <div className="bg-[#161616] border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all duration-300">
              <div className="text-3xl mb-3">🔔</div>
              <h3 className="text-sm font-semibold text-white mb-2">Notifications</h3>
              <p className="text-xs text-gray-500">Manage alert preferences</p>
            </div>

            <div className="bg-[#161616] border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all duration-300">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-sm font-semibold text-white mb-2">Privacy</h3>
              <p className="text-xs text-gray-500">Control your data & access</p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-gray-400">In Development</span>
          </div>

          {/* Action Button */}
          <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-200">
            Notify Me
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-10 right-10 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="fixed bottom-10 left-10 w-40 h-40 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
      </div>
    </div>
  );
}
