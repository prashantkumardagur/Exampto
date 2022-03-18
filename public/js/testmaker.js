var testId = document.getElementById('h1').dataset.id;
var exit = document.getElementById('exit');
var pallete = document.getElementById('pallete');
var test = {};
var currentQuestion = 0;
var totalQuestions = 0;
var Qbtns = {};
var detailsBtn = document.getElementById('detailsBtn');
var newQuesBtn = document.getElementById('newQuesBtn');
var viewAllQuesBtn = document.getElementById('viewAllQuesBtn');
var navlinks = document.getElementsByClassName('navlink');
var Qcontents = document.getElementById('Qcontents');
var containers = document.getElementsByClassName('container');
var detailForm = document.getElementById('detailForm');
var viewQuesDiv = document.getElementById('viewQuesDiv');
var newQuesForm = document.getElementById('newQuesForm');
var newQuesNum = document.getElementById('newQuesNum');
var quesDeleteBtn = document.getElementById('quesDeleteBtn');

window.onload = async () => {

    detailsBtn.onclick = () => {
        selectNavLink(0);
        document.getElementById('testDetailsDiv').style.display = 'block';
    }
    viewAllQuesBtn.onclick = () => {
        selectNavLink(1);
        loadAllQuestions();
        document.getElementById('viewAllQuesDiv').style.display = 'block';
    }
    newQuesBtn.onclick = () => {
        selectNavLink(2);
        document.getElementById('newQuesDiv').style.display = 'block';
    }

    if(!(await getTest())) return;
    totalQuestions = test.answers.length;
    createPallete();
    createDetailForm();
    newQuesForm.onsubmit = addQuestion;
    addAutoResizeAbility();
    newQuesNum.innerHTML = totalQuestions+1;

    quesDeleteBtn.onclick = deleteQuestion;
}

// =====================================================================================

// Remove highlight from any active section
const removeHighlight= () => {
    for(let i=0; i<3; i++) navlinks[i].classList.remove('active');
    for(let i=0; i<4; i++) containers[i].style.display = 'none';
    if(Qbtns[currentQuestion]) Qbtns[currentQuestion].classList.remove('active');
}


// selects active navlink
const selectNavLink = (num) => {
    removeHighlight();
    navlinks[num].classList.add('active');
}

// AlertBox functionality
var alertBox = document.getElementById('alertBox');
const showAlert = (alertString, type='success',timer=4000) =>{
    alertBox.innerHTML = '<i class="far fa-bell icon-left"></i>' + alertString;
    alertBox.style.top = "30px";
    alertBox.style.backgroundColor = ( type === 'success' ? 'var(--accent)' : 'var(--red)' );
    setTimeout(hideAlert, timer);
}
const hideAlert = () => { alertBox.style.top = "-80px";}

// Functionality to auto-resize textarea
const addAutoResizeAbility = () => {
    let textareas = document.getElementsByTagName('textarea');
    for(let i=0; i<textareas.length; ++i){
        textareas[i].addEventListener('input', () => {
            textareas[i].style.height = 'auto';
            textareas[i].style.height = (textareas[i].scrollHeight + 4) + 'px';
        });
    }
}


// =====================================================================================

// gets the test details from database
const getTest = async () =>{ 
    let testRequest = await fetch('/api/testmaker/'+testId).then(res => res.json());
    if(testRequest.status !== 'success'){ 
        console.log('something went wrong'); 
        return false;
    }
    test = testRequest.data;
    return true;
}

// Create question pallete
const createPallete = () => {
    pallete.innerHTML = '';
    for(let i=0; i<totalQuestions; ++i){
        let Qbtn = document.createElement('div');
        Qbtn.className = 'Qbtn';
        Qbtn.innerHTML = i+1;
        Qbtn.onclick= () => { loadQuestion(i); };
        pallete.appendChild(Qbtn);
    }
    Qbtns = document.getElementsByClassName('Qbtn');
}

// Load question
const loadQuestion = (num) => {
    removeHighlight();
    currentQuestion = num;
    Qbtns[num].classList.add('active');

    let viewContent = document.getElementById('viewContent');
    viewContent.children[0].innerHTML = `Question ${num+1}`;
    viewContent.children[1].innerHTML = test.contents[num].question;
    for(let i=0; i<test.contents[num].options.length; ++i){
        viewContent.children[i+2].innerHTML = test.contents[num].options[i];
        viewContent.children[i+2].className = i+1 == test.answers[num] ? 'option correct' : 'option';
    }
    viewQuesDiv.style.display = 'block';
}

// =====================================================================================

// view all questions
const loadAllQuestions = () => {
    Qcontents.innerHTML = '';
    test.contents.forEach((content, index) => {
        let contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        contentDiv.innerHTML = `
        <div class="boxed">Question ${index+1}</div>
        <p class="question">${content.question}</p>`;
        content.options.forEach((option, i) => {
            let isCorrect = i+1 == test.answers[index] ? 'correct' : '';
            contentDiv.innerHTML += `<p class="option ${isCorrect}">${option}</p>`;
        });
        Qcontents.appendChild(contentDiv);        
    });
}

// =====================================================================================

// Fill detail form with test details
const createDetailForm = () => {
    detailForm.elements.name.value = test.name;
    detailForm.elements.category.value = test.category;
    detailForm.elements.price.value = test.price;
    detailForm.elements.duration.value = test.duration;
    detailForm.elements.positive.value = test.marking.positive;
    detailForm.elements.negative.value = test.marking.negative;
    detailForm.elements.visibility.value = test.meta.isPrivate? 1 : 0;
    detailForm.elements.startDuration.value = ( new Date(test.lastStartTime) - new Date(test.startTime) ) / 60000;
    detailForm.elements.startTime.value = new Date(test.startTime).toLocaleString("sv-SE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }).replace(" ", "T");
    
    const updateVisibilityInfo = () => {
        document.getElementById('visibilityInfo').innerHTML = detailForm.elements.visibility.value == '1' ? 
        `This won't be visible to users in explore section. Users will need link to access the test.` :
        'This test is currently visible to all users of this program.';
    }
    document.getElementById('visibility').onchange = updateVisibilityInfo();
    updateVisibilityInfo();

    detailForm.onsubmit = updateTestDetails;
}


// update test details
const updateTestDetails = async (e) => {
    e.preventDefault();

    let startTime = new Date(detailForm.elements.startTime.value);
    let lastStartTime = new Date(startTime.getTime() + (detailForm.elements.startDuration.value * 60000));

    let testDetails = {
        id: testId,
        name: detailForm.elements.name.value,
        category: detailForm.elements.category.value,
        price: detailForm.elements.price.value,
        duration: detailForm.elements.duration.value,
        startTime: startTime.toISOString(),
        lastStartTime: lastStartTime.toISOString(),
        positive: detailForm.elements.positive.value,
        negative: detailForm.elements.negative.value,
        isPrivate: detailForm.elements.visibility.value,
    }

    let updateRequest = await fetch(`/api/testmaker/${testId}?_method=PATCH`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testDetails)
        })
        .then(res => res.json())
    
    if(updateRequest.status !== 'success') showAlert('Something went wrong', 'error');
    else showAlert('Test details updated successfully', 'success');
}

// =====================================================================================


// Add new question
const addQuestion = async (e) => {
    e.preventDefault();
    let newContentData = {
        id: testId,
        question: newQuesForm.elements.newQues.value,
        options: [
            newQuesForm.elements.option1.value,
            newQuesForm.elements.option2.value,
            newQuesForm.elements.option3.value,
            newQuesForm.elements.option4.value
        ],
        answer: parseInt(newQuesForm.elements.correct.value)
    }

    let newContentRequest = await fetch(`/api/testmaker/${testId}/addquestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContentData)
    }).then(res => res.json());

    if(newContentRequest.status !== 'success') { showAlert(newContentRequest.message, 'error'); return }
    
    showAlert('Question added successfully', 'success');
    newQuesForm.reset();
    test.contents.push({
        question : newContentData.question,
        options : newContentData.options
    });
    test.answers.push(newContentData.answer);
    totalQuestions++;
    newQuesNum.innerHTML = totalQuestions+1;
    createPallete();
    loadQuestion(totalQuestions-1);
}

// Delete question
const deleteQuestion = async (e) => {
    let deleteRequest = await fetch(`/api/testmaker/${testId}/deletequestion/${currentQuestion}`).then(res => res.json());
    if(deleteRequest.status !== 'success') { showAlert(deleteRequest.message, 'error'); return }
    showAlert('Question deleted successfully', 'success');
    test.contents.splice(currentQuestion, 1);
    test.answers.splice(currentQuestion, 1);
    totalQuestions--;
    if(totalQuestions == 0){detailsBtn.click(); createPallete(); return}
    else if(currentQuestion == totalQuestions ) currentQuestion--;
    createPallete();
    loadQuestion(currentQuestion);
}

const addOptionFunctionalities = () => {
    document.querySelectorAll('.option .selector').forEach(selector => {
        selector.addEventListener('click', (e) => {
            for(let i=3; i<7; ++i) e.target.parentElement.parentElement.children[i].classList.remove('selected');
            e.target.parentElement.classList.add('selected');
        });
    });
    document.querySelectorAll('.option textarea').forEach(textarea => {
        textarea.addEventListener('focus', () => {textarea.parentElement.style.borderColor = 'var(--greyText)';});
        textarea.addEventListener('blur', () => {textarea.parentElement.style.borderColor = '#aaa';});
    });
}

const selectOption = (e) => {
    console.log('Selecting option');
}