const SUPPORTED_LANGUAGES = ["C++", "Java", "Python", "JavaScript"];
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

const validateProblem = (problem) => {
  if (!problem || typeof problem !== "object") throw new Error("invalid problem payload");

  const mandatoryFields = [
    "title",
    "description",
    "difficulty",
    "tags",
    "visibleTestCases",
    "hiddenTestCases",
    "boilerplateCode",
    "referenceSolution",
  ];

  const hasAll = mandatoryFields.every((f) => Object.prototype.hasOwnProperty.call(problem, f));
  if (!hasAll) throw new Error("mandatory fields are missing");

  const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, boilerplateCode, referenceSolution, constraints } = problem;

  if (typeof title !== "string" || title.trim().length < 5 || title.trim().length > 150)
    throw new Error("title must be a string between 5 and 150 characters");

  if (typeof description !== "string" || description.trim().length < 20)
    throw new Error("description must be at least 20 characters");

  if (!["Easy", "Medium", "Hard"].includes(difficulty)) throw new Error("invalid difficulty");

  if (!Array.isArray(tags) || tags.length < 1 || tags.length > 10)
    throw new Error("tags must be an array with 1 to 10 items");

  for (const t of tags) if (!TAGS.includes(t)) throw new Error("invalid tag: " + t);

  if (!Array.isArray(constraints) || constraints.length < 1 || constraints.length > 20)
    throw new Error("constraints must be an array with 1 to 20 items");

  if (!Array.isArray(visibleTestCases) || visibleTestCases.length < 1 || visibleTestCases.length > 50)
    throw new Error("visibleTestCases must be an array with 1 to 50 items");

  for (const tc of visibleTestCases) {
    if (typeof tc.stdin !== "string" || tc.stdin.trim().length === 0) throw new Error("visible test case stdin is required");
    if (typeof tc.expected_output !== "string" || tc.expected_output.trim().length === 0) throw new Error("visible test case expected_output is required");
    if (typeof tc.explanation !== "string" || tc.explanation.trim().length === 0) throw new Error("visible test case explanation is required");
  }

  if (!Array.isArray(hiddenTestCases) || hiddenTestCases.length < 1 || hiddenTestCases.length > 200)
    throw new Error("hiddenTestCases must be an array with 1 to 200 items");

  for (const tc of hiddenTestCases) {
    if (typeof tc.stdin !== "string" || tc.stdin.trim().length === 0) throw new Error("hidden test case stdin is required");
    if (typeof tc.expected_output !== "string" || tc.expected_output.trim().length === 0) throw new Error("hidden test case expected_output is required");
  }

  if (!Array.isArray(boilerplateCode) || boilerplateCode.length !== SUPPORTED_LANGUAGES.length) throw new Error("boilerplateCode must include all supported languages");
  for (const b of boilerplateCode) {
    if (!SUPPORTED_LANGUAGES.includes(b.language)) throw new Error("invalid boilerplate language: " + b.language);
    if (typeof b.code !== "string") throw new Error("boilerplate code must be a string");
  }

  if (!Array.isArray(referenceSolution) || referenceSolution.length !== SUPPORTED_LANGUAGES.length) throw new Error("referenceSolution must include all supported languages");
  for (const r of referenceSolution) {
    if (!SUPPORTED_LANGUAGES.includes(r.language)) throw new Error("invalid reference language: " + r.language);
    if (typeof r.source_code !== "string" || r.source_code.trim().length === 0) throw new Error("reference solution source_code is required");
  }
};

module.exports = validateProblem;