const { Schema, model, default: mongoose } = require("mongoose");

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Hard", "Medium", "Easy"],
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    visibleTestCases: [
      {
        stdin: {
          type: String,
          required: true,
        },
        expected_output: {
          type: String,
          required: true,
        },
        explanation: {
          type: String,
          required: true,
        },
      },
    ],
    hiddenTestCases: [
      {
        stdin: {
          type: String,
          required: true,
        },
        expected_output: {
          type: String,
          required: true,
        },
      },
    ],
    boilerplateCode: [
      {
        language: {
          type: String,
          required: true,
          enum: ["C++", "Java", "Python", "JavaScript", "Rust", "C"],
        },
        code: {
          type: String,
          required: true,
        },
      },
    ],
    referenceSolution: [
      {
        language: {
          type: String,
          required: true,
          enum: ["C++", "Java", "Python", "JavaScript", "Rust", "C"],
        },
        source_code: {
          type: String,
          required: true,
        },
      },
    ],
    problemCreator: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      unique: true,
    },
    constraints: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Problem = model("Problem", problemSchema);

module.exports = Problem;
