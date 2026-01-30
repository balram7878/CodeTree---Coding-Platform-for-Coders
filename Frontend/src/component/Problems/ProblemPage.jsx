import { useNavigate, useSearchParams } from "react-router";
import { useState, useEffect, useCallback } from "react";
import axiosClient from "../../utils/axiosClient";
import image from "../../../public/image4.jpg";

const TAGS = [
  "Array",
  "Linked List",
  "Stack",
  "Queue",
  "Tree",
  "Graph",
  "DP",
  "Greedy",
  "Math",
  "String",
];

const TOPICS = TAGS;

function Spinner({ size = 6 }) {
  return (
    <div
      className={`w-${size} h-${size} rounded-full border-4 border-t-transparent border-white animate-spin`}
    />
  );
}

export default function ProblemsPage() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4;
  const MAX_VISIBLE = 5;
  const [searchInput, setSearchInput] = useState("");
  const [selectedTags, setSelectedTags] = useState(() => {
    const tagsParam = searchParams.get("tags") || "";
    return tagsParam ? tagsParam.split(",").filter(Boolean) : [];
  });
  const [sort, setSort] = useState(() => searchParams.get("sort") || "");

  const search = searchParams.get("search") || "";

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    // debounce search input only — tags and sort changes are handled by their own handlers
    const id = setTimeout(() => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        if (searchInput.trim()) {
          params.set("search", searchInput.slice(0, 200));
        } else {
          params.delete("search");
        }

        // keep page reset when doing a new search
        params.set("page", "1");

        // preserve tags and sort while searching
        if (selectedTags.length) params.set("tags", selectedTags.join(","));
        else params.delete("tags");

        if (sort) params.set("sort", sort);
        else params.delete("sort");

        return params;
      });
    }, 500);

    return () => clearTimeout(id);
  }, [searchInput]);

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search,
        page,
        limit,
      };
      if (selectedTags.length) params.tags = selectedTags.join(",");
      if (sort) params.sort = sort;

      const res = await axiosClient.get("/problems/getProblems", {
        params,
      });
      setProblems(res.data?.problems || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(
        "Failed to load problems: " +
          (err.response?.data?.error || err.message),
      );
    } finally {
      setLoading(false);
    }
  }, [search, page, selectedTags, sort]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // keep URL in sync when page changes so browser back/forward works as expected
  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (search.trim()) params.set("search", search);
      else params.delete("search");

      if (selectedTags.length) params.set("tags", selectedTags.join(","));
      else params.delete("tags");

      if (sort) params.set("sort", sort);
      else params.delete("sort");

      if (params.get("page") !== String(page)) params.set("page", String(page));

      return params;
    });
  }, [page, selectedTags, sort]);

  // if user changes URL manually (back/forward), update internal page state
  useEffect(() => {
    const p = Number(searchParams.get("page")) || 1;
    if (p !== page) setPage(p);

    const tagsParam = searchParams.get("tags") || "";
    const parsedTags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];
    // only update selectedTags if it really changed (avoid resetting page due to new array identity)
    const sortArr = (arr) => (arr || []).slice().sort().join(",");
    if (sortArr(parsedTags) !== sortArr(selectedTags)) setSelectedTags(parsedTags);

    const s = searchParams.get("sort") || "";
    if (s !== sort) setSort(s);
  }, [searchParams]);

  const goPrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const goNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const goToPage = (pageNum) => {
    setPage(pageNum);
  };

  const startPage = Math.max(
    1,
    Math.min(page - Math.floor(MAX_VISIBLE / 2), totalPages - MAX_VISIBLE + 1),
  );

  const endPage = Math.min(totalPages, startPage + MAX_VISIBLE - 1);

  const onProblemClick = (id) => {
    navigate(`/practice/${id}`);
  };

  const toggleTopic = (t) => {
    setSelectedTags((prev) => {
      const exists = prev.includes(t);
      const next = exists ? prev.filter((x) => x !== t) : [...prev, t];
      // reset to page 1 on tag change
      setPage(1);
      return next;
    });
  };

  const clearAll = () => {
    setSearchInput("");
    setSelectedTags([]);
    setSort("");
    setPage(1);
    setSearchParams({});
  };

  const difficultyClass = (d) => {
    const dd = (d || "").toLowerCase();
    if (dd === "easy") return "bg-green-600 text-black";
    if (dd === "medium") return "bg-yellow-400 text-black";
    if (dd === "hard") return "bg-red-600 text-white";
    return "bg-gray-600";
  };

  return (
    <div className="relative min-h-screen text-gray-200">
      <style>{`@media (max-width:400px){ .problem-meta .meta-inline{display:block;margin-right:0.75rem;} .solved-indicator{margin-left:auto;margin-right:auto;} .solved-placeholder{display:block;width:0.5rem;height:0;margin-top:0.5rem;} }`}</style>
      {/* background image placeholder - replace src with your image path */}
      {/* <img
        src={image}
        alt="page background"
        className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-20"
      /> */}

      <div className="absolute inset-0 bg-[#161616]" />

      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
          {/* Topics */}
          <div className="flex justify-center  p-3 rounded-xl">
            <div className="flex flex-wrap gap-3">
              {TOPICS.map((t) => {
                const selected = selectedTags.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTopic(t)}
                    className={`px-3 py-1 rounded-lg text-md border ${
                      selected
                        ? "bg-black border border-white text-white"
                        : "bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                    }`}
                    aria-pressed={selected}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Controls */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
            <div className="flex-1 bg-[#0b0b0b]/70 border border-gray-800 rounded-xl p-2 flex items-center gap-3">
              <input
                placeholder="Search by title or problem number"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.slice(0,200))}
                className="flex-1 bg-transparent outline-none px-3 py-2 text-gray-200"
              />
              <button
                onClick={() => setSearchInput("")}
                className="text-md text-gray-400 px-3 py-1 hover:text-white"
              >
                Clear
              </button>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="bg-[#0b0b0b]/70 border border-gray-800 rounded-lg  p-2 text-gray-200 outline-none"
              >
                <option defaultChecked disabled value="">Sort</option>
                <option value="difficulty_asc">Easy → Hard</option>
                <option value="difficulty_desc">Hard → Easy</option>
                {/* <option value="newest">Newest</option>
                <option value="oldest">Oldest</option> */}
              </select>

              <button
                onClick={clearAll}
                className="bg-[#1f1f1f] border border-gray-700 px-3 py-2 rounded-lg text-gray-200 hover:bg-gray-800"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Status / messages */}
          {loading && (
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-5 h-5 animate-spin border-2 border-t-transparent rounded-full border-white/70" />
              <span>Loading problems…</span>
            </div>
          )}

          {/* selected tags */}
          {selectedTags.length > 0 && (
            <div className="flex gap-2 flex-wrap text-sm">
              {selectedTags.map((t) => (
                <div key={t} className="px-2 py-1 rounded-full bg-black text-white flex items-center gap-2">
                  <span>{t}</span>
                  <button onClick={() => toggleTopic(t)} aria-label={`remove ${t}`} className="text-white/80">✕</button>
                </div>
              ))}
            </div>
          )}

          {error && <div className="text-red-400">{error}</div>}
          {!loading && problems.length === 0 && (
            <div className="text-gray-400">No problems found</div>
          )}

          {/* List */}
          <div className="flex gap-4 flex-col">
            {problems.map((problem, index) => (
              <div
                key={problem._id}
                onClick={() => onProblemClick(problem._id)}
                className="cursor-pointer relative bg-[#0b0b0b]/60 border border-gray-800 rounded-xl p-5 hover:scale-[1.01] transition-transform"
              >
                <div className="flex items-start gap-4">
                  {/* Left-side solved indicator (only shown when solved) */}
                  {problem.isSolved ? (
                    <div className="flex-shrink-0 mt-3 solved-indicator">
                      <div className="w-8 h-8 -ml-2 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172l-3.293-3.293A1 1 0 003.293 9.293l4 4a1 1 0 001.414 0l8-8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-2 solved-placeholder" />
                  )}

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold">
                          {(page - 1) * limit + index + 1}. {problem.title}
                        </h2>
                        <div className="text-sm text-gray-400 mt-2 problem-meta">
                          <span className="mr-3 meta-inline">
                            ID: {problem._id}
                          </span>
                          <span className="mr-3 meta-inline">
                            Tags: {(problem.tags || []).slice(0, 4).join(", ")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-3 md:mt-0">
                        <span
                          className={`px-2 py-1 rounded-lg text-sm text-white text-center  ${difficultyClass(problem.difficulty || "Easy")}`}
                        >
                          {problem.difficulty || "Easy"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 p-5 m-10">
            <button
              onClick={goPrev}
              disabled={page === 1}
              className={`px-3 py-1 rounded-lg border ${
                page === 1
                  ? "border-gray-700 text-gray-600 cursor-not-allowed"
                  : "border-gray-600 hover:bg-gray-800"
              }`}
            >
              Prev
            </button>

            {startPage > 1 && <span className="px-2 text-gray-500">…</span>}

            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i,
            ).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`px-3 py-1 rounded-lg border ${
                  p === page
                    ? "bg-white/5 border-white/30 text-white font-semibold"
                    : "border-gray-600 hover:bg-gray-800"
                }`}
              >
                {p}
              </button>
            ))}

            {endPage < totalPages && (
              <span className="px-2 text-gray-500">…</span>
            )}

            <button
              onClick={goNext}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-lg border ${
                page === totalPages
                  ? "border-gray-700 text-gray-600 cursor-not-allowed"
                  : "border-gray-600 hover:bg-gray-800"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-[#161616] border-t border-gray-800 px-6 py-4 text-center text-sm  text-gray-400 z-10 absolute bottom-0 w-full">
        © {new Date().getFullYear()} CodeTree. Built for coders.
      </footer>
    </div>
  );
}
