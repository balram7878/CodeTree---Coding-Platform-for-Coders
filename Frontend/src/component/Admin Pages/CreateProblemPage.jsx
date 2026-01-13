import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  problemSchema,
  SUPPORTED_LANGUAGES,
  TAGS,
} from "./schema/problemSchema";
import axiosClient from "../../utils/axiosClient";

export default function CreateProblem() {
  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "Easy",
      tags: [],
      constraints: [""],
      visibleTestCases: [{ stdin: "", expected_output: "", explanation: "" }],
      hiddenTestCases: [{ stdin: "", expected_output: "" }],
      boilerplateCode: SUPPORTED_LANGUAGES.map((lang) => ({
        language: lang,
        code: "",
      })),
      referenceSolution: SUPPORTED_LANGUAGES.map((lang) => ({
        language: lang,
        source_code: "",
      })),
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = form;

  const visibleTC = useFieldArray({ control, name: "visibleTestCases" });
  const hiddenTC = useFieldArray({ control, name: "hiddenTestCases" });
  const constraints = useFieldArray({ control, name: "constraints" });

  const submitProblem = async (payload) => {
    let res = await axiosClient.post("/problems/create", payload);
    return res.data;
  };

  const onSubmit = async (data) => {
    try {
      const res = await submitProblem(data);
      console.log("Problem created:", res);
      // optional UX
      alert("Problem created successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to create problem");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 p-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-5xl mx-auto space-y-10"
      >
        {/* HEADER */}
        <h1 className="text-3xl font-bold tracking-wide">Create New Problem</h1>

        {/* BASIC INFO */}
        <section className="bg-[#161616] p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>

          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              {...register("title")}
              className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg p-2"
            />
            <p className="text-red-500 text-sm">{errors.title?.message}</p>
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              rows={4}
              {...register("description")}
              className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg p-2"
            />
            <p className="text-red-500 text-sm">
              {errors.description?.message}
            </p>
          </div>

          <div>
            <label className="block text-sm mb-1">Difficulty</label>
            <select
              {...register("difficulty")}
              className="bg-[#0f0f0f] border border-gray-700 rounded-lg p-2"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          {/* TAGS */}
          <div>
            <label className="block text-sm mb-2">Tags (max 5)</label>

            <div className="flex flex-wrap gap-3 border-1 border-gray-700 p-4 rounded-lg space-y-1">
              {TAGS.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={tag}
                    {...register("tags")}
                    className="accent-indigo-500"
                  />
                  {tag}
                </label>
              ))}
            </div>

            <p className="text-red-500 text-sm mt-1">{errors.tags?.message}</p>
          </div>
        </section>

        {/* CONSTRAINTS */}
        <section className="bg-[#161616] p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold">Constraints</h2>

          {constraints.fields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...register(`constraints.${i}`)}
                className="flex-1 bg-[#0f0f0f] border border-gray-700 rounded-lg p-2"
                placeholder="e.g. 1 ≤ n ≤ 10^5"
              />

              {constraints.fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => constraints.remove(i)}
                  className="text-red-400 hover:text-red-500"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <p className="text-red-500 text-sm">{errors.constraints?.message}</p>

          <button
            type="button"
            onClick={() => constraints.append("")}
            className="text-sm text-blue-400 hover:underline"
          >
            + Add constraint
          </button>
        </section>

        {/* VISIBLE TEST CASES */}
        <section className="bg-[#161616] p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-semibold">Visible Test Cases</h2>

          {visibleTC.fields.map((field, i) => (
            <div
              key={field.id}
              className="border border-gray-700 p-4 rounded-lg space-y-2 relative"
            >
              {visibleTC.fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => visibleTC.remove(i)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-500"
                >
                  ✕
                </button>
              )}

              <textarea
                {...register(`visibleTestCases.${i}.stdin`)}
                placeholder="stdin"
                className="w-full bg-[#0f0f0f] p-2 rounded"
              />
              <textarea
                {...register(`visibleTestCases.${i}.expected_output`)}
                placeholder="expected output"
                className="w-full bg-[#0f0f0f] p-2 rounded"
              />
              <textarea
                {...register(`visibleTestCases.${i}.explanation`)}
                placeholder="explanation"
                className="w-full bg-[#0f0f0f] p-2 rounded"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              visibleTC.append({
                stdin: "",
                expected_output: "",
                explanation: "",
              })
            }
            className="text-sm text-blue-400 hover:underline"
          >
            + Add visible test case
          </button>
        </section>

        {/* HIDDEN TEST CASES */}
        {/* HIDDEN TEST CASES */}
        <section className="bg-[#161616] p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-semibold">Hidden Test Cases</h2>

          {hiddenTC.fields.map((field, i) => (
            <div key={field.id} className="relative space-y-2">
              {hiddenTC.fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => hiddenTC.remove(i)}
                  className="absolute top-0 right-0 text-red-400 hover:text-red-500"
                >
                  ✕
                </button>
              )}

              <textarea
                {...register(`hiddenTestCases.${i}.stdin`)}
                placeholder="stdin"
                className="w-full bg-[#0f0f0f] p-2 rounded"
              />
              <textarea
                {...register(`hiddenTestCases.${i}.expected_output`)}
                placeholder="expected output"
                className="w-full bg-[#0f0f0f] p-2 rounded"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => hiddenTC.append({ stdin: "", expected_output: "" })}
            className="text-sm text-blue-400 hover:underline"
          >
            + Add hidden test case
          </button>
        </section>

        {/* BOILERPLATE */}
        <section className="bg-[#161616] p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-semibold">Boilerplate Code</h2>

          {SUPPORTED_LANGUAGES.map((lang, i) => (
            <div key={lang}>
              <h3 className="text-sm font-semibold mb-1">{lang}</h3>
              <textarea
                rows={4}
                {...register(`boilerplateCode.${i}.code`)}
                className="w-full bg-[#0f0f0f] p-2 rounded"
              />
            </div>
          ))}
        </section>

        {/* REFERENCE SOLUTIONS */}
        <section className="bg-[#161616] p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-semibold">
            Reference Solutions (Required)
          </h2>

          {SUPPORTED_LANGUAGES.map((lang, i) => (
            <div key={lang}>
              <h3 className="text-sm font-semibold mb-1">{lang}</h3>
              <textarea
                rows={4}
                {...register(`referenceSolution.${i}.source_code`)}
                className="w-full bg-[#0f0f0f] p-2 rounded"
              />
            </div>
          ))}
        </section>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold hover:opacity-90 transition"
        >
          Create Problem
        </button>
      </form>
    </div>
  );
}
