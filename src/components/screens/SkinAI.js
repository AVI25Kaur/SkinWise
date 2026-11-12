import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./skin-ai.css";

const questions = [
  { key: "changing", title: "Has the spot changed in size, shape, colour, or texture recently?", options: [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] },
  { key: "asymmetry", title: "Does one half look different from the other (Asymmetry)?", options: [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] },
  { key: "border", title: "Are the edges irregular, blurred, or notched?", options: [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] },
  { key: "colour", title: "Does it have multiple colours or an uneven colour pattern?", options: [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] },
  { key: "diameter", title: "Is it larger than about 6 mm (roughly a pencil eraser)?", options: [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] },
  { key: "evolving", title: "Is it evolving, bleeding, crusting, or not healing?", options: [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] },
  { key: "history", title: "Have you had skin cancer or a precancerous lesion before?", options: [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] },
  { key: "family", title: "Does a close family member have a history of melanoma?", options: [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] },
  { key: "sunburn", title: "Have you had frequent intense sun exposure or blistering sunburns?", options: [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] },
  { key: "immunosuppressed", title: "Do you have a weakened immune system or take immune-suppressing medicines?", options: [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] },
];

const adviceFor = (answers) => {
  const unanswered = questions.filter(
    (question) => !answers[question.key]
  );

  if (unanswered.length > 0) {
    return {
      level: "Complete the questionnaire",
      tone: "caution",
      text: `You have answered ${
        questions.length - unanswered.length
      } out of ${questions.length} questions. Please answer all questions to receive your questionnaire review.`,
      answeredCount: questions.length - unanswered.length,
      totalQuestions: questions.length,
      positiveAnswers: [],
      uncertainAnswers: [],
    };
  }

  const positiveAnswers = questions.filter(
    (question) => answers[question.key] === "yes"
  );

  const uncertainAnswers = questions.filter(
    (question) => answers[question.key] === "unsure"
  );

  const warningSigns = [
    "changing",
    "asymmetry",
    "border",
    "colour",
    "diameter",
    "evolving",
  ];

  const positiveWarningSigns = positiveAnswers.filter(
    (question) => warningSigns.includes(question.key)
  );

  const positiveRiskFactors = positiveAnswers.filter(
    (question) =>
      ["history", "family", "sunburn", "immunosuppressed"].includes(
        question.key
      )
  );

  if (
    answers.changing === "yes" ||
    answers.evolving === "yes" ||
    positiveWarningSigns.length >= 2
  ) {
    return {
      level: "Arrange a prompt skin check",
      tone: "urgent",
      text:
        "Your answers indicate one or more important skin warning signs. Please arrange a prompt assessment with a dermatologist or qualified clinician, especially if a spot is changing, bleeding, or not healing.",
      answeredCount: questions.length,
      totalQuestions: questions.length,
      positiveAnswers,
      uncertainAnswers,
    };
  }

  if (
    positiveWarningSigns.length === 1 ||
    positiveRiskFactors.length > 0
  ) {
    return {
      level: "Consider a professional assessment",
      tone: "caution",
      text:
        "Your answers indicate a skin warning sign or a relevant risk factor. Consider discussing your concerns and personal history with a qualified healthcare professional.",
      answeredCount: questions.length,
      totalQuestions: questions.length,
      positiveAnswers,
      uncertainAnswers,
    };
  }

  if (uncertainAnswers.length > 0) {
    return {
      level: "Some answers need clarification",
      tone: "caution",
      text:
        "You selected Not sure for one or more questions. Consider asking a healthcare professional about these concerns, particularly if a spot is new, unusual, or changing.",
      answeredCount: questions.length,
      totalQuestions: questions.length,
      positiveAnswers,
      uncertainAnswers,
    };
  }

  return {
    level: "Continue monitoring your skin",
    tone: "calm",
    text:
      "You did not report the warning signs or risk factors covered by this questionnaire. This does not rule out skin cancer or other skin conditions. Continue checking your skin and seek professional advice about any concerning changes.",
    answeredCount: questions.length,
    totalQuestions: questions.length,
    positiveAnswers,
    uncertainAnswers,
  };
};

const SkinAI = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [showAssessment, setShowAssessment] = useState(false);
  const assessment = useMemo(() => adviceFor(answers), [answers]);

  const selectImage = (event) => {
    const chosen = event.target.files && event.target.files[0];
    setResult(null); setError("");
    if (!chosen) { setFile(null); setPreview(""); return; }
    if (!chosen.type.startsWith("image/")) { setError("Please choose an image file (JPG, PNG, or WEBP)."); return; }
    if (chosen.size > 10 * 1024 * 1024) { setError("Image must be 10 MB or smaller."); return; }
    setFile(chosen); setPreview(URL.createObjectURL(chosen));
  };

  const analyzeImage = async () => {
    if (!file) { setError("Upload a skin lesion image first."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const body = new FormData(); body.append("file", file);
      const response = await fetch("http://localhost:8000/predict", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "The prediction service could not process this image.");
      setResult(data);
    } catch (e) {
      setError(e.message === "Failed to fetch" ? "AI service is not running. Start the ML service using the setup instructions in ml-service/README.md." : e.message);
    } finally { setLoading(false); }
  };

  return <main className="skin-ai-page">
    <div className="skin-ai-hero"><span className="skin-ai-kicker">SKINWISE · AI LAB</span><h1>AI Skin Image Review</h1><p>Upload a close, well-lit image for an experimental machine-learning classification, then use the skin-health questionnaire to guide your next step.</p><div className="skin-ai-warning"><strong>Important:</strong> This is an educational decision-support tool, not a diagnosis. It cannot confirm or rule out cancer. A clinician must assess concerning lesions.</div></div>
    <section className="skin-ai-grid">
      <article className="skin-ai-card"><div className="skin-ai-step">01 · IMAGE ANALYSIS</div><h2>Check a skin image</h2><p className="skin-ai-muted">Use a focused image of one spot. Avoid filters, flash glare, and images containing identifying details.</p>
        <label className="skin-ai-upload" htmlFor="lesion-image"><span className="skin-ai-upload-icon">＋</span><strong>{file ? file.name : "Choose a skin image"}</strong><small>JPG, PNG or WEBP · up to 10 MB</small><input id="lesion-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectImage}/></label>
        {preview && <img className="skin-ai-preview" src={preview} alt="Selected skin lesion preview"/>}
        <button className="skin-ai-button" onClick={analyzeImage} disabled={!file || loading}>{loading ? "Analysing image…" : "Analyse image"}</button>
        {error && <p className="skin-ai-error" role="alert">{error}</p>}
        {result && <div className="skin-ai-result"><span className="skin-ai-result-label">MODEL OUTPUT · NOT A DIAGNOSIS</span><h3>{result.predicted_class_name || result.predicted_class}</h3><p>Model confidence: {Math.round((result.confidence || 0) * 100)}%</p>{Array.isArray(result.top_predictions) && <ul>{result.top_predictions.map((item) => <li key={item.class}><span>{item.class_name || item.class}</span><strong>{Math.round(item.probability * 100)}%</strong></li>)}</ul>}<p className="skin-ai-muted">{result.notice || "Please have a qualified clinician assess any concerning lesion."}</p></div>}
        <p className="skin-ai-footnote">Supported model labels (HAM10000): actinic keratoses, basal cell carcinoma, benign keratosis-like lesions, dermatofibroma, melanoma, melanocytic nevi, and vascular lesions.</p>
      </article>
      <article className="skin-ai-card"><div className="skin-ai-step">02 · SMART QUESTIONNAIRE</div><h2>Skin health check-in</h2><p className="skin-ai-muted">Answer what you know. This screens for warning signs and risk factors; it does not calculate a medical diagnosis.</p>
        <form onSubmit={(e) => { e.preventDefault(); setShowAssessment(true); }}>
          {questions.map((q, i) => <fieldset className="skin-ai-question" key={q.key}><legend><span>{String(i + 1).padStart(2, "0")}</span>{q.title}</legend><div className="skin-ai-options">{q.options.map(([value, label]) => <label key={value} className={answers[q.key] === value ? "selected" : ""}><input type="radio" name={q.key} value={value} checked={answers[q.key] === value} onChange={() => setAnswers((old) => ({ ...old, [q.key]: value }))}/>{label}</label>)}</div></fieldset>)}
          <button className="skin-ai-button" type="submit">Review my answers</button>
        </form>
        {showAssessment && <div className={`skin-ai-advice ${assessment.tone}`}><span className="skin-ai-result-label">YOUR NEXT STEP</span><h3>{assessment.level}</h3><p>{assessment.text}</p><ul><li>Take a clear photo with a date to track changes.</li><li>Do not cut, burn, freeze, or apply unverified remedies to the spot.</li><li>Use broad-spectrum SPF 30+ sunscreen, protective clothing, and shade.</li></ul><Link to="/find-a-dermatologist">Find a dermatologist →</Link></div>}
      </article>
    </section>
    <section className="skin-ai-care"><h2>What about treatment or a cure?</h2><p>There is no safe one-size-fits-all home cure for a suspicious skin lesion. Treatment depends on the confirmed diagnosis, type, size, depth, and location.</p><div className="skin-ai-care-grid"><div><strong>Get it assessed</strong><p>A dermatologist may examine the lesion and, if needed, perform a biopsy. Do not delay assessment because of a reassuring app result.</p></div><div><strong>Use clinician-directed treatment</strong><p>Depending on diagnosis, care may include surgical removal, cryotherapy, prescription topical medicines, or other specialist treatments. Never self-prescribe these.</p></div><div><strong>Protect your skin</strong><p>Use broad-spectrum SPF 30+, reapply as directed, wear protective clothing, avoid tanning beds, and check for evolving spots.</p></div></div><p className="skin-ai-disclaimer">If a lesion is rapidly changing, bleeding persistently, ulcerated, or otherwise worrying, arrange prompt medical care. If you feel acutely unwell, seek urgent medical help.</p></section>
  </main>;
};
export default SkinAI;
