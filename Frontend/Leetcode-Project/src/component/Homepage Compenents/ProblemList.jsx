import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProblems, getSolvedProblems } from "../../utils/problemSlice";

const Tag = ({ children, colorClass, size = "sm" }) => (
  <span
    className={`px-3 py-0.5 text-xs font-medium rounded-full ${colorClass} ${
      size === "lg" ? "text-sm" : "text-xs"
    }`}
  >
    {children}
  </span>
);

const SingleProblemCard = ({  problem, solvedProblemIds }) => {
  const isSolved = solvedProblemIds.has(problem._id);
  const difficulty = problem.difficulty;
  const tags = problem.tags || [];


  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case "easy":
        return "bg-green-600 text-green-50 border border-green-700";
      case "medium":
        return "bg-yellow-600 text-yellow-50 border border-yellow-700";
      case "hard":
        return "bg-red-600 text-red-50 border border-red-700";
      default:
        return "bg-gray-500 text-gray-50 border border-gray-600";
    }
  };

  const solvedColor = isSolved
    ? "bg-indigo-700 text-white"
    : "bg-gray-500 text-gray-200";

  const solvedText = isSolved ? "Solved" : "Unsolved";

  return (
    <div
      className="
      p-5 
      bg-gray-800 
      rounded-xl 
      shadow-lg 
      hover:shadow-indigo-500/20 
      hover:bg-gray-700 
      transition 
      duration-300 
      transform 
      hover:scale-[1.01]
      flex flex-col space-y-3
      cursor-pointer
    "
    >
      <div className="flex justify-between items-start">
        <h2 className="font-extrabold text-xl text-white truncate pr-4">
          {problem.title || "Untitled Problem"}
        </h2>

        <Tag colorClass={solvedColor}>{solvedText}</Tag>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Tag colorClass={getDifficultyColor(difficulty)}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Tag>

        {tags.map((tag, index) => (
          <Tag key={index} colorClass="bg-gray-600 text-gray-200">
            {tag}
          </Tag>
        ))}
        {tags.length > 3 && (
          <span className="text-xs text-gray-400">+{tags.length - 3} more</span>
        )}
      </div>

      <div className="pt-2">
        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition duration-150">
          View Problem &rarr;
        </button>
      </div>
    </div>
  );
};

function ProblemList() {
  const { user } = useSelector((state) => state.auth);
  const { allProblems, solvedProblems,loading } = useSelector(
    (state) => state.problemSlice
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProblems());
    dispatch(getSolvedProblems());
  }, [user, dispatch]);

  const solvedProblemIds = new Set((solvedProblems || []).map((p) => p._id));

  

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-900 text-white">
        <div className="flex space-x-2 p-5">
          <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce delay-300"></div>
        </div>
        <p className="mt-4 text-gray-400">Loading problems list...</p>
      </div>
    );
  }

  if (!allProblems || allProblems.length === 0) {
    return (
      <div className="p-10 text-center bg-gray-900 min-h-screen">
        <p className="text-xl text-gray-400">
          No coding problems are available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-extrabold text-white mb-8 mt-10 border-b border-gray-700 pb-3">
        Problems
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allProblems.map((problem) => (
          <SingleProblemCard
            key={problem._id}
            problem={problem}
            solvedProblemIds={solvedProblemIds}
          />
        ))}
      </div>
    </div>
  );
}

export default ProblemList;
