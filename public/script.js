// we didnt use this here


// Fetch questions from the backend and display them
async function fetchQuestions() {
  try {
    // Fetch data from the backend
    const response = await fetch('/api/questions');
    const questions = await response.json();
    // console.log(questions)

    // Get the container to display questions
    const questionsList = document.getElementById('questions-list');

    // Iterate over questions and add them to the DOM
    questions.forEach((question, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'question';

      questionDiv.innerHTML = `
        <h2>Question ${index + 1}: ${question.questionText}</h2>
        <div class="options">
          ${Object.keys(question.options)
            .map(
              key =>
                `<label><input type="radio" name="question${index}" value="${key}"> ${key}) ${question.options[key]}</label>`
            )
            .join('')}
        </div>
      `;

      // questionsList.appendChild(questionDiv);
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

// Run the fetchQuestions function when the page loads
window.onload = fetchQuestions;









// const leaderboardData = [
//     { rank: 1, name: "Amit Lad", id: "A123", marks: 99 },
//     { rank: 2, name: "Bob Smith", id: "B456", marks: 95 },
//     { rank: 3, name: "Charlie Brown", id: "C789", marks: 92 },
//     { rank: 4, name: "Daisy Lee", id: "D012", marks: 89 },
//     { rank: 5, name: "Ethan Hunt", id: "E345", marks: 85 },
//     {rank:6,name:"pruthviraj patil",id:"1708",marks:90},
//     {rank:6,name:"pruthviraj patil",id:"1708",marks:90},
//     {rank:6,name:"pruthviraj patil",id:"1708",marks:90},
//     {rank:6,name:"pruthviraj patil",id:"1708",marks:90},
//     {rank:6,name:"pruthviraj patil",id:"1708",marks:90}
//   ];
  
//   // Populate leaderboard
//   const leaderboardList = document.getElementById("leaderboard-list");
  
//   leaderboardData.forEach((entry) => {
//     const listItem = document.createElement("li");
//     listItem.innerHTML = `
//       <div class="rank"><i class="fas fa-trophy"></i> #${entry.rank}</div>
//       <div class="info">
//         <h4>${entry.name}</h4>
//         <span>ID: ${entry.id}</span>
//       </div>
//       <div class="marks">${entry.marks}</div>
//     `;
//     leaderboardList.appendChild(listItem);
//   });
