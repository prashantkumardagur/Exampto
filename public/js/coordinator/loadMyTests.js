var notPublishedDiv = document.getElementById("notPublished");
var publishedDiv = document.getElementById("published");
var completedDiv = document.getElementById("completed");

var monthNames = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPr", "OCT", "NOV", "DEC" ];
var myTests ={}

const createExamList = ( testType, targetDiv ) => {
    if(testType.length == 0) {
        targetDiv.innerHTML = "You have no tests in this category.";
    } else {
        targetDiv.classList.remove('loading');
        testType.forEach(test => targetDiv.appendChild(createExamCard(test, 'coordinator')));
    }
}

window.onload = async () => {
    myTests = await fetch("/api/coordinator/mytests").then(res => res.json());
    if(myTests.status === 'success') {
        myTests = myTests.data;

        let unPublished = myTests.filter( test => !test.meta.isPublished);
        let published = myTests.filter( test => test.meta.isPublished && !test.meta.resultDeclared);
        let completed = myTests.filter( test => test.meta.resultDeclared);

        createExamList(unPublished, notPublishedDiv);
        createExamList(published, publishedDiv);
        createExamList(completed, completedDiv);

        document.querySelectorAll('.btn-link').forEach( (btn) =>{
            btn.innerHTML += ' <i class="fas fa-arrow-right"></i>';
        })

    } else {
        showAlert('Error loading tests', 'error');
    }
}