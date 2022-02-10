var exploreDiv = document.getElementById("exploreDiv");

window.onload = async () => {
    var availableTests = await fetch("/api/user/exploretests").then(res => res.json());
    if(availableTests.status === 'success') {
        availableTests = availableTests.data;

        exploreDiv.innerHTML = "";
        exploreDiv.className = "examList";
        availableTests.forEach(test => exploreDiv.appendChild(createExamCard(test, 'user')));

        updateBtnLinks();
    } else {
        showAlert(availableTests.message, 'error');
        exploreDiv.innerHTML = "Something went wrong. Please try again later.";
    }
}