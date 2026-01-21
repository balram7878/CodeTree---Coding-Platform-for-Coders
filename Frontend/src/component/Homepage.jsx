import ProblemList from "./Homepage Pages/ProblemList";
import Header from "./Homepage Pages/Header";

export default function Homepage() {
  return (
    <>
      <div className="min-h-screen bg-[#0f0f0f] text-gray-200 flex flex-col justify-between">
        <Header />
        {/* FOOTER */}
        <footer className="bg-[#161616] border-t border-gray-800 px-6 py-4 text-center text-sm text-gray-400 ">
          © {new Date().getFullYear()} CodeTree. Built for builders.
        </footer>
      </div>
    </>
  );
}
