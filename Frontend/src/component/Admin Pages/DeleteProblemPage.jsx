import { useEffect, useState,useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import axiosClient from "../../utils/axiosClient";
export default function DeleteProblemPage() {
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
 

  const search = searchParams.get("search") || "";

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const id = setTimeout(() => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        if (searchInput.trim()) {
          params.set("search", searchInput);
        } else {
          params.delete("search");
        }

        params.set("page", "1");
        return params;
      });
    }, 500);

    return () => clearTimeout(id);
  }, [searchInput]);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    problem: null,
    confirm: "",
  });

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/problems/getProblems", {
        params: {
          search,
          page,
          limit,
        },
      });
      setProblems(res.data?.problems || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(
        "Failed to load problems: " + (err.response?.data?.error || err.message),
      );
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (search.trim()) params.set("search", search);
      else params.delete("search");

      if (params.get("page") !== String(page)) params.set("page", String(page));

      return params;
    });
  }, [page]);

  useEffect(() => {
    const p = Number(searchParams.get("page")) || 1;
    if (p !== page) setPage(p);
  }, [searchParams]);

  const confirmDelete = async (problemId) => {
    if (!deleteModal.problem) return setError("No problem selected");
    if (deleteModal.confirm !== deleteModal.problem.title)
      return setError("Confirmation text does not match problem title");

    try {
      await axiosClient.delete(`problems/delete/${deleteModal.problem._id}`);
      setDeleteModal({ open: false, problem: null, confirm: "" });
      fetchProblems();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to delete");
    }
  };

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

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-wide">Admin Problem Manager</h1>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-sm text-gray-400 hover:text-gray-200"
          >
            ← Back
          </button>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 bg-[#161616] p-4 rounded-xl border border-gray-800">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value.slice(0, 200))}
            placeholder="Search problems..."
            className="flex-1 bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2 outline-none"
          />
        </div>

        {loading && <p className="text-gray-400">Loading problems…</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* LIST */}
        <div className="space-y-4">
          {problems.map((p, i) => (
            <div
              key={p._id}
              className="bg-[#161616] border border-gray-800 rounded-xl p-5 hover:bg-[#1a1a1a] transition"
            >
              <h2 className="text-lg font-semibold">
                {(page - 1) * limit + i + 1}. {p.title}
              </h2>

              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-md text-gray-400">
                <span>ID: {p._id}</span>
                <span>Difficulty: {p.difficulty}</span>
                <span>Tags: {(p.tags || []).slice(0, 4).join(", ")}</span>
                <span>
                  Created: {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => navigate(`/admin/problem/${p._id}/edit`)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-md  cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    setDeleteModal({ open: true, problem: p, confirm: "" })
                  }
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-md cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2 pt-6">
          {/* PREV */}
          <button
            onClick={goPrev}
            disabled={page === 1}
            className={`px-3 py-1 rounded-lg border ${
              page === 1
                ? "border-gray-700 text-gray-600 cursor-not-allowed"
                : "border-gray-600 hover:bg-gray-800 cursor-pointer"
            }`}
          >
            Prev
          </button>

          {/* LEFT ELLIPSIS */}
          {startPage > 1 && <span className="px-2 text-gray-500">…</span>}

          {/* PAGE NUMBERS */}
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i,
          ).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`px-3 py-1 rounded-lg border cursor-pointer ${
                p === page
                  ? "bg-black border-1 border-gray-400 text-white font-semibold"
                  : "border-gray-600 hover:bg-gray-800"
              }`}
            >
              {p}
            </button>
          ))}

          {/* RIGHT ELLIPSIS */}
          {endPage < totalPages && (
            <span className="px-2 text-gray-500">…</span>
          )}

          {/* NEXT */}
          <button
            onClick={goNext}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded-lg border ${
              page === totalPages
                ? "border-gray-700 text-gray-600 cursor-not-allowed"
                : "border-gray-600 hover:bg-gray-800 cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* DELETE MODAL */}

      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-[#161616] p-6 rounded-xl w-full max-w-md space-y-4 border border-gray-700">
            <h2 className="text-xl font-bold text-red-400">Delete Problem</h2>
            <p>
              Type <b>{deleteModal.problem?.title || ""}</b> to confirm deletion.
            </p>
            <input
              value={deleteModal.confirm}
              onChange={(e) =>
                setDeleteModal({ ...deleteModal, confirm: e.target.value })
              }
              className="w-full bg-[#0f0f0f] border border-gray-700 rounded p-2"
            />
            <div className="flex justify-end gap-3 ">
              <button
                onClick={() =>
                  setDeleteModal({ open: false, problem: null, confirm: "" })
                }
                className="cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={!deleteModal.problem || deleteModal.confirm !== (deleteModal.problem?.title || "")}
                className="bg-red-600 px-4 py-1.5 rounded disabled:opacity-40"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
