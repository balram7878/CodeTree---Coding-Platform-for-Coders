const mongoose = require("mongoose");
const validateProblem = require("../../utils/validate.problem");
const {
  getLanguageId,
  createBatchedSubmission,
  getBatchedSubmission,
  statuses,
} = require("../../utils/judge.0");
const problem_model = require("../../models/Problem.model");
const submission_model = require("../../models/Submission.model");

const createProblem = async (req, res) => {
  try {
    validateProblem(req.body);

    // sanitize and normalize inputs before using them
    const sanitize = (d) => {
      const copy = JSON.parse(JSON.stringify(d));
      if (copy.title) copy.title = copy.title.trim();
      if (copy.description) copy.description = copy.description.trim();
      if (Array.isArray(copy.tags)) copy.tags = copy.tags.map((t) => t.trim());
      if (Array.isArray(copy.visibleTestCases))
        copy.visibleTestCases = copy.visibleTestCases.map((tc) => ({
          stdin: String(tc.stdin || "").trim(),
          expected_output: String(tc.expected_output || "").trim(),
          explanation: String(tc.explanation || "").trim(),
        }));
      if (Array.isArray(copy.hiddenTestCases))
        copy.hiddenTestCases = copy.hiddenTestCases.map((tc) => ({
          stdin: String(tc.stdin || "").trim(),
          expected_output: String(tc.expected_output || "").trim(),
        }));
      if (Array.isArray(copy.referenceSolution))
        copy.referenceSolution = copy.referenceSolution.map((r) => ({
          language: r.language,
          source_code: String(r.source_code || "").trim(),
        }));
      if (Array.isArray(copy.boilerplateCode))
        copy.boilerplateCode = copy.boilerplateCode.map((b) => ({
          language: b.language,
          code: String(b.code || "").trim(),
        }));
      return copy;
    };

    const data = sanitize(req.body);

    const submissions = [];

    for (const { language, source_code } of data.referenceSolution) {
      const language_id = getLanguageId(language);

      for (const { stdin, expected_output } of data.visibleTestCases) {
        submissions.push({
          language_id,
          source_code: source_code.trim(),
          stdin,
          expected_output,
        });
      }
    }

    const submissionTokens = await createBatchedSubmission(submissions);
    const tokensArray = submissionTokens.map((e) => e.token);
    const tokensString = tokensArray.join(",");
    const finalSubmissionResult = await getBatchedSubmission(tokensString);
    for (let { status_id } of finalSubmissionResult.submissions) {
      if (status_id != 3) {
        return res.status(400).json({
          error: statuses[status_id] || "reference solution failed validation",
        });
      }
    }

    //store in database
    await problem_model.create({
      ...data,
      problemCreator: req.user._id,
    });
    res.status(201).json("Problem created successfully");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProblem = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "id missing" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "invalid id" });

    const deletedProblem = await problem_model.findByIdAndDelete(id);
    if (!deletedProblem)
      return res.status(404).json({ message: "problem not found" });
    res.status(200).json({ message: "problem deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message || "server error" });
  }
};

const ALLOWED_TAGS = [
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

const getProblems = async (req, res) => {
  try {
    let { page = 1, limit = 5, search = "", tags = "", sort = "" } = req.query;

    page = Number(page) || 1;
    limit = Math.min(Number(limit) || 5, 100);
    search = String(search || "").slice(0, 200); // prevent huge input
    tags = String(tags || "").slice(0, 200);
    sort = String(sort || "");

    const skip = (page - 1) * limit;

    // base query for search
    const orConditions = [{ title: { $regex: search, $options: "i" } }];

    if (mongoose.Types.ObjectId.isValid(search)) {
      orConditions.push({ _id: search });
    }

    const baseQuery = search ? { $or: orConditions } : {};

    // handle tags (comma separated, max 5)
    let query = { ...baseQuery };
    const tagsArr = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 5);

    if (tagsArr.length) {
      // validate tags
      for (const t of tagsArr) {
        if (!ALLOWED_TAGS.includes(t))
          return res.status(400).json({ message: `invalid tag: ${t}` });
      }
      // require problems that have all selected tags
      query.tags = { $in: tagsArr };
    }

    // difficulties sorting needs mapping to numeric rank
    const difficultySort =
      sort === "difficulty_asc" ? 1 : sort === "difficulty_desc" ? -1 : 0;

    if (difficultySort !== 0) {
      // use aggregation to sort by difficulty rank
      const rankStage = {
        $addFields: {
          difficultyRank: {
            $switch: {
              branches: [
                { case: { $eq: ["$difficulty", "Easy"] }, then: 1 },
                { case: { $eq: ["$difficulty", "Medium"] }, then: 2 },
                { case: { $eq: ["$difficulty", "Hard"] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      };

      const sortStage = {
        $sort: { difficultyRank: difficultySort, createdAt: -1 },
      };

      const projectStage = {
        $project: { _id: 1, title: 1, difficulty: 1, tags: 1, createdAt: 1,isSolved:1 },
      };

      const pipeline = [
        { $match: query },
        rankStage,
        sortStage,
        projectStage,
        { $skip: skip },
        { $limit: limit },
      ];

      const problems = await problem_model.aggregate(pipeline);
      const totalCount = await problem_model.countDocuments(query);

      res.status(200).json({
        problems,
        pagination: {
          totalPages: Math.max(1, Math.ceil(totalCount / limit)),
        },
      });
      return;
    }

    // normal sorting
    let findQuery = problem_model
      .find(query)
      .select("_id title difficulty tags createdAt isSolved");

    if (sort === "newest") findQuery = findQuery.sort({ createdAt: -1 });
    else if (sort === "oldest") findQuery = findQuery.sort({ createdAt: 1 });

    const problems = await findQuery.skip(skip).limit(limit);
    const totalCount = await problem_model.countDocuments(query);

    res.status(200).json({
      problems,
      pagination: {
        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProblem = async (req, res) => {
  try {
    const _id = req.params.id;
    if (!_id) return res.status(404).json({ message: "id missing" });
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(400).json({ message: "invalid id" });

    const problem = await problem_model
      .findById(_id)
      .select(
        "_id title description tags difficulty visibleTestCases boilerplateCode hiddenTestCases constraints referenceSolution",
      );
    if (!problem) return res.status(404).json({ message: "problem not found" });
    res.status(200).json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const solvedProblems = async (req, res) => {
  try {
    const userId = req.user.sub;
    if (!userId) return res.status(404).json({ message: "no user found" });
    const problems = await submission_model
      .find({
        userId,
        status: "Accepted",
      })
      .select("_id userId problemId code language");
    problems.push({ totalProblemsSolved: problems.length });
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProblem = async (req, res) => {
  try {
    const _id = req.params.id;
    const data = req.body;
    if (!_id) return res.status(404).json({ message: "id missing" });
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(400).json({ message: "invalid id" });
    if (!data)
      return res.status(404).json({ message: "no data available for update" });

    // sanitize incoming update data
    const sanitize = (d) => {
      const copy = JSON.parse(JSON.stringify(d));
      if (copy.title) copy.title = copy.title.trim();
      if (copy.description) copy.description = copy.description.trim();
      if (Array.isArray(copy.tags)) copy.tags = copy.tags.map((t) => t.trim());
      if (Array.isArray(copy.visibleTestCases))
        copy.visibleTestCases = copy.visibleTestCases.map((tc) => ({
          stdin: String(tc.stdin || "").trim(),
          expected_output: String(tc.expected_output || "").trim(),
          explanation: String(tc.explanation || "").trim(),
        }));
      if (Array.isArray(copy.hiddenTestCases))
        copy.hiddenTestCases = copy.hiddenTestCases.map((tc) => ({
          stdin: String(tc.stdin || "").trim(),
          expected_output: String(tc.expected_output || "").trim(),
        }));
      if (Array.isArray(copy.referenceSolution))
        copy.referenceSolution = copy.referenceSolution.map((r) => ({
          language: r.language,
          source_code: String(r.source_code || "").trim(),
        }));
      if (Array.isArray(copy.boilerplateCode))
        copy.boilerplateCode = copy.boilerplateCode.map((b) => ({
          language: b.language,
          code: String(b.code || "").trim(),
        }));
      return copy;
    };

    const sanitized = sanitize(data);

    // if a reference solution is provided, validate it against visible test cases
    if (sanitized.referenceSolution) {
      const submissions = [];

      for (const { language, source_code } of sanitized.referenceSolution) {
        const language_id = getLanguageId(language);
        for (const { stdin, expected_output } of sanitized.visibleTestCases ||
          []) {
          submissions.push({
            language_id,
            source_code: (source_code || "").trim(),
            stdin,
            expected_output,
          });
        }
      }

      const submissionTokens = await createBatchedSubmission(submissions);
      const tokensArray = submissionTokens.map((e) => e.token);
      const tokensString = tokensArray.join(",");
      const finalSubmissionResult = await getBatchedSubmission(tokensString);
      for (let { status_id } of finalSubmissionResult.submissions) {
        if (status_id != 3) {
          return res.status(400).json({
            error:
              statuses[status_id] || "reference solution failed validation",
          });
        }
      }
    }

    // run schema validators present in mongoose model
    const problem = await problem_model.findByIdAndUpdate(_id, sanitized, {
      new: true,
      runValidators: true,
    });
    if (!problem) return res.status(404).json({ message: "problem not found" });
    res.status(200).json({ message: "problem updated successfully", problem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProblem,
  deleteProblem,
  getProblems,
  getProblem,
  solvedProblems,
  updateProblem,
};

/*
{
source_code:{},
language_id:int,
stdin:[],
expected_output:[]
}

*/
