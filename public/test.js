const urlParams2 = new URLSearchParams(window.location.search);
const urlParams = urlParams2.get("category")
console.log(urlParams)
// function getQueryParam(param) {
//   return urlParams.get(param);
// }

let questions2; // Declare questions2 globally

// Fetch questions from the backend and display them
async function fetchQuestions() {
  try {
    // Fetch data from the backend
    const response = await fetch(`/api/questions?category=${urlParams}`);
    questions2 = await response.json();

    // After data is fetched, initialize the quiz
    initializeQuiz();
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

// Initialize the Quiz with questions (either fetched or from sample)
function initializeQuiz() {
  const questions = questions2 || []; // Use fetched questions or fallback to empty array
  let currentQuestion = 0;
  const attemptedQuestions = new Set();

  // DOM Elements
  const questionNumbersContainer = document.getElementById("questionNumbers");
  const questionNumberDisplay = document.getElementById("questionNumber");
  const questionTextDisplay = document.getElementById("questionText");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const submitButton = document.getElementById("submitButton");
  const optionsContainer = document.querySelector(".options");

  // Load Questions into the Number List
  function setupQuestionNumbers() {
    if (!questions || questions.length === 0) {
      console.error('No questions available');
      return;
    }

    questions.forEach((_, idx) => {
      const btn = document.createElement("button");
      btn.innerText = idx + 1;
      btn.addEventListener("click", () => {
        currentQuestion = idx;
        loadQuestion(currentQuestion);
        updateNavButtons();
      });
      questionNumbersContainer.appendChild(btn);
    });
  }

  // Load a Specific Question
  function loadQuestion(index) {
    const question = questions[index];
    // console.log(questions)
    questionNumberDisplay.innerText = `Question ${index + 1}`;
    questionTextDisplay.innerText = question.questionText;

    // Display Options
    optionsContainer.innerHTML = "";
    Object.entries(question.options).forEach(([key, option]) => {
      const label = document.createElement("label");
      const radioButton = document.createElement("input");

      // Set up the radio button attributes
      radioButton.type = "radio";
      radioButton.name = `question${index}`; // Group radio buttons for this question
      radioButton.value = key; // Set value to the key (e.g., "A", "B")
      radioButton.addEventListener("change", () => {
        saveSelectedOption(index, key); // Save the selected key (e.g., "A")
      });

      // Append the radio button and option text to the label
      label.appendChild(radioButton);
      label.appendChild(document.createTextNode(` ${key}) ${option}`));

      // Append the label to the options container
      optionsContainer.appendChild(label);
      optionsContainer.appendChild(document.createElement("br"));
    });

    // Highlight Active Question Number
    const allButtons = questionNumbersContainer.querySelectorAll("button");
    allButtons.forEach((btn, idx) => {
      btn.classList.remove("active");
      if (idx === index) btn.classList.add("active");
      if (attemptedQuestions.has(idx)) btn.classList.add("attempted");
    });

    // Pre-select the answer if already attempted
    const selectedOption = getSelectedOption(index);
    if (selectedOption !== null) {
      const radios = optionsContainer.querySelectorAll(`input[name="question${index}"]`);
      radios.forEach((radio) => {
        if (radio.value === selectedOption) {
          radio.checked = true;
        }
      });
    }
  }

  // Update Navigation Buttons
  function updateNavButtons() {
    prevButton.disabled = currentQuestion === 0;
    nextButton.disabled = currentQuestion === questions.length - 1;
  }

  // Get Selected Option for a Question
  function getSelectedOption(index) {
    const answers = JSON.parse(localStorage.getItem("answers")) || {};
    return answers[index] || null;
  }

  // Save Selected Option
  function saveSelectedOption(index, option) {
    const answers = JSON.parse(localStorage.getItem("answers")) || {};
    answers[index] = option; // Save the selected key (e.g., "A", "B")
    localStorage.setItem("answers", JSON.stringify(answers));
    attemptedQuestions.add(index);
  }

  // Navigation Button Events
  prevButton.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion(currentQuestion);
      updateNavButtons();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      loadQuestion(currentQuestion);
      updateNavButtons();
    }
  });

  submitButton.addEventListener("click", (e) => {
    // console.log("submitted",e)
    const answers = JSON.parse(localStorage.getItem("answers")) || {};
    console.log(answers)

    let score = 0;

    // Simple Scoring Logic (for demonstration)
    const correctAnswers = questions.map((q) => q.correctAnswer); // Example correct answers
    questions.forEach((q, idx) => {
      if (answers[idx] === correctAnswers[idx]) score++;
    });
    alert(`Quiz submitted!\nYour Score: ${score} out of ${questions.length}`);


    const newEntry = {
      questionCat: `${urlParams}`,
      correctAnswer: `${score}/${questions.length}`
    };
    let questionsSolved = localStorage.getItem('questionsSolved');
    if (questionsSolved) {
      // Parse existing data
      questionsSolved = JSON.parse(questionsSolved);
    } else {
      // Initialize as an empty array if it doesn't exist
      questionsSolved = [];
    }

    // Append new entry
    questionsSolved.push(newEntry);
    localStorage.setItem('questionsSolved', JSON.stringify(questionsSolved));

    console.log("Updated questionsSolved:", questionsSolved);

    console.log(score)
  });

  // Initialize Quiz
  setupQuestionNumbers();
  loadQuestion(currentQuestion);
  updateNavButtons();
}

// Run the fetchQuestions function when the page loads
window.onload = () => {
  // Clear specific item
  localStorage.removeItem("answers");

  // Or, to clear all localStorage (if required):
  // localStorage.clear();

  // Fetch questions after clearing localStorage
  fetchQuestions();
};
