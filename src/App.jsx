import { useEffect, useState } from 'react';

const quizQuestions = [
  {
    question: 'What is the capital of France?',
    choices: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    answerIndex: 2,
  },
  {
    question: 'Which planet is known as the Red Planet?',
    choices: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    answerIndex: 1,
  },
  {
    question: 'What is 5 + 7?',
    choices: ['10', '11', '12', '13'],
    answerIndex: 2,
  },
];

const platformOptions = ['Web', 'Desktop', 'Mobile'];

function App() {
  const [quizLoaded, setQuizLoaded] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [platform, setPlatform] = useState('Web');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  useEffect(() => {
    if (!showConfetti) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShowConfetti(false);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [showConfetti]);

  const handleAnswer = (choiceIndex) => {
    if (answered) {
      return;
    }

    const answerIsCorrect = choiceIndex === currentQuestion.answerIndex;
    setSelectedChoiceIndex(choiceIndex);
    setIsCorrect(answerIsCorrect);
    setScore((prevScore) => prevScore + (answerIsCorrect ? 1 : 0));
    setFeedback(
      answerIsCorrect
        ? 'Correct! Great choice.'
        : `Incorrect. The correct answer was ${currentQuestion.choices[currentQuestion.answerIndex]}.`
    );
    setAnswered(true);
    if (answerIsCorrect) {
      setShowConfetti(true);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setAnswered(false);
    setFeedback('');
    setIsCorrect(false);
    setSelectedChoiceIndex(null);
    setShowConfetti(false);
  };

  const handleRestart = () => {
    setQuizLoaded(false);
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setFeedback('');
    setIsCorrect(false);
    setSelectedChoiceIndex(null);
    setShowConfetti(false);
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Quiz App</h1>
      </header>

      {!quizLoaded ? (
        <div className="start-screen">
          <p>Select where you want the quiz experience to be optimized, then load the quiz.</p>
          <label htmlFor="platform-select">Choose platform:</label>
          <select
            id="platform-select"
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
          >
            {platformOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button onClick={() => setQuizLoaded(true)}>Load Quiz</button>
        </div>
      ) : !quizStarted ? (
        <div className="quiz-loaded">
          <h2>Quiz Loaded</h2>
          <p>
            {quizQuestions.length} questions are ready for the <strong>{platform}</strong>{' '}
            experience.
          </p>
          <div className="platform-support-note">
            <p>
              This quiz is designed to work across web, desktop, and mobile platforms with
              responsive layout and platform-aware messaging.
            </p>
          </div>
          <button onClick={() => setQuizStarted(true)}>Start Quiz</button>
        </div>
      ) : currentQuestionIndex < quizQuestions.length ? (
        <div className="quiz-card">
          <h2>Question {currentQuestionIndex + 1}</h2>
          <p className="question-text">{currentQuestion.question}</p>
          <p className="answer-instructions">Choose one answer from the list below.</p>

          <div className="choices-list">
            {currentQuestion.choices.map((choice, index) => {
              const isAnswerOption = index === currentQuestion.answerIndex;
              const isSelectedOption = index === selectedChoiceIndex;
              const answerClass = answered
                ? isAnswerOption
                  ? 'correct'
                  : isSelectedOption
                  ? 'incorrect'
                  : ''
                : '';

              return (
                <button
                  key={choice}
                  className={`choice-button ${answerClass}`}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  aria-pressed={isSelectedOption}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`feedback-box ${isCorrect ? 'correct' : 'incorrect'}`} role="status">
              {feedback}
            </div>
          )}

          {showConfetti && (
            <div className="confetti-container" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, index) => {
                const left = Math.random() * 90 + '%';
                const delay = Math.random() * 0.4 + 's';
                const duration = 1.2 + Math.random() * 0.8 + 's';
                const rotate = Math.floor(Math.random() * 360) + 'deg';

                return (
                  <span
                    key={index}
                    className="confetti-piece"
                    style={{
                      left,
                      animationDelay: delay,
                      animationDuration: duration,
                      transform: `rotate(${rotate})`,
                    }}
                  />
                );
              })}
            </div>
          )}

          {answered && (
            <button className="next-button" onClick={handleNextQuestion}>
              {currentQuestionIndex + 1 < quizQuestions.length ? 'Next Question' : 'See Results'}
            </button>
          )}
        </div>
      ) : (
        <div className="quiz-card results-card">
          <h2>Quiz Complete</h2>
          <div className="score-display">
            <div className="score-circle">
              <span className="score-number">{score}</span>
              <span className="score-total">/{quizQuestions.length}</span>
            </div>
          </div>
          <p className="score-text">
            You answered {score} out of {quizQuestions.length} questions correctly.
          </p>
          <p className="percentage-text">
            That's <strong>{Math.round((score / quizQuestions.length) * 100)}%</strong>
          </p>
          <div className="performance-feedback">
            {score === quizQuestions.length && (
              <p className="perfect">Perfect Score! 🎉 You got every question right!</p>
            )}
            {score >= Math.ceil(quizQuestions.length * 0.8) && score < quizQuestions.length && (
              <p className="excellent">Excellent work! You scored very well!</p>
            )}
            {score >= Math.ceil(quizQuestions.length * 0.6) && score < Math.ceil(quizQuestions.length * 0.8) && (
              <p className="good">Good job! Keep practicing to improve!</p>
            )}
            {score < Math.ceil(quizQuestions.length * 0.6) && (
              <p className="tryagain">Keep learning! Try again to improve your score.</p>
            )}
          </div>
          <button onClick={handleRestart}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
}

export default App;
