import { useNavigate,useSearchParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../utils/authSlice";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const onClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const [view, setView] = useState("none");
// console.log(user)
  const firstLetter = user?.name ? user.name[0].toUpperCase() : "A";

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 flex flex-col">
      {/* HEADER */}
      <header className="bg-[#161616] border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">CodeTree</h1>
        <div className="relative group">
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-11 h-11 rounded-full bg-gray-600 text-white font-bold flex items-center justify-center shadow-lg hover:bg-black transition"
          >
            {firstLetter}
          </button>
          {open && (
            <div
              className="absolute right-0 mt-3 w-64 rounded-xl backdrop-blur-xl bg-black/60 border border-white/10 shadow-2xl z-50
sm:right-0 sm:w-64 xs:fixed xs:top-16 xs:right-4 xs:left-4 xs:w-auto"
            >
              <div className="px-4 py-3 border-b border-gray-800 text-sm">
                <p className="text-sm text-gray-400">Signed in as</p>
                <p className="text-white font-semibold truncate">
                  {user?.email || user?.name || "Admin"}
                </p>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/admin/profile");
                }}
                className="w-full text-left px-4 py-3 hover:bg-[#1c1c1c] text-gray-200 transition"
              >
                Profile
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/admin/settings");
                }}
                className="w-full text-left px-4 py-3 hover:bg-[#1c1c1c] text-gray-200 transition"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  setOpen((prev) => !prev);
                  navigate("/admin");
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/10 transition"
              >
                Admin Panel
              </button>

              <div className="border-t border-gray-800" />

              <button
                onClick={() => {
                  setOpen(false);
                  dispatch(logout());
                }}
                className="w-full text-left px-4 py-3 hover:bg-red-500/10 text-red-400 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section
        onClick={() => setOpen(false)}
        className="flex-1 max-w-6xl mx-auto px-6 py-12 space-y-10"
      >
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.firstName}
          </h2>
          <p className="text-gray-400 text-lg">
            You run the platform. Shape the problems. Build the future of
            CodeTree.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <BigCard
            title="Create Problem"
            subtitle="Design new challenges"
            desc="Author high quality problems with constraints, test cases and reference solutions. This is where the platform grows."
            onClick={() => navigate("/admin/create-problem")}
            accent="from-indigo-600/20 to-indigo-600/5"
          />
          <BigCard
            title="Update Problems"
            subtitle="Refine and improve"
            desc="Edit statements, improve test cases and keep problems accurate as the platform evolves."
            onClick={() => navigate("/admin/update-problem")}
            accent="from-emerald-600/20 to-emerald-600/5"
          />
          <BigCard
            title="Delete Problems"
            subtitle="Maintain quality"
            desc="Safely remove outdated or broken problems using a protected deletion workflow."
            onClick={() => navigate("/admin/delete-problem")}
            accent="from-rose-600/20 to-rose-600/5"
          />
          <BigCard
            title="All Problems"
            subtitle="Full control"
            desc="Search, sort and manage the entire problem library with pagination and filters."
            onClick={() => navigate("/admin/show-all-problems")}
            accent="from-sky-600/20 to-sky-600/5"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#161616] border-t border-gray-800 px-6 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} CodeTree. Built for builders.
      </footer>
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
