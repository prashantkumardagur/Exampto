var testId = document.getElementById('h1').dataset.id;
var heroCard = document.getElementById('heroCard');

window.onload = async () => {
    var myTest = await fetch("/api/coordinator/gettest?id=" + testId).then(res => res.json());
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
            ${ myTest.meta.isPublished ? 
                `<div class='boxed boxed-blue medium'>Test Published</div>` :
                `<a href="/coordinator/testmaker/${testId}" class="btn medium primary">Edit</a>
                <button class="primary medium btn" id="publishBtn">Publish Test</button>`}
        </div>`;
    }

    document.getElementById('publishBtn').onclick = async () => {
        let publishTest = await fetch(`/api/testmaker/publish/${testId}`, { method : 'POST' }).then(res => res.json());
        console.log(publishTest);
        console.log(`/api/testmaker/publish?id=${testId}`);
        if(publishTest.status === 'success') {
            showAlert('Test published successfully');
            document.getElementById('btnDiv').innerHTML = `<div class='boxed boxed-blue medium'>Test Published</div>`;
        } else {
            showAlert('Error publishing test', 'error');
        }
    }
}