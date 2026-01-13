import * as z from "zod";

export const SUPPORTED_LANGUAGES = [
  "C++",
  "Java",
  "Python",
  "JavaScript",
];

export const TAGS = [
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

// reusable blocks
const testCaseVisibleSchema = z.object({
  stdin: z.string().min(1, "Input is required"),
  expected_output: z.string().min(1, "Expected output is required"),
  explanation: z.string().min(1, "Explanation is required"),
});

const testCaseHiddenSchema = z.object({
  stdin: z.string().min(1),
  expected_output: z.string().min(1),
});

const codeSchema = z.object({
  language: z.enum(SUPPORTED_LANGUAGES),
  code: z.string().min(1, "Code is required"),
});

const referenceSchema = z.object({
  language: z.enum(SUPPORTED_LANGUAGES),
  source_code: z.string().min(1, "Reference solution required"),
});

export const problemSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20),

  difficulty: z.enum(["Easy", "Medium", "Hard"]),

  tags: z
    .array(z.enum(TAGS))
    .min(1, "At least one tag required")
    .max(5, "You can select at most 5 tags"),

  constraints: z
    .array(z.string().min(1))
    .min(1, "At least one constraint is required"),

  visibleTestCases: z
    .array(testCaseVisibleSchema)
    .min(1, "At least one visible test case required"),

  hiddenTestCases: z
    .array(testCaseHiddenSchema)
    .min(1, "At least one hidden test case required"),

  boilerplateCode: z
    .array(codeSchema)
    .length(SUPPORTED_LANGUAGES.length),

  referenceSolution: z
    .array(referenceSchema)
    .length(SUPPORTED_LANGUAGES.length),
});


