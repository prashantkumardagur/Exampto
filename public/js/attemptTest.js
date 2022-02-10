var testId = document.getElementById('h1').dataset.id;
var resultId = document.getElementById('h1').dataset.rid;
var questionPallete = document.getElementById("questionPallete");
var Qnum = document.getElementById("Qnum");
var quesDiv = document.getElementById("quesDiv");
var optionsDiv = document.getElementById("options");

var currentQuestion = 0;
var mytest = {};
var Qbtns = [];
var answers = [];

window.onload = async () => {
    var requestTest = await fetch(`/attempttest/${testId}/requesttest`).then(res => res.json());
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
    }
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

    let dbAnswers = await fetch(`/attempttest/${resultId}/getanswers`).then(res => res.json());
    answers = dbAnswers.data;
    if(!answers.length) answers = new Array(num).fill(0);
    else { for(let i=0; i<num; ++i) { if(answers[i] !== 0) Qbtns[i].classList.add("marked"); } }
}

const saveAnswers = async () => {
    let saveResponse = await fetch(`/attempttest/${resultId}/saveanswers`, {
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

