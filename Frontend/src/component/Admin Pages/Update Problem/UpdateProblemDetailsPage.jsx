import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "../../../utils/axiosClient";
import { problemSchema, SUPPORTED_LANGUAGES } from "../schema/problemSchema";

export default function UpdateProblemDetailPage() {
  const { id } = useParams();
  // console.log(id);
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  // Field arrays
  const constraints = useFieldArray({ control, name: "constraints" });
  const visibleTC = useFieldArray({ control, name: "visibleTestCases" });
  const hiddenTC = useFieldArray({ control, name: "hiddenTestCases" });

  // Fetch problem by id
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`problems/getProblem/${id}`);
        console.log(res.data);
        setInitialData(res.data);
        reset(res.data);
        // pre-fill form
      } catch (err) {
        setError("Failed to load problem", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, reset]);

  const sanitize = (data) => {
    // create a deep copy and trim strings
    const d = JSON.parse(JSON.stringify(data));
    if (d.title) d.title = d.title.trim();
    if (d.description) d.description = d.description.trim();
    if (Array.isArray(d.tags)) d.tags = d.tags.map((t) => t.trim());
    if (Array.isArray(d.constraints)) d.constraints = d.constraints.map((c) => c.trim()).filter(Boolean);

    if (Array.isArray(d.visibleTestCases)) {
      d.visibleTestCases = d.visibleTestCases
        .map((tc) => ({
          stdin: (tc.stdin || "").trim(),
          expected_output: (tc.expected_output || "").trim(),
          explanation: (tc.explanation || "").trim(),
        }))
        .filter((tc) => tc.stdin && tc.expected_output);
    }

    if (Array.isArray(d.hiddenTestCases)) {
      d.hiddenTestCases = d.hiddenTestCases
        .map((tc) => ({
          stdin: (tc.stdin || "").trim(),
          expected_output: (tc.expected_output || "").trim(),
        }))
        .filter((tc) => tc.stdin && tc.expected_output);
    }

    if (Array.isArray(d.boilerplateCode)) {
      d.boilerplateCode = d.boilerplateCode.map((b) => ({
        language: b.language,
        code: (b.code || "").trim(),
      }));
    }

    if (Array.isArray(d.referenceSolution)) {
      d.referenceSolution = d.referenceSolution.map((r) => ({
        language: r.language,
        source_code: (r.source_code || "").trim(),
      }));
    }

    return d;
  };

  const onSubmit = async (currentData) => {
    if (!initialData) return;

    const normalizedCurrent = sanitize(currentData);
    const normalizedInitial = sanitize(initialData);

    const payload = getUpdatePayload(normalizedInitial, normalizedCurrent);

    if (Object.keys(payload).length === 0) {
      setError("No changes detected");
      return;
    }

    try {
      setSaving(true);
      await axiosClient.put(`problems/update/${id}`, payload);
      // go back one step in history (works with browser history and preserved query params)
      window.history.back();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to update problem");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-gray-400">
        Loading problem...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // show form-level errors near the top
  // (errors from zod are shown next to fields)
  
  
  // console logs removed for cleanliness
  


  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 p-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-5xl mx-auto space-y-10"
      >
        {error && (
          <div className="bg-red-900/40 text-red-300 p-3 rounded">{error}</div>
        )}
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-wide">Update Problem</h1>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-sm text-gray-400 hover:text-gray-200"
          >
            ← Back
          </button>
        </div>

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
        </section>

        {/* CONSTRAINTS */}
        <section className="bg-[#161616] p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold">Constraints</h2>

          {constraints.fields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...register(`constraints.${i}`)}
                className="flex-1 bg-[#0f0f0f] border border-gray-700 rounded-lg p-2"
              />
              <p className="text-red-500 text-sm">
                {errors.constraints?.message}
              </p>
              <button
                type="button"
                onClick={() => constraints.remove(i)}
                className="text-red-400 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

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
              className="border border-gray-700 p-4 rounded-lg space-y-2"
            >
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

              <button
                type="button"
                onClick={() => visibleTC.remove(i)}
                className="text-red-400 text-sm"
              >
                Remove test case
              </button>
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
        <section className="bg-[#161616] p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-semibold">Hidden Test Cases</h2>

          {hiddenTC.fields.map((field, i) => (
            <div key={field.id} className="space-y-2">
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

              <button
                type="button"
                onClick={() => hiddenTC.remove(i)}
                className="text-red-400 text-sm"
              >
                Remove test case
              </button>
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
              <input
                type="hidden"
                value={lang}
                {...register(`boilerplateCode.${i}.language`)}
              />

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
          <h2 className="text-xl font-semibold">Reference Solutions</h2>

          {SUPPORTED_LANGUAGES.map((lang, i) => (
            <div key={lang}>
              <h3 className="text-sm font-semibold mb-1">{lang}</h3>
              <input
                type="hidden"
                value={lang}
                {...register(`referenceSolution.${i}.language`)}
              />
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
          disabled={saving}
          className="w-full py-3 rounded-xl bg-[#141414] border border-gray-700 text-gray-200 font-semibold cursor-pointer hover:bg-[#1e1e1e] transition disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Problem"}
        </button>
      </form>
    </div>
  );
}

/* ---------- diff helper ---------- */

function getUpdatePayload(initial, current) {
  const payload = {};

  if (initial.title !== current.title) payload.title = current.title;

  if (initial.description !== current.description)
    payload.description = current.description;

  if (initial.difficulty !== current.difficulty)
    payload.difficulty = current.difficulty;

  if (JSON.stringify(initial.tags) !== JSON.stringify(current.tags))
    payload.tags = current.tags;

  if (
    JSON.stringify(initial.constraints) !== JSON.stringify(current.constraints)
  )
    payload.constraints = current.constraints;

  if (
    JSON.stringify(initial.visibleTestCases) !==
    JSON.stringify(current.visibleTestCases)
  )
    payload.visibleTestCases = current.visibleTestCases;

  if (
    JSON.stringify(initial.hiddenTestCases) !==
    JSON.stringify(current.hiddenTestCases)
  )
    payload.hiddenTestCases = current.hiddenTestCases;

  if (
    JSON.stringify(initial.boilerplateCode) !==
    JSON.stringify(current.boilerplateCode)
  )
    payload.boilerplateCode = current.boilerplateCode;

  if (
    JSON.stringify(initial.referenceSolution) !==
    JSON.stringify(current.referenceSolution)
  )
    payload.referenceSolution = current.referenceSolution;
  console.log("payload");
  return payload;
}
