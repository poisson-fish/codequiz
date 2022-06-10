
const carouselContainer = document.getElementById('carouselContainer');

const quizQuestions = data;

const savedState = localStorage.getItem('appstate');
const appState = savedState ? savedState : {
    currentQuestion: 0,
    activeCard: null,
    answers: []
};


function createNewCarouselCard(question) {
    const carItem = document.createElement('div');
    carItem.className = 'carousel-item';

    const newCard = document.createElement('div');
    newCard.className = 'card text-center';
    newCard.innerHTML = `<div class="card-header">
    <i class="fa fa-question-circle" aria-hidden="true"></i>
    Quiz!
</div>
<div class="card-body" id="cardBody">
    <h5 class="card-title" id="questionTitle">${question.title}</h5>
    <p class="card-text" id="questionText">${question.question}</p>
    <ul class="list-group" id="answerList">
    </ul>
</div>
<div class="card-footer text-muted">
    <div class="container-fluid">
        <div class="row">
            <div class="col">

            </div>
            <div class="col" style="text-align: center; ">
                <div class="progress">
                    <div class="progress-bar" role="progressbar" aria-valuenow="25"
                        aria-valuemin="0" aria-valuemax="100">
                    </div>
                </div>
            </div>
            <div class="col">
                
            </div>
        </div>
    </div>
</div>`;
    const answerList = newCard.querySelector('#answerList');
    question.options.forEach((answer, index) => {
        //List item
        const questionLi = document.createElement('li');
        questionLi.className = 'list-group-item';
        questionLi.setAttribute("data-answerid", index);

        //Answer Button

        const questionButton = document.createElement('a');
        questionButton.href = '#';
        questionButton.className = 'btn btn-primary';
        questionButton.style = 'width: 100%; height: 100%;'
        questionButton.textContent = decodeURIComponent(answer);
        questionButton.onclick = (e) => {
            const answer = e.target.parentElement.getAttribute('data-answerid');
            const footer = newCard.querySelector("#cardBody");

            if (answer == question.answer) {
                displayAlert(footer, "Correct!", 'alert-success');
            }
            else {
                displayAlert(footer, "Incorrect!", 'alert-danger');
            }

        };
        carItem.appendChild(newCard);
        questionLi.appendChild(questionButton);
        answerList.appendChild(questionLi);
    });
    return carouselContainer.appendChild(carItem);
}

function updateUI() {
    const questionNum = appState.currentQuestion;
    if (questionNum >= quizQuestions.length) return;
    const question = quizQuestions[questionNum];

    createNewCarouselCard(question);



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
    setTimeout((alert) => alert.close(), 5000, alertBs);
}
function answerCurrentQuestion(selectedAnswer) {

}

updateUI();


