"use client";

import { useState } from "react";
import { QUESTIONS } from "@/server/engines/mbti/constants";
import type { QuizResult } from "@/types/personalization";
import QuizProgress from "./QuizProgress";
import QuizWelcome from "./QuizWelcome";
import QuizPersonalDetails from "./QuizPersonalDetails";
import type { PersonalDetails } from "./QuizPersonalDetails";
import QuizQuestion from "./QuizQuestion";
import QuizLoading from "./QuizLoading";
import QuizResults from "./QuizResults";

const TOTAL_STEPS = 17; // 1 personal details + 16 questions

export default function QuizWizard() {
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState<PersonalDetails>({
    fullName: "",
    dob: "",
    birthHour: 12,
    birthMinute: 0,
    birthLat: 0,
    birthLng: 0,
  });
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(16).fill(null)
  );
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleAnswer(questionIndex: number, value: number) {
    const next = answers.map((a, i) => (i === questionIndex ? value : a));
    setAnswers(next);
  }

  async function submitQuiz() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: details.fullName,
          dob: details.dob,
          birthHour: details.birthHour,
          birthMinute: details.birthMinute,
          birthLat: details.birthLat,
          birthLng: details.birthLng,
          mbtiAnswers: answers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Quiz submission failed");
        return;
      }
      setResult(data);
      setStep(19);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleQuestionNext(questionIndex: number) {
    if (questionIndex === 15) {
      setStep(18);
      submitQuiz();
    } else {
      setStep(step + 1);
    }
  }

  // Step 0: Welcome
  if (step === 0) {
    return <QuizWelcome onStart={() => setStep(1)} />;
  }

  // Step 18: Loading
  if (step === 18) {
    return <QuizLoading error={error} />;
  }

  // Step 19: Results
  if (step === 19 && result) {
    return (
      <QuizResults
        elementVector={result.elementVector}
        dominantElement={result.dominantElement}
      />
    );
  }

  // Steps 1-17: Personal details + 16 questions
  return (
    <>
      <QuizProgress current={step} total={TOTAL_STEPS} />

      {step === 1 && (
        <QuizPersonalDetails
          details={details}
          onChange={setDetails}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
        />
      )}

      {step >= 2 && step <= 17 && (
        <QuizQuestion
          questionNumber={step - 1}
          questionText={QUESTIONS[step - 2].text}
          value={answers[step - 2]}
          onAnswer={(v) => handleAnswer(step - 2, v)}
          onNext={() => handleQuestionNext(step - 2)}
          onBack={() => setStep(step - 1)}
        />
      )}
    </>
  );
}
