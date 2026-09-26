import React, { useState } from "react";

const questions = [
  "Have you noticed a new or unusual spot on your skin?",
  "Has an existing mole or spot changed in size, shape, or color?",
  "Does any spot itch, hurt, bleed, or develop a persistent crust?",
  "Do you have a sore or skin lesion that is not healing?"
];

const GetTested = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (index, value) => {
    setAnswers({
      ...answers,
      [index]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetForm = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const hasYes = Object.values(answers).includes("Yes");

  return (
    <div id="get-tested" className="container py-5">
      <div
        className="card shadow p-4 mx-auto"
        style={{ maxWidth: "750px" }}
      >
        <h2 className="text-center mb-3">
          Skin Health Awareness Questionnaire
        </h2>

        <p className="text-muted text-center mb-4">
          Answer these questions to learn when a skin concern may need
          professional attention.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            {questions.map((question, index) => (
              <div className="question-block" key={index}>
                <p className="question-text">
                  <strong>
                    {index + 1}. {question}
                  </strong>
                </p>

                <div className="answer-options">
                  {["Yes", "No"].map((option) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={() => handleChange(index, option)}
                        required
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button type="submit" className="btn btn-primary w-100 mt-3">
              View Guidance
            </button>
          </form>
        ) : (
          <div className="text-center mt-3">
            <h4>Your Skin Health Guidance</h4>

            {hasYes ? (
              <div className="alert alert-warning mt-3">
                <p className="mb-0">
                  You reported at least one skin concern. Consider arranging
                  an appointment with a qualified healthcare professional
                  or dermatologist for an assessment.
                </p>
              </div>
            ) : (
              <div className="alert alert-info mt-3">
                <p className="mb-0">
                  You did not report any of the concerns listed in this
                  questionnaire. Continue monitoring your skin and seek
                  professional advice if you notice any changes.
                </p>
              </div>
            )}

            <p className="text-muted mt-3">
              This questionnaire is for general awareness only. It cannot
              diagnose skin cancer or determine your personal risk.
            </p>

            <button
              className="btn btn-secondary mt-3"
              onClick={resetForm}
            >
              Retake Questionnaire
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetTested;