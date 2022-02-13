var testId = document.getElementById('h1').dataset.id;
var heroCard = document.getElementById('heroCard');

window.onload = () => {
    loadTestDetails();
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
            Number of questions : ${myTest.totalQuestions} | 
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