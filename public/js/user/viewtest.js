var testId = document.getElementById('h1').dataset.id;
var heroCard = document.getElementById('heroCard');

window.onload = async () => {
    var myTest = await fetch("/api/user/gettest/" + testId).then(res => res.json());
    if(myTest.status === 'success'){
        myTest = myTest.data;
        heroCard.innerHTML = `
        <div class="boxed boxed-blue medium top-right">
            <i class="fas fa-users"></i> Students enrolled : ${myTest.meta.studentsEnrolled}
        </div>
        <div class="boxed medium boxed-blue">${myTest.category}</div>
        <h3 class="h3">${myTest.name}</h3>
        <p>
            Number of questions : ${myTest.contents.length} | 
            Maximum marking : ${myTest.contents.length * myTest.marking.positive}
        </p>
        <div class="in-block boxed boxed-blue small grey">${new Date(myTest.startTime).toLocaleString()}</div>
        <div class="in-block boxed boxed-blue small grey">Duration - ${myTest.duration} minutes</div>
        <div class="boxed boxed-blue medium mar-top-40"><i class="fas fa-wallet"></i> Price : ${myTest.price}</div>
        <div class="bottom-right" id='btnDiv'>
            ${ myTest.meta.resultDeclared ? 
                `<div class='boxed boxed-blue medium'>Results Announced</div>` :
                `<div class='boxed boxed-blue medium in-block mar-right'>You are enrolled</div>
                <a href='/attempttest/${testId}' class="primary medium btn" id="publishBtn">Start Test</a>`}
        </div>`;
    
    } else {
        showAlert(myTest.message, 'error');
        heroCard.innerHTML = myTest.message;
        heroCard.classList.add('loading');
    }
}