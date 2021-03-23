let preQuestions = false;

const questionsEndpoint = 'https://quiztai.herokuapp.com/api/quiz';
fetch(questionsEndpoint)
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        startQuiz();
    });

const next = document.querySelector('.next');
const previous = document.querySelector('.previous');

const question = document.querySelector('.question');
const answers = document.querySelectorAll('.list-group-item');

const pointsElem = document.querySelector('.score');
const restart = document.querySelector('.restart');
const userScorePoint = document.querySelector('.userScorePoint');
const results = document.querySelector('.results');

let index = 0;
let points = 0;
let countOfQuestions = null;
let countOfAllAnswers = null;

const correctAnswerClass = 'correct';
const incorrectAnswerClass = 'incorrect';
const nextQuestionDirection = 'next';
const prevQuestionDirection = 'left';

const list = document.querySelector('.list');
const currentQuestion = document.querySelector('.currentQuestion');

for (let i = 0; i < answers.length; i++) {
    answers[i].addEventListener('click', doAction);
}

function doAction(event) {
    //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    }
    else {
        markInCorrect(event.target);
    }
    disableAnswers();
}

restart.addEventListener('click', (event) => {
    event.preventDefault();
    restartQuiz();
});

next.addEventListener('click', () => {
    navigateQuestion(nextQuestionDirection);
});

previous.addEventListener('click', () => {
    navigateQuestion(prevQuestionDirection);
});

function navigateQuestion(direction) {
    const countOfQuestions = preQuestions.length;

    if (direction === nextQuestionDirection && index < countOfQuestions) {
        index++;
        if (index >= preQuestions.length) {
            saveAndShowResults();
        } else {
            setQuestion(index);
            activateAnswers();
            activateNavigateButtons();
        }
    } else if (direction === prevQuestionDirection && index > 0) {
        setQuestion(--index);
        activateAnswers();
        activateNavigateButtons();
    }
}

const quizAverageLSKey = 'quiz-average';
const countOfGamesLSKey = 'games-counter';

function saveAndShowResults() {
    list.style.display = 'none';
    results.style.display = 'block';
    userScorePoint.innerHTML = points;

    const lastGamesCounter = localStorage.getItem(countOfGamesLSKey);
    const gamesCounter = lastGamesCounter != null ? parseInt(lastGamesCounter) + 1: 1;
    localStorage.setItem(countOfGamesLSKey, gamesCounter);

    const lastAvg = localStorage.getItem(quizAverageLSKey);
    const avg = lastAvg != null ? (parseFloat(lastAvg) + points) / 2 : points;
    localStorage.setItem(quizAverageLSKey, avg);
}

function restartQuiz() {
    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    list.style.display = 'block';
    results.style.display = 'none';
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();

}

function setQuestion(index) {
    clearClasses();
    const currentQuestionData = preQuestions[index];
    const countOfCurrentAnswers = currentQuestionData.answers.length;

    question.innerHTML = currentQuestionData.question;

    for (let i = 0; i < countOfAllAnswers; i++) {
        answers[i].innerHTML = currentQuestionData.answers[i];
        answers[i].style.display = i < countOfCurrentAnswers ? 'block' : 'none';
    }

    currentQuestion.innerHTML = `${index + 1} / ${countOfQuestions}`;
}

function markCorrect(elem) {
    elem.classList.add(correctAnswerClass);
}

function markInCorrect(elem) {
    elem.classList.add(incorrectAnswerClass);
}

function disableAnswers() {
    answers.forEach((answer) => {
        answer.removeEventListener('click', doAction);
    });
}

function clearClasses() {
    answers.forEach((answer) => {
       answer.classList.remove(incorrectAnswerClass);
       answer.classList.remove(correctAnswerClass);
    });
}

function activateAnswers() {
    answers.forEach((answer) => {
        answer.addEventListener('click', doAction);
    });
}

function activateNavigateButtons() {
    previous.disabled = index > 0 ? false : true;
}

function startQuiz() {
    countOfQuestions = preQuestions.length;
    countOfAllAnswers = answers.length;
    setQuestion(0);
    activateAnswers();
    activateNavigateButtons();
}

