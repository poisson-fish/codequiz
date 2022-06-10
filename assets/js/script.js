const startButton = document.getElementById("startButton");
const carouselContainer = document.getElementById('carouselContainer');
const carouselData = new bootstrap.Carousel(carouselContainer.parentElement, {
    interval: false,
    keyboard: false,
    pause: false,
    touch: false,
    wrap: false
});
const cardDelay = 750;
const quizQuestions = data;

const savedState = localStorage.getItem('appstate');
const appState = savedState ? savedState : {
    currentQuestion: 0,
    answers: []
};

var countdownTimer = 60.0;
var countdownInterval;


function createNewCarouselCard(question, index) {
    const carItem = document.createElement('div');
    carItem.className = 'carousel-item';
    carItem.setAttribute("data-qid", index);

    const newCard = document.createElement('div');
    newCard.className = 'card text-center';
    newCard.innerHTML = `
<div class="card-header" id="cardHeader">
    <i class="fa fa-question-circle" aria-hidden="true"></i>
    ${countdownTimer} seconds remaining!
</div>
<div class="card-body" id="cardBody">
    <h5 class="card-title" id="questionTitle">${question.title}</h5>
    <p class="card-text" id="questionText">${question.question}</p>
    <ul class="list-group" id="answerList">
    </ul>
</div>
<div class="card-footer text-muted">
    <div class="container-fluid">
            <div class="progress" style="width: 100%">
            <div id="progressBar" class="progress-bar bg-info" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
   
    </div>
</div>`;
    const answerList = newCard.querySelector('#answerList');
    question.options
        .map((value, index) => ({ val: value, sort: Math.random(), idx: index })) //put each element in the array in an object, and give it a random sort key along with its original position
        .sort((a, b) => a.sort - b.sort) //sort using the random key
        .forEach((answer) => {
            //List item
            const questionLi = document.createElement('li');
            questionLi.className = 'list-group-item';
            questionLi.setAttribute("data-answerid", answer.idx);

            //Answer Button
            const questionButton = document.createElement('a');
            questionButton.href = '#';
            questionButton.className = 'btn btn-primary';
            questionButton.style = 'width: 100%; height: 100%;'
            questionButton.textContent = decodeURIComponent(answer.val);
            questionButton.onclick = (e) => {
                const answerid = e.target.parentElement.getAttribute('data-answerid');
                const footer = newCard.querySelector("#cardBody");

                if (answerid == question.answer) {
                    displayAlert(footer, "Correct!", 'alert-success');
                    setTimeout(() => {
                        appState.currentQuestion++;
                        carouselData.next();
                    }, cardDelay);
                }
                else {
                    displayAlert(footer, "Incorrect!", 'alert-danger');
                    countdownTimer -= 10;
                }

            };
            carItem.appendChild(newCard);
            questionLi.appendChild(questionButton);
            answerList.appendChild(questionLi);
        });
    return carouselContainer.appendChild(carItem);
}

function start() {
    const questionNum = appState.currentQuestion;
    if (questionNum >= quizQuestions.length) return;
    const question = quizQuestions[questionNum];

    //Clear carousel 
    //carouselContainer.innerHTML = '';
    quizQuestions.forEach((question, index) => {
        createNewCarouselCard(question, index);
    });

    const timeResolution = 0.5;
    countdownTimer = 60.0;
    countdownInterval = setInterval(() => {
        countdownTimer -= timeResolution;
        document.querySelectorAll("#cardHeader").forEach((timerText) => {
            timerText.innerHTML = `
            <i class="fa fa-question-circle" aria-hidden="true"></i>
            ${Math.floor(countdownTimer)} seconds remaining!
            `;
        });
        const currentCompletion = (appState.currentQuestion / quizQuestions.length) * 100;
        document.querySelectorAll("#progressBar").forEach((progressBar) => 
        {
            progressBar.style = `width: ${currentCompletion}%`;
            progressBar.ariaValueNow = currentCompletion;
        });
    }, timeResolution * 1000);

}

function displayAlert(cardBody, alertText, alertType) {
    //Wipe all alerts in the card
    var alertList = cardBody.querySelectorAll('.alert')
    alertList.forEach(function (alert) {
        cardBody.removeChild(alert);
    })

    const newAlert = document.createElement('div');
    newAlert.className = `alert ${alertType} fade show`;
    newAlert.role = 'alert';
    newAlert.textContent = alertText;

    const alertButton = document.createElement('button');
    alertButton.class = 'close';
    alertButton.dataDismiss = 'alert';
    alertButton.ariaLabel = 'Close';

    const buttonSpan = document.createElement('span');
    buttonSpan.ariaHidden = 'true';
    buttonSpan.textContent = 'X';

    //alertButton.appendChild(buttonSpan);
    //newAlert.appendChild(alertButton);
    cardBody.appendChild(newAlert);

    const alertBs = new bootstrap.Alert(newAlert);
    setTimeout((alert) => alert.close(), cardDelay, alertBs);
}
function answerCurrentQuestion(selectedAnswer) {

}


startButton.onclick = (e) => {
    start();
    carouselData.next();
};

