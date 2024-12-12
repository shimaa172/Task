//  inputs
var signupFirstname = document.getElementById('signupFirstName')
var signupLastname = document.getElementById('signupLastName')
var signupEmail = document.getElementById('signupEmail')
var signupPassword = document.getElementById('signupPassword')
var signinEmail = document.getElementById('signinEmail')
var signinPassword = document.getElementById('signinPassword')


var signUpArray = []
if (localStorage.getItem('users') == null) {
    signUpArray = []
} else {
    signUpArray = JSON.parse(localStorage.getItem('users'))
}


//for check inputs is empty or not
function isEmpty() {

    if (signupFirstname.value == "" || signupLastname.value == "" || signupEmail.value == "" || signupPassword.value == "") {
        return false
    } else {
        return true
    }
}


// for check email is exist
function isEmailExist() {
    for (var i = 0; i < signUpArray.length; i++) {
        if (signUpArray[i].email.toLowerCase() == signupEmail.value.toLowerCase()) {
            return false
        }
    }
}


function signUp() {
    if (isEmpty() == false) {
        document.getElementById('exist').innerHTML = '<span class="text-danger m-3">All inputs is required</span>'
        return false
    }
    // to store all value as object
    var signUp = {
        firstname: signupFirstname.value,
        lastname: signupFirstname.value,
        email: signupEmail.value,
        password: signupPassword.value,
    }
    if (signUpArray.length == 0) {
        signUpArray.push(signUp)
        localStorage.setItem('users', JSON.stringify(signUpArray))
        document.getElementById('exist').innerHTML = '<span class="text-success m-3">Success</span>'
        return true
    }
    if (isEmailExist() == false) {
        document.getElementById('exist').innerHTML = '<span class="text-danger m-3">email already exists</span>'

    } else {
        signUpArray.push(signUp)
        localStorage.setItem('users', JSON.stringify(signUpArray))
        document.getElementById('exist').innerHTML = '<span class="text-success m-3">Success</span>'

    }


}


// ============= for login================//

//for check inputs is empty or not
function isLoginEmpty() {

    if (signinPassword.value == "" || signinEmail.value == "") {
        return false
    } else {
        return true
    }
}

var demo = document.getElementById('login_btn');

function login() {
    if (isLoginEmpty() == false) {
        document.getElementById('incorrect').innerHTML = '<span class="text-danger m-3">All inputs is required</span>'
        return false
    }
    var password = signinPassword.value
    var email = signinEmail.value
    for (var i = 0; i < signUpArray.length; i++) {
        if (signUpArray[i].email.toLowerCase() == email.toLowerCase() && signUpArray[i].password.toLowerCase() == password.toLowerCase()) {
            localStorage.setItem('sessionUsername', signUpArray[i].firstname)
            document.getElementById('incorrect').innerHTML = '<span class="text-success m-3">Success</span>'
            demo.setAttribute('href', 'Exam.html');

        } else {
            document.getElementById('incorrect').innerHTML = '<span class="p-2 text-danger">incorrect email or password</span>'
        }
    }

}



// ==================for exam===================//


const questions = [
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: "4"
    },
    {
        question: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Rome"],
        answer: "Paris"
    },
    {
        question: "What is the largest planet in our solar system?",
        options: ["Jupiter", "Saturn", "Mars", "Earth"],
        answer: "Jupiter"
    }
];

let shuffledQuestions = shuffleArray(questions);
let currentQuestionIndex = 0;
let userAnswers = [];
let examEndTime = new Date().getTime() + 1 * 60 * 1000; // 1 minute

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function displayQuestion() {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    document.querySelector(".question-number").innerText = `Question ${currentQuestionIndex + 1}/${shuffledQuestions.length}`;
    document.getElementById("question").innerText = currentQuestion.question;
    const optionsElement = document.getElementById("options");
    optionsElement.innerHTML = "";

    currentQuestion.options.forEach((option) => {
        let input = document.createElement("input");
        input.type = "radio";
        input.name = `answer_${currentQuestionIndex}`;
        input.value = option;
        input.id = `q${currentQuestionIndex}_${option}`;
        let label = document.createElement("label");
        label.htmlFor = `q${currentQuestionIndex}_${option}`;
        label.innerText = option;
        optionsElement.appendChild(input);
        optionsElement.appendChild(label);
        optionsElement.appendChild(document.createElement("br"));
    });
}

function nextQuestion() {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        document.getElementById("next-button").style.display = "none";
        document.getElementById("submit-button").style.display = "inline";
    }
}

function submitExam() {
    userAnswers = [];
    shuffledQuestions.forEach((q, index) => {
        let selectedOption = document.querySelector(`input[name=answer_${index}]:checked`);
        userAnswers.push(selectedOption ? selectedOption.value : null);
    });
    document.getElementById("submit-button").style.display = "none";
    document.getElementById("grade-button").style.display = "inline";
}

function showGrades() {
    let currentTime = new Date().getTime();
    let userName = prompt("Please enter your name:"); // Get username from user
    if (currentTime > examEndTime) {
        document.getElementById("exam-container").innerHTML = `
            <h2>Timeout Page</h2>
            <p>Sorry, ${userName || "User"}, time's up. Please submit your exam earlier next time.</p>`;
    } else {
        let correctAnswers = shuffledQuestions.filter((q, index) => q.answer === userAnswers[index]).length;
        document.getElementById("exam-container").innerHTML = `
            <h2>Grades Page</h2>
            <p>Congratulations, ${userName || "User"}! You have completed the exam.</p>
            <p>Correct Answers: ${correctAnswers}/${shuffledQuestions.length}</p>`;
    }
}

function updateTimer() {
    let currentTime = new Date().getTime();
    let timeRemaining = Math.max(0, examEndTime - currentTime);
    let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    document.getElementById("countdown").innerText = `${minutes}m ${seconds}s`;

    if (timeRemaining === 0) {
        showGrades();
    }
}

displayQuestion();
updateTimer();
setInterval(updateTimer, 1000);