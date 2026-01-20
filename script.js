// script.js
// quizData is already available here because questions.js loads first

// DOM elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const reviewScreen = document.getElementById("review-screen");
const quizForm = document.getElementById("quiz-form");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score-display");
const startBtn = document.getElementById("start-btn");
const submitBtn = document.getElementById("submit-btn");
const checkAnswersBtn = document.getElementById("check-answers-btn");
const quizTimeInput = document.getElementById("quiz-time");
const reviewContent = document.getElementById("review-content");

let timer;
let timeLeft = 0;
let userAnswers = [];

// Start quiz
startBtn.addEventListener("click", () => {
  const minutes = parseInt(quizTimeInput.value);
  if (isNaN(minutes) || minutes <= 0) {
    alert("Please enter a valid quiz time.");
    return;
  }

  timeLeft = minutes * 60;
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  loadQuestions();
  startTimer();
});

// Load questions from quizData
function loadQuestions() {
  quizForm.innerHTML = "";
  quizData.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    const questionText = document.createElement("p");
    questionText.textContent = `${index + 1}. ${q.question}`;
    questionDiv.appendChild(questionText);

    q.options.forEach((option) => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `question${index}`;
      radio.value = option;
      label.appendChild(radio);
      label.appendChild(document.createTextNode(option));
      questionDiv.appendChild(label);
      questionDiv.appendChild(document.createElement("br"));
    });

    quizForm.appendChild(questionDiv);
  });
}

// Timer
function startTimer() {
  updateTimerDisplay();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      submitQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `Time: ${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

// Submit quiz
submitBtn.addEventListener("click", submitQuiz);

function submitQuiz() {
  clearInterval(timer);

  let score = 0;
  userAnswers = [];

  quizData.forEach((q, index) => {
    const selected = document.querySelector(
      `input[name="question${index}"]:checked`
    );
    const userAnswer = selected ? selected.value : null;
    userAnswers.push(userAnswer);

    if (selected) {
      if (selected.value === q.answer) {
        score += 1;
      } else {
        score -= 0.25;
      }
    }
  });

  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  // Color based on score
  if (score >= quizData.length / 2) {
    resultScreen.style.borderTop = "6px solid #28a745"; // green top border
  } else {
    resultScreen.style.borderTop = "6px solid #dc3545"; // red top border
  }
  scoreDisplay.textContent = `${score} out of ${quizData.length}`;
}

// Check answers functionality
checkAnswersBtn.addEventListener("click", showAnswerReview);

function showAnswerReview() {
  resultScreen.classList.add("hidden");
  reviewScreen.classList.remove("hidden");

  reviewContent.innerHTML = "";

  quizData.forEach((q, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === q.answer;
    const isUnanswered = userAnswer === null;

    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("review-question");

    if (isUnanswered) {
      reviewDiv.classList.add("unanswered");
    } else if (isCorrect) {
      reviewDiv.classList.add("correct");
    } else {
      reviewDiv.classList.add("incorrect");
    }

    const questionText = document.createElement("p");
    questionText.innerHTML = `${index + 1}. ${q.question}`;

    // Add status badge
    const statusBadge = document.createElement("span");
    statusBadge.classList.add("status-badge");
    if (isUnanswered) {
      statusBadge.classList.add("status-unanswered");
      statusBadge.textContent = "Not Answered";
    } else if (isCorrect) {
      statusBadge.classList.add("status-correct");
      statusBadge.textContent = "Correct";
    } else {
      statusBadge.classList.add("status-incorrect");
      statusBadge.textContent = "Incorrect";
    }
    questionText.appendChild(statusBadge);

    reviewDiv.appendChild(questionText);

    // Show all options with highlighting
    q.options.forEach((option) => {
      const optionDiv = document.createElement("div");
      optionDiv.classList.add("answer-option");
      optionDiv.textContent = option;

      if (option === userAnswer && isCorrect) {
        optionDiv.classList.add("user-correct");
      } else if (option === userAnswer && !isCorrect) {
        optionDiv.classList.add("user-incorrect");
      } else if (option === q.answer && !isCorrect) {
        optionDiv.classList.add("correct-answer");
        optionDiv.textContent += " (Correct Answer)";
      }

      reviewDiv.appendChild(optionDiv);
    });

    reviewContent.appendChild(reviewDiv);
  });
}
