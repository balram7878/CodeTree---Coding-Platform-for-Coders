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
    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      boilerplateCode,
      referenceSolution,
      problemCreator,
    } = req.body;

    const submissions = [];

    for (const { language, source_code } of referenceSolution) {
      const language_id = getLanguageId(language);
      for (const { stdin, expected_output } of visibleTestCases) {
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
    console.log(finalSubmissionResult);
    for (let { status_id } of finalSubmissionResult.submissions) {
      if (status_id != 3) {
        return res.status(400).json({
          error: statuses[status_id] || "reference solution failed validation",
        });
      }
    }

    //store in database
    await problem_model.create({
      ...req.body,
      boilerplateCode,
      referenceSolution,
      problemCreator: req.user._id,
    });
    res.status(201).json("Problem created successfully");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProblem = async (req, res) => {
  try {
    if (!req.params.id) return res.status(404).json({ message: "id missing" });
    const deletedProblem = await problem_model.findByIdAndDelete(req.params.id);
    if (!deletedProblem)
      return res.status(404).json({ message: "problem not found" });
    res.status(200).json({ message: "problem deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message || "server error" });
  }
};

const getAllProblems = async (req, res) => {
  try {
    // const limit=0;
    // const page=0;
    // const skip=(page-1)*limit;
    // const allProblems=await problem_model.find(req.params.id).skip(skip).limit(limit);
    const allProblems = await problem_model
      .find()
      .select("_id title tags difficulty");
    res.status(200).json(allProblems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProblem = async (req, res) => {
  try {
    const _id = req.params.id;
    if (!_id) return res.status(404).json({ message: "id missing" });
    const problem = await problem_model
      .findById(_id)
      .select(
        "_id title description tags difficulty visibleTestCases boilerplateCode"
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
    const problems = await submission_model.find({ userId });
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
    if (!data)
      return res.status(404).json({ message: "no data available for update" });

    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      boilerplateCode,
      referenceSolution,
      problemCreator,
    } = data;

    if (referenceSolution) {
      const submissions = [];

      for (const { language, source_code } of referenceSolution) {
        const language_id = getLanguageId(language);
        for (const { stdin, expected_output } of visibleTestCases) {
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
      console.log(finalSubmissionResult);
      for (let { status_id } of finalSubmissionResult.submissions) {
        if (status_id != 3) {
          return res.status(400).json({
            error:
              statuses[status_id] || "reference solution failed validation",
          });
        }
      }
    }

    const problem = await problem_model.findByIdAndUpdate(_id, data, {
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
  getAllProblems,
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
