const start = document.getElementById("start");
const category = $("[data-category]");
const choises = document.getElementById("choises");

const answerA = $("#answer-A");
const answerB = $("#answer-B");
const answerC = $("#answer-C");

const choiceA = $("#A");
const choiceB = $("#B");
const choiceC = $("#C");

const counter = document.getElementById("counter");
const timeGauge = document.getElementById("timeGauge");
const scoreDiv = document.getElementById("scoreContainer");
const questionContentDiv = document.getElementById("question-content");
const questionTime = 10; // 10s
const gaugeWidth = 150; // 150px
const gaugeUnit = gaugeWidth / questionTime;

const quiz = document.getElementById("quiz");
const question = document.getElementById("question");
const progress = document.getElementById("progress");
let count = 0;
let TIMER;
let score = 0;

let quizQuestions = [];
let runningQuestion = 0;

window.onload = function() {

    category.on("click", function() { 
        initQuiz($(this).data("category"));
    });

}

function initQuiz(category) {
    
    start.style.display = "none";

    $.get("questions-" + category + ".json", function(response) {
        quizQuestions = shuffle(response);
        startQuiz();
     });
}

function startQuiz() {

    TIMER = setInterval(renderCounter,1000); // 1000ms = 1s
    renderProgress();
    renderQuestion();
}


// Küsimused
function renderQuestion(){

    let q = quizQuestions[runningQuestion];

    question.innerHTML = q.question;
    answerA.text(q.options.A.value);
    answerB.text(q.options.B.value);
    answerC.text(q.options.C.value);

    quiz.style.display = "block";
}


// Viktoriini algus


function renderProgress(){
    for(let qIndex = 0; qIndex < quizQuestions.length; qIndex++){
        progress.innerHTML += "<div class='prog' id="+ qIndex +"></div>";
    }
}


function renderCounter(){
    if(count <= questionTime){
        counter.innerHTML = count;
        timeGauge.style.width = count * gaugeUnit + "px";
        count++
    }else{
        count = 0;
        // Protsendiloendur punaseks
        answerIsWrong();
        if(runningQuestion < quizQuestions.length - 1){
            runningQuestion++;
            renderQuestion();
        }else{
            // näia skoori
            clearInterval(TIMER);
            scoreRender();
        }
    }
}

function scoreRender(){


    scoreDiv.style.display = "block";
    questionContentDiv.style.display = "none";
    
    // arvutab protsendi
    const scorePerCent = Math.round(100 * score/quizQuestions.length);
    
    // näitab pilti olenevalt protsendist
    let img = (scorePerCent >= 80) ? "5.png" :
              (scorePerCent >= 60) ? "4.png" :
              (scorePerCent >= 40) ? "3.png" :
              (scorePerCent >= 20) ? "2.png" :
              "1.png";
    
    $("#scoreImage").attr("src", img);
    $("#scorePerCent").text(scorePerCent + "%");
}

function checkAnswer(option){

    let q = quizQuestions[runningQuestion];

    if(option == q.correct){
        // vastus on õige
        score++;
        answerIsCorrect();
    } else{
        answerIsWrong();
    }
    count = 0;
    if(runningQuestion < quizQuestions.length - 1){
        runningQuestion++;
        renderQuestion();
    }else{
        clearInterval(TIMER);
        scoreRender();
    }
}

function answerIsCorrect(){
    document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
}

// vastus on vale
function answerIsWrong(){
    document.getElementById(runningQuestion).style.backgroundColor = "#f00";
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

$('#sendScore').on("click", function() {

    $.post("saveScore.php", {
        "name": $("#name").val(),
        "score": Math.round(100 * score/quizQuestions.length)
    }, function() {
        $("#scoreContainer").html("Täname! Vaata tulemusi <a href='#' onclick='showScores()'>siit</a> või <a href='#' onclick='document.location.reload()'>alusta uuesti</a>");
    });
});

function showScores() {
    $.get("scores.json", function(response) {
        let ul = $("<ul>");
        for (var i in response) {
            ul.append($("<li>" + response[i].name + " (" + response[i].score + ")</li>"))
        }

        $("#scores").html(ul);
        $("#scores").show();
     });
}

let deferredPrompt;
const pwaAddButton = document.querySelector("#start-button");

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js', {
      scope: '.'
    }).then(function (registration) {
      // Registeerimine õnnestus
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      // Registeerimine ei õnnestunud
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  // Et ei näitaks varem kui vaja
  e.preventDefault();
  deferredPrompt = e;
  //Näita kasutajale, et saab lisada seadmesse
  pwaAddButton.style.display = 'flex';

  console.log("PWA is ready to install");
});

pwaAddButton.addEventListener('click', (e) => {
  // Peida nupp
  pwaAddButton.style.display = 'none';
  // Näita valikut
  deferredPrompt.prompt();
  // Oota, et kasutaja vastaks
  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User added the PWA');
      } else {
        console.log('User dismissed the PWA prompt');
      }
      deferredPrompt = null;
    });
});