const { Router } = require("express");
const adminValidation = require("../../middleware/adminValidation");
const authValidation = require("../../middleware/authValidation");

const {
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  getAllProblems,
  solvedProblems,
} = require("./problem.controller");

const problemRouter = Router();

problemRouter.get("/getProblem/:id", authValidation, getProblem);
problemRouter.get("/getAllProblems", authValidation, getAllProblems);
problemRouter.get("/problemsSolved", authValidation, solvedProblems);

//-->
problemRouter.post("/create", adminValidation, createProblem); //create problem
//-->

problemRouter.put("/update/:id", adminValidation, updateProblem); //update problem
problemRouter.delete("/delete/:id", adminValidation, deleteProblem); //delete problem

module.exports = problemRouter;
