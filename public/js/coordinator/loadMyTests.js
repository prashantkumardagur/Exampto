var notPublishedDiv = document.getElementById("notPublished");
var publishedDiv = document.getElementById("published");
var completedDiv = document.getElementById("completed");

window.onload = () => {
    loadMyTests();
}


// Loads all tests created by the coordinator
const loadMyTests = async () => {
    myTestsRequest = await fetch("/api/coordinator/mytests").then(res => res.json());
    if(myTestsRequest.status !== 'success'){
        showAlert(myTestsRequest.message, 'error');
    } else {
        let myTests = myTestsRequest.data;

        let unPublished = myTests.filter( test => !test.meta.isPublished);
        let published = myTests.filter( test => test.meta.isPublished && !test.meta.resultDeclared);
        let completed = myTests.filter( test => test.meta.resultDeclared);

        createExamList(unPublished, notPublishedDiv);
        createExamList(published, publishedDiv);
        createExamList(completed, completedDiv);

        updateBtnLinks();
    }
}


// Creates a list of tests for a given category
const createExamList = ( testType, targetDiv ) => {
    if(testType.length == 0) targetDiv.innerHTML = "You have no tests in this category.";
    else {
        targetDiv.classList.remove('loading');
        testType.forEach(test => targetDiv.appendChild(createExamCard(test, 'coordinator')));
    }
}