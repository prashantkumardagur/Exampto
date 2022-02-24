var testId = document.getElementById('h1').dataset.id;
var heroCard = document.getElementById('heroCard');

window.onload = async () => {
    await loadTestDetails();
    let publishBtn = document.getElementById('publishBtn');
    if(publishBtn) publishBtn.addEventListener('click', publishTest);
}


// Load test details
const loadTestDetails = async () => {
    let testRequest = await fetch(`/api/coordinator/gettest/${testId}`).then(res => res.json());
    if(testRequest.status !== 'success') {
        showAlert(testRequest.message, 'error');
        heroCard.innerHTML = testRequest.message;
        heroCard.className = 'contentCard loading';
    } else {
        let test = testRequest.data;
        heroCard.innerHTML = `
        <div class="boxed boxed-blue medium top-right">
            <i class="fas fa-users"></i> Students enrolled : ${test.meta.studentsEnrolled}
        </div>
        <div class="boxed medium boxed-blue">${test.category}</div>
        <h3 class="h3">${test.name}</h3>
        <p>
            Number of questions : ${test.totalQuestions} | 
            Maximum marking : ${test.totalQuestions * test.marking.positive}
        </p>
        <div class="in-block boxed boxed-blue small grey">${new Date(test.startTime).toLocaleString()}</div>
        <div class="in-block boxed boxed-blue small grey">Duration - ${test.duration} minutes</div>
        <div class="boxed boxed-blue medium mar-top-40"><i class="fas fa-wallet"></i> Price : ${test.price}</div>
        <div class="bottom-right" id='btnDiv'>
            ${ test.meta.isPublished ? 
                test.meta.resultDeclared ? `<div class='boxed boxed-blue medium'>Test Result Declared</div>` :
                `<div class='boxed boxed-blue medium in-block'>Test Published</div>
                <button class='btn primary medium' id='declareBtn'>Declare Result</button>` :
                `<a href="/coordinator/testmaker/${testId}" class="btn medium primary">Edit</a>
                <button class="primary medium btn" id="publishBtn">Publish Test</button>`}
        </div>`;
    }
}



// Publish test
const publishTest = async () => {
    let publishRequest = await fetch(`/api/testmaker/publish/${testId}`, { method : 'POST' }).then(res => res.json());
    if(publishRequest.status === 'success') {
        showAlert('Test published successfully');
        document.getElementById('btnDiv').innerHTML = `<div class='boxed boxed-blue medium'>Test Published</div>`;
    } else {
        showAlert('Error publishing test', 'error');
    }
}

// Declare Results