var exploreDiv = document.getElementById("exploreDiv");
var practiceDiv = document.getElementById("practiceDiv");

window.onload = () => {
    loadMockTests();
}



// Loads available mock tests for the user to take
const loadMockTests = async () => {
    let availableTestsRequest = await fetch("/api/user/exploretests").then(res => res.json());

    if( availableTestsRequest.status === 'success' ) {
        let availableTests = availableTestsRequest.data;

        exploreDiv.innerHTML = "";
        exploreDiv.className = "examList";
        availableTests.forEach(test => exploreDiv.appendChild(createExamCard(test, 'user')));

        updateBtnLinks(); // Definition in dashboard.js
    } else {
        showAlert(availableTests.message, 'error');
        exploreDiv.innerHTML = "Something went wrong. Please try again later.";
    }
}