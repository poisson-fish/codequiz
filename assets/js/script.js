/* eslint-disable no-undef */
const startButton = document.getElementById('startButton')
const carouselContainer = document.getElementById('carouselContainer')
const carouselData = new bootstrap.Carousel(carouselContainer.parentElement, {
  interval: false,
  keyboard: false,
  pause: false,
  touch: false,
  wrap: false
})
const cardDelay = 750
const quizQuestions = data
let gameOverCard = {}

const appState = {
  currentQuestion: 0
}

let countdownTimer = 60.0
let countdownInterval

function createNewCarouselCard (question, index) {
  const carItem = document.createElement('div')
  carItem.className = 'carousel-item'
  carItem.setAttribute('data-qid', index)

  const newCard = document.createElement('div')
  newCard.className = 'card text-center'
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
    <div id="alertMount" style="height: 50px">
    </div>
</div>
<div class="card-footer text-muted">
    <div class="container-fluid">
            <div class="progress" style="width: 100%">
            <div id="progressBar" class="progress-bar bg-info" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
    </div>
</div>`
  const answerList = newCard.querySelector('#answerList')
  question.options
    .map((value, index) => ({ val: value, sort: Math.random(), idx: index })) // put each element in the array in an object, and give it a random sort key along with its original position
    .sort((a, b) => a.sort - b.sort) // sort using the random key
    .forEach((answer) => {
      // List item
      const questionLi = document.createElement('li')
      questionLi.className = 'list-group-item'
      questionLi.setAttribute('data-answerid', answer.idx)

      // Answer Button
      const questionButton = document.createElement('a')
      questionButton.href = '#'
      questionButton.className = 'btn btn-primary'
      questionButton.style = 'width: 100%; height: 100%;'
      questionButton.textContent = decodeURIComponent(answer.val)
      questionButton.onclick = (e) => {
        const answerid = e.target.parentElement.getAttribute('data-answerid')
        const footer = newCard.querySelector('#alertMount')

        // eslint-disable-next-line eqeqeq
        if (answerid == question.answer) {
          displayAlert(footer, 'Correct!', 'alert-success')
          setTimeout(() => {
            if ((appState.currentQuestion + 2) > quizQuestions.length) {
              end()
            } else {
              appState.currentQuestion++
              carouselData.next()
            }
            const currentCompletion = (appState.currentQuestion / (quizQuestions.length - 1)) * 100
            document.querySelectorAll('#progressBar').forEach((progressBar) => {
              progressBar.style = `width: ${currentCompletion}%`
              progressBar.ariaValueNow = currentCompletion
            })
          }, cardDelay)
        } else {
          displayAlert(footer, 'Incorrect!', 'alert-danger')
          countdownTimer -= 10
          if (countdownTimer < 0) {
            countdownTimer = 0
            end()
          }
        }
      }
      carItem.appendChild(newCard)
      questionLi.appendChild(questionButton)
      answerList.appendChild(questionLi)
    })
  return carouselContainer.appendChild(carItem)
}

function start () {
  const questionNum = appState.currentQuestion
  if (questionNum >= quizQuestions.length) return

  // Clear carousel
  quizQuestions.forEach((question, index) => {
    createNewCarouselCard(question, index)
  })

  gameOverCard = document.createElement('div')
  gameOverCard.className = 'carousel-item'

  const gameOverContents = document.createElement('div')
  gameOverContents.className = 'card text-center'
  gameOverContents.innerHTML = `
<div class="card-header">
    <i class="fa fa-question-circle" aria-hidden="true"></i>
    Game Over!
</div>
<div class="card-body" id="cardBody">
    <h5 class="card-title">Game Over!</h5>
    <p class="card-text" id="finalScoreText"></p>
    <div class="input-group input-group-sm mb-3">
    <span class="input-group-text" id="inputGroup-sizing-sm">Initials</span>
    <input id="initialsInput" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
    </div>
    <a href="#" id="saveScoreBtn" class="btn btn-primary" style="width: 100%; height: 100%;">Save Highscore</a></div>
</div>
<div class="card-footer text-muted">
    <div class="container-fluid">
            <div class="progress" style="width: 100%">
            <div id="progressBar" class="progress-bar bg-info" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
   
    </div>
</div>`

  gameOverCard.appendChild(gameOverContents)
  carouselContainer.appendChild(gameOverCard)

  saveScoreBtn = document.getElementById('saveScoreBtn')
  saveScoreBtn.onclick = (e) => {
    const initials = document.getElementById('initialsInput').value
    const scoreList = JSON.parse(localStorage.getItem('hs')) || []

    const foundPrev = scoreList.filter((score) => score.player === initials)
    if (foundPrev.length > 0) {
      foundPrev[0].score = Math.max(foundPrev[0].score, countdownTimer)
    } else {
      scoreList.push({
        player: initials,
        score: countdownTimer
      })
    }
    localStorage.setItem('hs', JSON.stringify(scoreList))
    const scoreHtml = scoreList
      .sort((a, b) => b.score - a.score)
      .map((entry) => `<li class="list-group-item">${entry.player}: ${entry.score}</li>`)
      .join('')

    scoreBoardMount = document.getElementById('scoreBoardMount')
    scoreBoardMount.innerHTML = scoreHtml
    carouselData.next()
  }

  scoreBoardCard = document.createElement('div')
  scoreBoardCard.className = 'carousel-item'

  const scoreBoardContents = document.createElement('div')
  scoreBoardContents.className = 'card text-center'
  scoreBoardContents.innerHTML = `
<div class="card-header" style="height: auto">
    <i class="fa fa-question-circle" aria-hidden="true"></i>
    Score Board
</div>
<div class="card-body" id="cardBody" style="height: auto">
    <h5 class="card-title">Scores!</h5>
    <ul id="scoreBoardMount" class="list-group" style="height: auto">
    </ul>
    <a href="#" id="tryAgainBtn" class="btn btn-primary" style="width: 100%; height: 100%;">Try again!</a></div>
</div>
<div class="card-footer text-muted">
    <div class="container-fluid">
            <div class="progress" style="width: 100%">
            <div id="progressBar" class="progress-bar bg-info" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
   
    </div>
</div>`

  scoreBoardCard.appendChild(scoreBoardContents)
  carouselContainer.appendChild(scoreBoardCard)

  const tryAgainBtn = document.getElementById('tryAgainBtn')
  tryAgainBtn.onclick = (e) => {
    start()
    carouselData.to(1)
  }
  const timeResolution = 1.0
  countdownTimer = 60.0
  countdownInterval = setInterval(() => {
    countdownTimer -= timeResolution
    if (countdownTimer <= 0) {
      end()
    } else {
      document.querySelectorAll('#cardHeader').forEach((timerText) => {
        timerText.innerHTML = `
                <i class="fa fa-question-circle" aria-hidden="true"></i>
                ${Math.floor(countdownTimer)} seconds remaining!
                `
      })
    }
  }, timeResolution * 1000)
}

function end () {
  clearInterval(countdownInterval)
  appState.currentQuestion = 0
  const finalScoreT = document.getElementById('finalScoreText')
  finalScoreT.textContent = `Your score is: ${Math.round(countdownTimer)}`
  carouselData.to(quizQuestions.length + 1)
}
function displayAlert (cardBody, alertText, alertType) {
  // Wipe all alerts in the card
  const alertList = cardBody.querySelectorAll('.alert')
  alertList.forEach(function (alert) {
    cardBody.removeChild(alert)
  })

  const newAlert = document.createElement('div')
  newAlert.className = `alert ${alertType} fade show`
  newAlert.role = 'alert'
  newAlert.textContent = alertText

  cardBody.appendChild(newAlert)

  const alertBs = new bootstrap.Alert(newAlert)
  setTimeout((alert) => alert.close(), cardDelay, alertBs)
}

startButton.onclick = (e) => {
  start()
  carouselData.next()
}
