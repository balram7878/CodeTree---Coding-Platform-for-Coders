const submission_model = require("../../models/Submission.model");
const problem_model = require("../../models/Problem.model");
const { statuses } = require("../../utils/judge.0");
const {
  createBatchedSubmission,
  getBatchedSubmission,
  getLanguageId,
} = require("../../utils/judge.0");

const submit = async (req, res) => {
  try {
    //  console.log(req.user);
    const userId = req.user.sub;
    const problemId = req.params.id;

    if (!userId) return res.status(404).json({ message: "user not exist" });
    if (!problemId)
      return res.status(404).json({ message: "problem not exist" });

    const { code, language } = req.body;

    if (!code || !language)
      return res.status(404).json({ message: "incorrect solution" });

    const problem = await problem_model.findById(problemId);
    if (!problem) return res.status(404).json({ message: "problem not found" });

    const { hiddenTestCases } = problem;

    const solution = await submission_model.create({
      userId,
      problemId,
      code,
      language,
      status: "Pending",
      totalTestCases: hiddenTestCases.length,
    });

    const language_id = getLanguageId(language);
    const submissions = [];
    for (let { stdin, expected_output } of hiddenTestCases) {
      submissions.push({
        language_id,
        source_code: code.trim(),
        stdin,
        expected_output,
      });
    }

    const submissionTokens = await createBatchedSubmission(submissions);
    const tokens = submissionTokens.map((e) => e.token);
    const tokenString = tokens.join(",");
    const finalResult = await getBatchedSubmission(tokenString);
    // console.log(finalResult);
    let totalTime = 0;
    let totalMemory = 0;
    let overallStatus = "Accepted";
    let passedCount = 0;
    let overallErrorMessage = null;
    let firstErrorStatusId = null;

    for (let submission of finalResult.submissions) {
      const { status_id, time, memory, stderr } = submission;
      if (status_id !== 3) {
        if (overallStatus === "Accepted") {
          overallStatus = "Error";
          overallErrorMessage = stderr;
          firstErrorStatusId = status_id;
        }
        continue;
      }
      passedCount++;
      totalTime += parseFloat(time);
      totalMemory = Math.max(totalMemory, memory);
    }
   
    solution.status = overallStatus;
    solution.memory = totalMemory;
    solution.runtime = totalTime;
    solution.totalTestCasesPassed = passedCount;
    solution.errorMessage = overallErrorMessage;
    await solution.save();

    if (overallStatus === "Accepted") {
      return res.status(200).json({
        message: "Submission accepted!",
        status: overallStatus,
        passed: passedCount,
      });
    } else {
      return res.status(200).json({
        message: "Submission failed",
        status: overallStatus,
        passed: passedCount,
        error: overallErrorMessage,
        stderr: statuses[firstErrorStatusId],
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const run = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submit, run };
