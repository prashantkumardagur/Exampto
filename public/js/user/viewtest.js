var testId = document.getElementById('h1').dataset.id;
var heroCard = document.getElementById('heroCard');
var instructionDiv = document.getElementById('instructions');
var resultList = document.getElementById('resultList');
var solutionBtn = document.getElementById('solutionBtn');

window.onload = () => {
    loadTestDetails();
    getResults();
    solutionBtn.onclick = () => { downloadSolutions(testId); }
}

const loadTestDetails = async () => {
    var testRequest = await fetch("/api/user/gettest/" + testId).then(res => res.json());
    
    if(testRequest.status !== 'success'){
        console.log(testRequest);
        showAlert(testRequest.message, 'error');
        heroCard.innerHTML = testRequest.message;
        heroCard.className = 'loading';
    } else {
        let myTest = testRequest.data;
        heroCard.innerHTML = `
        <div class="boxed boxed-blue medium top-right">
            <i class="fas fa-users"></i> Students enrolled : ${myTest.meta.studentsEnrolled}
        </div>
        <div class="boxed medium boxed-blue">${myTest.category}</div>
        <h3 class="h3">${myTest.name}</h3>
        <p>
            Number of questions : ${myTest.totalQuestions} <br>
            Maximum marking : ${myTest.totalQuestions * myTest.marking.positive}
        </p>
        <div class="in-block boxed boxed-blue small grey">${new Date(myTest.startTime).toLocaleString()}</div>
        <div class="in-block boxed boxed-blue small grey">Duration - ${myTest.duration} minutes</div>
        <div class="boxed boxed-blue medium mar-top-40"><i class="fas fa-wallet"></i> Price : ${myTest.price}</div>
        <div class="bottom-right" id='btnDiv'>
            ${ myTest.meta.resultDeclared ? 
                `<div class='boxed boxed-blue medium'>Results Announced</div>` :
                myTest.enrolled ?
                `<div class='boxed boxed-blue medium in-block mar-right'>You are enrolled</div>
                <a href='/user/attempttest/${testId}' class="primary medium btn" id="startBtn">Start Test</a>` :
                `<button class="primary medium btn" id="enrollBtn">Enroll</button>`
            }
        </div>`;
        
        if(!myTest.enrolled){ document.getElementById('enrollBtn').onclick = () => { enrollForTest(testId); } }
    }

}

const enrollForTest = async (testId) => {
    let enrollRequest = await fetch(`/api/user/enrolltest/${testId}`).then(res => res.json());
    if(enrollRequest.status !== 'success') showAlert(enrollRequest.message, 'error');
    else {
        showAlert('Successfully enrolled for test', 'success');
        document.getElementById('btnDiv').innerHTML = `
        <div class='boxed boxed-blue medium in-block mar-right'>You are enrolled</div>
        <a href='/user/attempttest/${testId}' class="primary medium btn" id="startBtn">Start Test</a>`;
    }
}

const getResults = async () => {
    let resultRequest = await fetch(`/api/user/getresult/${testId}`).then(res => res.json());

    if(resultRequest.status !== 'success' || resultRequest.data.ended === false){
        document.getElementById('results').style.display = 'none';
        document.getElementById('resultAnalytics').style.display = 'none';
    } else {
        instructionDiv.style.display = 'none';
        document.getElementById('btnDiv').innerHTML = `<div class='boxed boxed-blue medium'>Results Announced</div>`;

        let results = resultRequest.data;
        let quesData = results.exam.contents;

        document.getElementById('marksAlloted').innerHTML = `${results.marksAllocated} / ${results.responses.length * results.exam.marking.positive}`;

        results.responses.forEach( (res, index) => {
            let contentDiv = document.createElement('div');
            contentDiv.className = 'content';
            let status = res == 0 ? 0 : res == results.exam.answers[index] ? 1 : -1;

            contentDiv.innerHTML = `
            <h6>QUESTION ${index+1}</h6>
            ${  status == 0 ? `<div class="boxed small" style="background-color: var(--accent2)">UNATTEMPTED : 0</div>` : 
                status == 1 ? `<div class="boxed small" style="background-color: var(--green)">CORRECT : + ${results.exam.marking.positive}</div>` :
                            `<div class="boxed small" style="background-color: #ff9999">INCORRECT : - ${results.exam.marking.negative}</div>` }
            <p class="question">${quesData[index].question}</p>`;

            let optionList = document.createElement('ul');
            optionList.className = 'options';
            quesData[index].options.forEach( (opt, i) => { 
                let liClass = 'option';
                if(i+1 == res) liClass += ' selected';
                if(i+1 == results.exam.answers[index]) liClass += ' correct';
                optionList.innerHTML += `<li class="${liClass}">${opt}</li>`;
            });

            contentDiv.appendChild(optionList);
            resultList.appendChild(contentDiv);
        });
    }
    
    if(resultRequest.data.ended === false) document.getElementById('startBtn').innerHTML = `Continue Test`;
}

const downloadSolutions = (id) => {
    showAlert('Feature not available yet', 'error');
}