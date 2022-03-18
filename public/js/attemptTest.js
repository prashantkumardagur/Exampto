var testId = document.getElementById('h1').dataset.id;
var resultId = document.getElementById('h1').dataset.rid;
var questionPallete = document.getElementById("questionPallete");
var Qnum = document.getElementById("Qnum");
var quesDiv = document.getElementById("quesDiv");
var optionsDiv = document.getElementById("options");
var timer = document.getElementById("timer");

var currentQuestion = 0;
var mytest = {};
var Qbtns = [];
var answers = [];
var userStartedOn = Date.now();
var timeRemaining = 60;

window.onload = async () => {
    var requestTest = await fetch(`/api/attempttest/${testId}/requesttest`).then(res => res.json());
    if (requestTest.status !== "success") {
        console.log(requestTest.message);
        showAlert(requestTest.message, "error");
    } else {
        mytest = requestTest.data;
        await createPalleteBtns(mytest.contents.length);
        loadQuestion(0);

        document.getElementById('flagBtn').addEventListener("click", flagger);
        document.getElementById('backBtn').addEventListener("click", () => { loadQuestion(currentQuestion-1); });
        document.getElementById('nextBtn').addEventListener("click", () => { loadQuestion(currentQuestion+1); });
        document.getElementById('unselectBtn').addEventListener("click", () => { removeSelection(); saveAnswers(); });

        initializeTimer();
    }

    window.addEventListener('visibilitychange', userBlurred);
}

const userBlurred = async (e) => {
    if(document.visibilityState === "hidden") {
        let disconnectionRequest = await fetch(`/api/attempttest/${resultId}/disconnectionEncountered`).then(res => res.json());
        if(disconnectionRequest.status !== "success") console.log(disconnectionRequest);
        else console.log("Disconnection added");
    }
    if(document.visibilityState == 'visible'){
        alert("You were found inactive. Your test will be submitted automatically after some more disconnections.");
    }
}

const initializeTimer = () => {
    timeRemaining = mytest.duration*60 - Math.floor((Date.now() - userStartedOn)/1000);
    window.setInterval(updateTimer, 1000);
}
function updateTimer(){
    if(timeRemaining<1) return;
    --timeRemaining;
    let minutesRemaining = Math.floor(timeRemaining/60);
    let secondsRemaining = timeRemaining%60;
    timer.innerHTML = `${minutesRemaining} : ${secondsRemaining}`;
}

const createPalleteBtns = async (num) => {
    for(let i = 0; i < num; i++) {
        let Qbtn = document.createElement("button");
        Qbtn.className = "Qbtn";
        Qbtn.innerHTML = i+1;
        Qbtn.addEventListener("click", () => { loadQuestion(i); });
        questionPallete.appendChild(Qbtn);
    }
    Qbtns = document.getElementsByClassName("Qbtn");

    let dbAnswers = await fetch(`/api/attempttest/${resultId}/getanswers`).then(res => res.json());
    userStartedOn = new Date(dbAnswers.data.meta.startedOn).getTime();
    answers = dbAnswers.data.responses;
    if(answers) { for(let i=0; i<num; ++i) { if(answers[i] && answers[i] !== 0) Qbtns[i].classList.add("marked"); } }
    else answers = new Array(num).fill(0);
}

const saveAnswers = async () => {
    let saveResponse = await fetch(`/api/attempttest/${resultId}/saveanswers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: answers })
    }).then(res => res.json());

    if (saveResponse.status !== "success") showAlert(saveResponse.message, "error");
}

const flagger = () => {
    Qbtns[currentQuestion].classList.contains('flagged') ? 
    Qbtns[currentQuestion].classList.remove('flagged') : Qbtns[currentQuestion].classList.add('flagged');
}

const removeSelection = () => {
    answers[currentQuestion] = 0;
    Qbtns[currentQuestion].classList.remove("marked");
    let options = document.getElementsByTagName("li");
    for(let i = 0; i < options.length; i++) options[i].classList.remove("selected");
}

const loadQuestion = (index) => {
    if(index < 0) index = 0;
    else if(index >= mytest.contents.length) index = mytest.contents.length-1;
    content = mytest.contents[index];

    Qbtns[currentQuestion].classList.remove("current");
    currentQuestion = index;
    Qbtns[currentQuestion].classList.add("current", "visited");

    Qnum.innerHTML = index+1;
    quesDiv.innerHTML = content.question;
    options.innerHTML = "";
    content.options.forEach((option, i) => {
        let optionLi = document.createElement("li");
        if(i+1 === answers[currentQuestion]) { optionLi.classList.add("selected"); }
        optionLi.innerHTML = option;
        optionLi.addEventListener("click", () => { 
            removeSelection();
            answers[currentQuestion] = i+1;
            optionLi.classList.add("selected");
            Qbtns[currentQuestion].classList.add("marked");
            saveAnswers();
        });
        optionsDiv.appendChild(optionLi);
    });
}

