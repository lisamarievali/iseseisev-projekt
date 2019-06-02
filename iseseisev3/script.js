// select all elements
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
    // readText2();

}

//read in the file
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
//read in the file

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

//make the array
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

// render a question
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


// start quiz
function startQuiz(){
    start.style.display = "none";
    renderQuestion();
    quiz.style.display = "block";
    renderProgress();
    renderCounter();
    TIMER = setInterval(renderCounter,1000); // 1000ms = 1s
}

// render progress
function renderProgress(){
    for(let qIndex = 0; qIndex <= (quizContent.length); qIndex++){
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
        // answerIsWrong();
        if(runningQuestion < lastQuestion){
            runningQuestion++;
            renderQuestion();
        }else{
            // end the quiz and show the score
            clearInterval(TIMER);
        }
    }
}


function checkAnswer(secret){
    if(secret == document.getElementById("").value){
        // answer is correct
        score++;
        // change progress color to green
        answerIsCorrect();
    }else{
        // answer is wrong
        // change progress color to red
        answerIsWrong();
    }
    count = 0;
    if(runningQuestion < lastQuestion){
        runningQuestion++;
        renderQuestion();
    }else{
        // end the quiz and show the score
        clearInterval(TIMER);
        // scoreRender();
    }
}

function answerIsCorrect(){
    document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
}

// answer is Wrong
function answerIsWrong(){
    document.getElementById(runningQuestion).style.backgroundColor = "#f00";
}