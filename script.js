// Global variables
var timeLeft = 60;
var timerInterval;
var score = 0;
var correct;
var currentQuestionIndex = 0;
var penaltyForIncorrectAnswerInSeconds = 5;

//homepage-container elements for DOM manipulation
var homePageDiv = document.getElementById("homepage-container")
var btnQuizStart = document.getElementById("start-btn");
var btnHomePageHighScores = document.getElementById("homepagehighscore");

//question-container elements for DOM manipulation
var questionContainerDiv = document.getElementById("question-container");
var quizTimerDiv = document.getElementById("timer-container");
var quizQuestionsEl = document.getElementById("quiz-questions");
var btnAnswerSelectionA = document.getElementById("a");
var btnAnswerSelectionB = document.getElementById("b");
var btnAnswerSelectionC = document.getElementById("c");
var btnAnswerSelectionD = document.getElementById("d");

//gameoverpage-container elements for DOM manipulation
var gameOverDiv = document.getElementById("gameoverpage-container");
var finalScoreEl = document.getElementById("finalscore-container");
var gameOverPageHighScoreInitials = document.getElementById("initials");
var btnGameOverPageSubmitScore = document.getElementById("submitscore");

//highscore-container elements for DOM manipulation
var highScoreContainerDiv = document.getElementById("highscore-container");
var highScorePageDiv = document.getElementById("highscorepage-container");
var highScorePageInitialsDiv = document.getElementById("highscorepageinitials-container");
var highScorePageScoreDiv = document.getElementById("highscorepagescore-conatiner");
var btnFinishGame = document.getElementById("endgame-btn");
var btnPlayAgain = document.getElementById("playagain-btn");
var btnClearHighScore = document.getElementById("clearhighscore-btn");

// Quiz question object creation
var quizQuestions = [{
    question: "Which of the following is correct about JavaScript?",
    choiceA: "JavaScript is a lightweight, interpreted programming language.",
    choiceB: "JavaScript has object-oriented capabilities that allows you to build interactivity into otherwise static HTML pages.",
    choiceC: "The general-purpose core of the language has been embedded in Netscape, Internet Explorer, and other web browsers.",
    choiceD: "All of the above.",
    correctAnswer: "d"},
  {
    question: "Which of the following is the correct syntax to print a page using JavaScript?",
    choiceA: "window.print();",
    choiceB: "browser.print();",
    choiceC: "navigator.print();",
    choiceD: "document.print();",
    correctAnswer: "a"},
   {
    question: "Which of the following type of variable is visible only within a function where it is defined?",
    choiceA: "global variable.",
    choiceB: "local variable.",
    choiceC: "Both of the above.",
    choiceD: "None of the above.",
    correctAnswer: "b"},
    {
    question: "Which of the following function of Number object forces a number to display in exponential notation?",
    choiceA: "toExponential()",
    choiceB: "toFixed()",
    choiceC: "toPrecision()",
    choiceD: "toLocaleString()",
    correctAnswer: "a"},
    {
    question: "Which of the following function of String object returns the character at the specified index?",
    choiceA: "charAt()",
    choiceB: "charCodeAt()",
    choiceC: "concat()",
    choiceD: "indexOf()",
    correctAnswer: "a"},  
    {
    question: "Which of the following function of String object returns the index within the calling String object of the first occurrence of the specified value?",
    choiceA: "substr()",
    choiceB: "search()",
    choiceC: "lastIndexOf()",
    choiceD: "indexOf()",
    correctAnswer: "d"},
    {
    question: "Which of the following function of String object returns a string representing the specified object?",
    choiceA: "toLocaleUpperCase()",
    choiceB: "toUpperCase()",
    choiceC: "toString()",
    choiceD: "substring()",
    correctAnswer: "c"},
    {
    question: "Which of the following function of String object causes a string to be displayed as a superscript, as if it were in a  tag?",
    choiceA: "sup()",
    choiceB: "small()",
    choiceC: "strike()",
    choiceD: "sub()",
    correctAnswer: "a"},  
    {
    question: "Which of the following function of Array object calls a function for each element in the array?",
    choiceA: "concat()",
    choiceB: "every()",
    choiceC: "filter()",
    choiceD: "forEach()",
    correctAnswer: "d"},  
    {
    question: "Which of the following function of Array object returns a string representing the array and its elements?",
    choiceA: "toSource()",
    choiceB: "sort()",
    choiceC: "splice()",
    choiceD: "toString()",
    correctAnswer: "d"},  
    ];

//Total count of quiz question
var lastQuestionIndex = quizQuestions.length;
// console.log("Total questions count: " +lastQuestionIndex);

// upon clicking on btnQuizStart button, quiz will start.
btnQuizStart.addEventListener("click", function startQuiz(){
    gameOverDiv.style.display = "none";
    homePageDiv.style.display = "none";
    generateQuizQuestion();
    //Timer
    timerInterval = setInterval(function() {
        timeLeft--;
        quizTimerDiv.textContent = "Time left: " + timeLeft;
    
        if(timeLeft === 0) {
          clearInterval(timerInterval);
          showScore();
        }
      }, 1000);
      questionContainerDiv.style.display = "block";
});
// Upon clicking on btnHomePageHighScores button, it displays high scores with names from local storage of the browser if any.
btnHomePageHighScores.addEventListener("click", function showHighscore(){
    homePageDiv.style.display = "none"
    gameOverDiv.style.display = "none";
    highScoreContainerDiv.style.display = "flex";
    highScorePageDiv.style.display = "block";
    btnFinishGame.style.display = "flex";
    generateHighscores();
});
// Upon clicking btnGameOverPageSubmitScore button, highscore function save and stringifies the array of high scores already saved in local storage of the browser. It also pushing current users name and score into the array and save to the local storage. Then it displays high scores with names.
btnGameOverPageSubmitScore.addEventListener("click", function highscore(){
    timeLeft = 0;
    if (gameOverPageHighScoreInitials.value === "") {
        alert("Initials cannot be blank");
        return false;
    } else {
        var savedHighscores = JSON.parse(localStorage.getItem("savedHighscores")) || [];
        var currentUser = gameOverPageHighScoreInitials.value.trim();
        var currentHighscore = {
            name: currentUser,
            score: score
        };
        gameOverDiv.style.display = "none";
        highScoreContainerDiv.style.display = "flex";
        highScorePageDiv.style.display = "block";
        btnFinishGame.style.display = "flex";

        savedHighscores.push(currentHighscore);
        localStorage.setItem("savedHighscores", JSON.stringify(savedHighscores));
        generateHighscores();
   }
});
// Upon clicking on btnPlayAgain button, it navigates to homepage where user can restart the quiz.
btnPlayAgain.addEventListener("click", function replayQuiz(){
    highScoreContainerDiv.style.display = "none";
    gameOverDiv.style.display = "none";
    homePageDiv.style.display = "flex";
    timeLeft = 60;
    score = 0;
    currentQuestionIndex = 0;
});
// Upon clicking on btnClearHighScore, it clears high scores with names from local storage of the browser if any as well as from the application.
btnClearHighScore.addEventListener("click",  function clearScore(){
    window.localStorage.clear();
    highScorePageInitialsDiv.textContent = "";
    highScorePageScoreDiv.textContent = "";
});

// generateQuizQuestion function will generate the quizQuestions object array containing the quiz questions and answers.
function generateQuizQuestion(){
    gameOverDiv.style.display = "none";
    if (currentQuestionIndex === lastQuestionIndex){
        return showScore();
    } 
    var currentQuestion = quizQuestions[currentQuestionIndex];
    quizQuestionsEl.innerHTML = "<p>" + currentQuestion.question + "</p>";
    btnAnswerSelectionA.innerHTML = currentQuestion.choiceA;
    btnAnswerSelectionB.innerHTML = currentQuestion.choiceB;
    btnAnswerSelectionC.innerHTML = currentQuestion.choiceC;
    btnAnswerSelectionD.innerHTML = currentQuestion.choiceD;
};

// showScore function is the result screen that displays users score after either completeing the quiz or time is over.
function showScore(){
    questionContainerDiv.style.display = "none"
    gameOverDiv.style.display = "flex";
    clearInterval(timerInterval);
    gameOverPageHighScoreInitials.value = "";
    finalScoreEl.innerHTML = "You did " + score + " out of " + quizQuestions.length + " correct!";
}

// validateAnswer function checks the response from the user to each answer 
function validateAnswer(answer){
    correct = quizQuestions[currentQuestionIndex].correctAnswer;
    if (answer === correct && currentQuestionIndex !== lastQuestionIndex){
        score++;
        alert("Correct Answer");
        currentQuestionIndex++;
        generateQuizQuestion();
    }else if (answer !== correct && currentQuestionIndex !== lastQuestionIndex){
        alert("Incorrect Answer")
        timeLeft -= penaltyForIncorrectAnswerInSeconds;
        currentQuestionIndex++;
        generateQuizQuestion();
    }else{
        showScore();
    }
}

// This function clears the list for the high scores and generates a new high score list from local storage
function generateHighscores(){
    highScorePageInitialsDiv.innerHTML = "";
    highScorePageScoreDiv.innerHTML = "";
    var highscores = JSON.parse(localStorage.getItem("savedHighscores")) || [];
    for (i=0; i<highscores.length; i++){
        var newNameSpan = document.createElement("li");
        var newScoreSpan = document.createElement("li");
        newNameSpan.textContent = highscores[i].name;
        newScoreSpan.textContent = highscores[i].score;
        highScorePageInitialsDiv.appendChild(newNameSpan);
        highScorePageScoreDiv.appendChild(newScoreSpan);
    }
}

