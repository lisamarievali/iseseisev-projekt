// select all elements
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


// render a question
function renderQuestion(){

    let q = quizQuestions[runningQuestion];

    question.innerHTML = q.question;
    answerA.text(q.options.A.value);
    answerB.text(q.options.B.value);
    answerC.text(q.options.C.value);

    quiz.style.display = "block";
}


// start quiz

// render progress
function renderProgress(){
    for(let qIndex = 0; qIndex < quizQuestions.length; qIndex++){
        progress.innerHTML += "<div class='prog' id="+ qIndex +"></div>";
    }
}

// counter render
function renderCounter(){
    if(count <= questionTime){
        counter.innerHTML = count;
        timeGauge.style.width = count * gaugeUnit + "px";
        count++
    }else{
        count = 0;
        // change progress color to red
        answerIsWrong();
        if(runningQuestion < quizQuestions.length - 1){
            runningQuestion++;
            renderQuestion();
        }else{
            // end the quiz and show the score
            clearInterval(TIMER);
            scoreRender();
        }
    }
}

function scoreRender(){
    scoreDiv.style.display = "block";
    
    // calculate the amount of question percent answered by the user
    const scorePerCent = Math.round(100 * score/quizQuestions.length);
    
    // choose the image based on the scorePerCent
    let img = (scorePerCent >= 80) ? "5.png" :
              (scorePerCent >= 60) ? "img/4.png" :
              (scorePerCent >= 40) ? "img/3.png" :
              (scorePerCent >= 20) ? "img/2.png" :
              "img/1.png";
    
    $("#scoreImage").attr("src", img);
    $("#scorePerCent").text(scorePerCent + "%");
}

function checkAnswer(option){

    let q = quizQuestions[runningQuestion];

    if(option == q.correct){
        // answer is correct
        score++;
        // change progress color to green
        answerIsCorrect();
    } else{
        // answer is wrong
        // change progress color to red
        answerIsWrong();
    }
    count = 0;
    if(runningQuestion < quizQuestions.length - 1){
        runningQuestion++;
        renderQuestion();
    }else{
        // end the quiz and show the score
        clearInterval(TIMER);
        scoreRender();
    }
}

function answerIsCorrect(){
    document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
}

// answer is Wrong
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