import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

ChartJS.register(ArcElement, Tooltip, Legend);

const renderFormattedText = (text) => {
  if (typeof text !== "string") return text;

  if (!text.startsWith("`") || !text.endsWith("`")) {
    return (
      <span className="break-words whitespace-pre-wrap w-full">
        {text}
      </span>
    );
  }

  const content = text.slice(1, -1);
  const isMultiline = content.includes("\n") || content.length > 80;

  if (isMultiline) {
    return (
      <div className="w-full overflow-x-auto">
        <SyntaxHighlighter
          language="bash"
          style={dracula}
          wrapLongLines={false}
          customStyle={{
            background: "#1e1e1e",
            borderRadius: "0.5rem",
            padding: "0.75rem",
            fontSize: "0.75rem",
            lineHeight: 1.4,
            minWidth: "100%",
            maxWidth: "100%",
            overflowX: "auto",
            boxSizing: "border-box",
          }}
        >
          {content}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className="block w-full bg-gray-700 px-2 py-1 rounded text-sm font-mono overflow-x-auto whitespace-nowrap">
      {content}
    </code>
  );
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testComplete, setTestComplete] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    let fetchUrl = "https://raw.githubusercontent.com/Noam-Alum/lpi_010_160_exam/refs/heads/main/lpi/";
    fetchUrl += window.location.href.includes("/lpi_010_160_exam/extended") ? "lpi_exercise_questions.json" : "lpi_questions.json";

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        const shuffledData = shuffleArray(data).map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));
        setQuestions(shuffledData);
        setLoading(false);
      });
  }, []);

  const handleSelectAnswer = (event) => {
    const answer = event.target.value;
    const currentQuestion = questions[currentQuestionIndex];
    const maxSelectable = currentQuestion.answer.length;

    setSelectedAnswers((prev) => {
      if (showAnswer) return prev;
      if (maxSelectable === 1) return [answer];
      if (prev.includes(answer)) return prev.filter((a) => a !== answer);
      if (prev.length < maxSelectable) return [...prev, answer];
      return prev;
    });
  };

  const handleSubmitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = currentQuestion.answer;
    const isAnswerCorrect =
      selectedAnswers.length === correct.length &&
      selectedAnswers.every((answer) => correct.includes(answer));

    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);

    if (isAnswerCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => [
        ...prev,
        {
          question: currentQuestion.question,
          options: currentQuestion.options,
          correctAnswers: correct,
          selectedAnswers: selectedAnswers,
        },
      ]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswers([]);
      setShowAnswer(false);
      setIsCorrect(null);
    } else {
      setTestComplete(true);
    }
  };

  if (loading) return <div className="text-center text-xl">Loading questions...</div>;

  if (testComplete) {
    const totalQuestions = questions.length;
    const incorrectAnswersCount = totalQuestions - correctAnswersCount;

    return (
      <div className="text-center p-6">
        <h1 className="text-3xl font-bold">Exam Completed</h1>
        <div className="mt-10 p-6 bg-yellow-100 text-black rounded-lg shadow-lg max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Support This Project ❤️</h2>
          <p className="mb-3">
            This exam simulator is maintained by one person. If it helped you prepare, please consider
            <a href="https://github.com/sponsors/Noam-Alum" className="underline font-semibold hover:text-purple-700"> sponsoring the developer</a>.
          </p>
          <p className="mb-1">
            Found a bug or suggestion? Open an issue on
            <a href="https://github.com/Noam-Alum/lpi_010_160_exam/issues" className="underline font-semibold hover:text-blue-700"> GitHub</a>.
          </p>
          <p className="mt-3">I hope you do well on the actual exam 🙃<br />Contact: <a href="mailto:nnoam.alum@gmail.com" className="underline font-semibold hover:text-blue-700">nnoam.alum@gmail.com</a></p>
        </div>
        <p className="text-lg mt-6">You answered {correctAnswersCount} out of {totalQuestions} questions correctly.</p>
        <div className="w-64 mx-auto mt-6">
          <Pie data={{ labels: ["Correct", "Incorrect"], datasets: [{ data: [correctAnswersCount, incorrectAnswersCount], backgroundColor: ["#22c55e", "#ef4444"] }] }} />
        </div>
        {wrongAnswers.length > 0 && (
          <div className="mt-8 text-left">
            <h2 className="text-xl font-bold mb-2">Review Incorrect Answers</h2>
            <div className="flex space-x-4 mb-2">
              <span className="px-2 py-1 bg-green-500 text-white text-sm rounded">✔ Correct answer</span>
              <span className="px-2 py-1 bg-red-500 text-white text-sm rounded">✘ Answered wrong</span>
              <span className="px-2 py-1 bg-blue-500 text-white text-sm rounded">⚠ Answered correctly</span>
            </div>
            {wrongAnswers.map((wrong, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg mt-4 w-full max-w-screen-sm mx-auto overflow-x-auto">
                <h3 className="text-lg font-semibold">{wrong.question}</h3>
                <div className="mt-2 space-y-2">
                  {wrong.options.map((option, idx) => {
                    let bgColor = "bg-gray-700";
                    if (wrong.selectedAnswers.includes(option) && wrong.correctAnswers.includes(option)) bgColor = "bg-blue-500";
                    else if (wrong.selectedAnswers.includes(option)) bgColor = "bg-red-500";
                    else if (wrong.correctAnswers.includes(option)) bgColor = "bg-green-500";

                    return (
                      <div key={idx} className={`rounded ${bgColor} px-3 py-2 max-w-full break-words`}>
                        {renderFormattedText(option)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={() => window.location.reload()}>Retry Exam</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isMultipleChoice = currentQuestion.answer.length > 1;
  const isFillInBlank = currentQuestion.options.length === 1;
  const requiredSelections = currentQuestion.answer.length;
  const canSubmit = selectedAnswers.length === requiredSelections;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white px-2 sm:px-6 py-6 w-full">
      <h1 className="text-4xl font-bold mb-6">
        <a href="https://github.com/Noam-Alum/lpi_010_160_exam/">LPI Practice Exam</a>
      </h1>
      <p className="text-4s font-bold mb-6">Made with ❤️</p>
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
        <div className="flex justify-between items-center mb-4 text-sm text-gray-300">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        <h2 className="text-xl font-semibold mb-2">{renderFormattedText(currentQuestion.question)}</h2>
        <p className="mb-2 text-sm text-gray-400">
          {isMultipleChoice ? `Select ${requiredSelections} answers.` : isFillInBlank ? "Type the answer." : "Select one answer."}
        </p>
        <div className="space-y-2">
          {isFillInBlank ? (
            <input type="text" value={selectedAnswers[0] || ""} onChange={handleSelectAnswer} className="bg-gray-700 p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          ) : (
            currentQuestion.options.map((option, idx) => (
              <label key={idx} className={`flex items-center space-x-2 bg-gray-700 p-2 rounded-md cursor-pointer ${selectedAnswers.includes(option) && "bg-blue-600"}`}>
                <input
                  type={isMultipleChoice ? "checkbox" : "radio"}
                  name={`question-${currentQuestionIndex}`}
                  value={option}
                  checked={selectedAnswers.includes(option)}
                  onChange={handleSelectAnswer}
                  disabled={showAnswer}
                  className="form-checkbox text-blue-500"
                />
                <div className="overflow-x-auto w-full">
                  {renderFormattedText(option)}
                </div>
              </label>
            ))
          )}
        </div>
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleSubmitAnswer}
            className={`px-4 py-2 rounded-md transition-transform duration-300 ${canSubmit && !showAnswer ? "bg-green-500 text-white hover:bg-green-700 active:opacity-70" : "bg-gray-500 text-gray-300 cursor-not-allowed"}`}
            disabled={!canSubmit || showAnswer}
          >
            Show Answer
          </button>
          <button
            onClick={handleNextQuestion}
            className={`px-4 py-2 rounded-md ${canSubmit ? "bg-blue-500 text-white hover:bg-blue-700 active:opacity-70" : "bg-gray-500 text-gray-300 cursor-not-allowed"}`}
            disabled={!canSubmit}
          >
            Next Question
          </button>
        </div>
        {showAnswer && (
          <div className="mt-4 p-4 bg-white text-black rounded-md">
            {isCorrect ? (
              <div className="text-green-600">Correct!</div>
            ) : (
              <div className="text-red-600">
                <p>Incorrect! The correct answers are:</p>
                <ul className="list-disc list-inside mt-2">
                  {currentQuestion.answer.map((answer, idx) => (
                    <li key={idx}>{renderFormattedText(answer)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mb-6 text-sm bg-yellow-500 text-black px-4 py-2 rounded shadow-lg mt-6">
        Enjoying this tool? <a href="https://github.com/sponsors/Noam-Alum" className="underline font-semibold hover:text-white">Consider sponsoring the project</a>. ❤️
      </div>
    </div>
  );
};

export default App;