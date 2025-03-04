import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Dialog } from "@headlessui/react";

const App = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [loading, setLoading] = useState(true);
    const [testComplete, setTestComplete] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

    useEffect(() => {
        fetch("http://localhost:5173/test.json")
            .then((res) => res.json())
            .then((data) => {
                setQuestions(shuffleArray(data));
                setLoading(false);
            });
    }, []);

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const handleSelectAnswer = (event) => {
        const answer = event.target.value;
        const currentQuestion = questions[currentQuestionIndex];
        const maxSelectable = currentQuestion.answer.length;

        setSelectedAnswers((prev) => {
            if (currentQuestion.answer.length === 1) {
                // Single-choice (radio button) question
                return [answer];
            } else {
                // Multiple-choice (checkbox) question
                if (prev.includes(answer)) {
                    return prev.filter((a) => a !== answer);
                }
                if (prev.length < maxSelectable) {
                    return [...prev, answer];
                }
                return prev; // Prevent selecting more than allowed
            }
        });
    };

    const handleSubmitAnswer = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const correct = currentQuestion.answer;

        const isAnswerCorrect =
            selectedAnswers.length === correct.length &&
            selectedAnswers.every((answer) => correct.includes(answer));

        setIsCorrect(isAnswerCorrect);
        setShowResult(true);

        if (isAnswerCorrect) {
            setCorrectAnswersCount((prev) => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswers([]);
            setShowResult(false);
            setIsCorrect(null);
        } else {
            setTestComplete(true);
        }
    };

    if (loading) {
        return <div className="text-center text-xl">Loading questions...</div>;
    }

    if (testComplete) {
        return (
            <div className="text-center p-6">
                <h1 className="text-3xl font-bold">Test Completed</h1>
                <p className="text-lg mt-2">
                    You answered {correctAnswersCount} out of {questions.length} questions correctly.
                </p>
                <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => {
                        setCurrentQuestionIndex(0);
                        setCorrectAnswersCount(0);
                        setTestComplete(false);
                        setQuestions(shuffleArray(questions));
                    }}
                >
                    Retry Test
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isMultipleChoice = currentQuestion.answer.length > 1;
    const requiredSelections = currentQuestion.answer.length;
    const canSubmit = selectedAnswers.length === requiredSelections;

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-4xl font-bold mb-6">Linux Exam Quiz</h1>
            <div className="max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
                <p className="mb-2 text-sm text-gray-400">
                    {isMultipleChoice ? `Select ${requiredSelections} answers.` : "Select one answer."}
                </p>
                <div className="space-y-2">
                    {currentQuestion.options.map((option, idx) => (
                        <label
                            key={idx}
                            className={`flex items-center space-x-2 bg-gray-700 p-2 rounded-md cursor-pointer ${
                                selectedAnswers.includes(option) && "bg-blue-600"
                            }`}
                        >
                            <input
                                type={isMultipleChoice ? "checkbox" : "radio"}
                                name={`question-${currentQuestionIndex}`} // Ensures radio buttons work properly
                                value={option}
                                checked={selectedAnswers.includes(option)}
                                onChange={handleSelectAnswer}
                                className="form-checkbox text-blue-500"
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>

                <div className="mt-4 flex justify-between">
                    {!showResult ? (
                        <button
                            onClick={handleSubmitAnswer}
                            className={`px-4 py-2 rounded-md ${
                                canSubmit
                                    ? "bg-green-500 text-white hover:bg-green-700"
                                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                            }`}
                            disabled={!canSubmit} // Prevent submission until all required selections are made
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleNextQuestion}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Next Question
                        </button>
                    )}
                </div>

                {showResult && (
                    <Dialog open={showResult} onClose={() => setShowResult(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white text-black p-6 rounded-lg shadow-lg">
                            {isCorrect ? (
                                <div className="flex items-center space-x-2 text-green-600">
                                    <FaCheckCircle size={24} />
                                    <span>Correct!</span>
                                </div>
                            ) : (
                                <div className="text-red-600">
                                    <div className="flex items-center space-x-2">
                                        <FaTimesCircle size={24} />
                                        <span>Incorrect!</span>
                                    </div>
                                    <p className="mt-2">Correct Answer: {currentQuestion.answer.join(", ")}</p>
                                </div>
                            )}
                            <button
                                onClick={handleNextQuestion}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Next Question
                            </button>
                        </div>
                    </Dialog>
                )}
            </div>
        </div>
    );
};

export default App;