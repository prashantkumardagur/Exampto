var enrolledTestDiv = document.getElementById('testsEnrolled');

window.onload = () => {
    loadEnrolledTests();
}

const loadEnrolledTests = async () => {
    let enrolledTestsRequest = await fetch('/api/user/enrolledtests').then(res => res.json());
    if(enrolledTestsRequest.status !== 'success') {
        showAlert(enrolledTestsRequest.message, 'error');
        enrolledTestDiv.innerHTML = 'Error fetching enrolled tests';
    } else {
        let enrolledTests = enrolledTestsRequest.data;
        if(enrolledTests.length === 0) {
            enrolledTestDiv.innerHTML = 'You haven\'t enrolled for any tests yet';
        } else {
            enrolledTestDiv.innerHTML = '';
            enrolledTestDiv.className = 'examList';
            enrolledTests.forEach(test => enrolledTestDiv.appendChild(createExamCard(test, 'user')));
        }
        updateBtnLinks(); // Definition in dashboard.js
    }
};