const start = document.getElementById("start");
const choises = document.getElementById("choises");
// const Java = document.getElementById("Java");
// const JavaScript = document.getElementById("JavaScript");
// const JQuery = document.getElementById("JQuery");
const choiceA = document.getElementById("A");
const choiceB = document.getElementById("B");
const choiceC = document.getElementById("C");

const counter = document.getElementById("counter");
const timeGauge = document.getElementById("timeGauge");
const scoreDiv = document.getElementById("scoreContainer");
const questionTime = 10; // 10s
const gaugeWidth = 150; // 150px
const gaugeUnit = gaugeWidth / questionTime;

const quiz = document.getElementById("quiz");
const question = document.getElementById("question");
const progress = document.getElementById("progress");
let runningQuestion = 0;
let count = 0;
let TIMER;
let score = 0;


let questionsURL = "http://localhost:5555/~lisaval/Eesrakenduste/iseseisev3/kysimused.txt"
let answersURL = "http://localhost:5555/~lisaval/Eesrakenduste/iseseisev3/vastused.txt"
let quizContent = [];
let quizAnswers = [];
let secret;
let answer;



window.onload = function(){
    start.addEventListener("click", startQuiz);
    readText();
    readText2();
}

//loe küsimuste fail sisse
function readText(){
    let webReq = new XMLHttpRequest();
        webReq.open("GET", questionsURL, true);
	    webReq.onreadystatechange = function(){
		console.log(webReq.readyState);
		console.log(webReq.status);
		if(webReq.readyState == 4 && webReq.status == 200){
			buildQuiz(webReq.responseText);
		}
	};
	webReq.send(null);
	
}
//loe vastuste fail sisse
function readText2(){
    let webReq = new XMLHttpRequest();
        webReq.open("GET", answersURL, true);
	    webReq.onreadystatechange = function(){
		console.log(webReq.readyState);
		console.log(webReq.status);
		if(webReq.readyState == 4 && webReq.status == 200){
			buildQuiz2(webReq.responseText);
		}
	};
	webReq.send(null);
	
}

//tee massiiv küsimuste ja vastuste failist
function buildQuiz(fromFile){
	console.log(fromFile);
	let tempArray = fromFile.split("|");
	console.log(tempArray);
	for(let i = 0; i < tempArray.length; i ++){
		quizContent.push(tempArray[i].split(";"));
	}
    console.log(quizContent);    
	renderQuestion();
}

function buildQuiz2(fromFile){
	console.log(fromFile);
	let tempArray2 = fromFile.split("|");
	console.log(tempArray2);
	for(let i = 0; i < tempArray2.length; i ++){
		quizAnswers.push(tempArray2[i].split(";"));
	}
    console.log(quizAnswers);
	renderQuestion();
}


const lastQuestion = quizContent.length - 1;

// koosta küsimus
function renderQuestion(){
    if(quizContent.length > 0){
        let randomNum = Math.round(Math.random() * (quizContent.length-1));
        console.log(randomNum);
        document.getElementById("question").innerHTML = quizContent[randomNum][0];
        document.getElementById("A").innerHTML = quizAnswers[randomNum][0];
        document.getElementById("B").innerHTML = quizAnswers[randomNum][1];
        document.getElementById("C").innerHTML = quizAnswers[randomNum][2];

		secret = quizContent[randomNum][1];
		quizContent.splice(randomNum, 1);
        // console.log(quizContent);
        console.log(secret);

        // if(secret == quizAnswers[randomNum][0]){
        //     answer = quizAnswers[randomNum][0];
        // } 
        // else if(secret == quizAnswers[randomNum][1]){
        //     answer = quizAnswers[randomNum][1];
        // } 
        // else {
        //     answer = quizAnswers[randomNum][2];
        //  }
    }
}


// alusta viktoriiniga
function startQuiz(){
    start.style.display = "none";
    renderQuestion();
    quiz.style.display = "block";
    renderProgress();
    renderCounter();
    TIMER = setInterval(renderCounter,1000); // 1000ms = 1s
}

// näita küsimuste progressi
function renderProgress(){
    for(let qIndex = 0; qIndex <= (quizContent.length); qIndex++){
        progress.innerHTML += "<div class='prog' id="+ qIndex +"></div>";
    }
}
// aeg
function renderCounter(){
    if(count <= questionTime){
        counter.innerHTML = count;
        timeGauge.style.width = count * gaugeUnit + "px";
        count++
    }else{
        count = 0;
        // muuda progressi värv punaseks
        // answerIsWrong();
        if(runningQuestion < lastQuestion){
            runningQuestion++;
            renderQuestion();
        }else{
            // lõpeta viktoriin ja näita tulemus
            clearInterval(TIMER);
        }
    }
}


function checkAnswer(secret){
    if(secret == document.getElementById("").value){
        // õige vastus
        score++;
        // muuda progressi värv roheliseks
        answerIsCorrect();
    }else{
        // vale vastus; muuda progressi värv punaseks
        answerIsWrong();
    }
    count = 0;
    if(runningQuestion < lastQuestion){
        runningQuestion++;
        renderQuestion();
    }else{
        // lõpeta ja näita tulemus
        clearInterval(TIMER);
        // scoreRender();
    }
}

//õige vastus
function answerIsCorrect(){
    document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
}

// vale vastus
function answerIsWrong(){
    document.getElementById(runningQuestion).style.backgroundColor = "#f00";
}

// tulemus
function scoreRender(){
    scoreDiv.style.display = "block";
    
    // kalkuleeri vastuste protsent
    const scorePerCent = Math.round(100 * score/lastQuestion);
    
    // vali vastav pilt
    let img = (scorePerCent >= 80) ? "img/5.png" :
              (scorePerCent >= 60) ? "img/4.png" :
              (scorePerCent >= 40) ? "img/3.png" :
              (scorePerCent >= 20) ? "img/2.png" :
              "img/1.png";
    
    scoreDiv.innerHTML = "<img src="+ img +">";
    scoreDiv.innerHTML += "<p>"+ scorePerCent +"%</p>";
}