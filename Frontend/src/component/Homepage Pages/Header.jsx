import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../utils/authSlice";


export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const onClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const firstLetter = user?.name ? user.name[0].toUpperCase() : "A";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col">
      {/* HEADER */}
      <header className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-b border-gray-700/30 px-8 py-5 flex justify-between items-center backdrop-blur-sm">
        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
          <span className="text-3xl group-hover:scale-110 transition-transform duration-300 filter brightness-75">
            🌳
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              CodeTree
            </h1>
            <p className="text-xs text-gray-500 tracking-wide">
              Master Coding
            </p>
          </div>
        </div>

        {/* Right Section - Navigation & Profile */}
        <div className="flex items-center gap-6">
          {/* Quick Nav Links */}
          <nav className="hidden md:flex gap-8 items-center">
            <button
              onClick={() => navigate("/problems")}
              className="text-gray-300 hover:text-white text-lg font-medium transition-colors duration-300 relative group"
            >
              Problems
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-600 group-hover:w-full transition-all duration-300"></div>
            </button>
            <button
              onClick={() => navigate("/user/dashboard")}
              className="text-gray-300 hover:text-white text-lg font-medium transition-colors duration-300 relative group"
            >
              Dashboard
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-600 group-hover:w-full transition-all duration-300"></div>
            </button>
          </nav>

          {/* Profile Avatar & Dropdown */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="w-12 h-12 rounded-full bg-black text-white font-bold flex items-center justify-center shadow-xl hover:shadow-gray-600/40 transition-all duration-300 hover:scale-105 text-lg border border-gray-500"
            >
              {firstLetter}
            </button>

            {/* Dropdown Menu */}
            {open && (
              <div
                className="absolute right-0 mt-4 w-72 rounded-2xl backdrop-blur-xl bg-[#0f0f0f] border border-gray-700/40 shadow-2xl z-50 overflow-hidden"
              >
                {/* User Info Header */}
                <div className="px-6 py-5 border-b border-gray-700/30 bg-[#1a1a1a]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-bold text-xl border border-gray-600/30 shadow-lg">
                      {firstLetter}
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* <p className="text-xs text-gray-500 uppercase">Account</p> */}
                      <p className="text-xl text-white font-semibold truncate text-sm mt-1">
                        {user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-3 space-y-1 px-2">
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/user/profile");
                    }}
                    className="w-full text-left px-4 py-3 text-gray-200 rounded-lg hover:bg-gray-700/40 hover:text-gray-100 transition-all duration-200 text-md font-medium"
                  >
                    Profile
                  </button>

                  {/* <button
                    onClick={() => {
                      setOpen(false);
                      navigate("settings");
                    }}
                    className="w-full text-left px-4 py-3 text-gray-200 rounded-lg hover:bg-gray-700/40 hover:text-gray-100 transition-all duration-200 text-sm font-medium"
                  >
                    Settings
                  </button> */}

                  {/* <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/admin");
                    }}
                    className="w-full text-left px-4 py-3 text-gray-200 rounded-lg hover:bg-gray-700/40 hover:text-gray-100 transition-all duration-200 text-sm font-medium"
                  >
                    Admin Panel
                  </button> */}
{/* 
                  <button
                    onClick={() => navigate("/problems")}
                    className="w-full text-left px-4 py-3 text-gray-200 rounded-lg hover:bg-gray-700/40 hover:text-gray-100 transition-all duration-200 text-sm font-medium"
                  >
                    Explore Problems
                  </button> */}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700/30" />

                {/* Logout Button */}
                <div className="px-2 py-3">
                  <button
                    onClick={() => {
                      setOpen(false);
                      dispatch(logout());
                    }}
                    className="w-full text-left px-4 py-3 text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 text-md font-medium border border-red-500/20 hover:border-red-500/40"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

function BigCard({ title, subtitle, desc, onClick, accent }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-gradient-to-br ${accent} border border-gray-800 rounded-2xl p-6 hover:scale-[1.01] transition-transform`}
    >
      <div className="space-y-3">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-indigo-300 font-medium">{subtitle}</p>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
