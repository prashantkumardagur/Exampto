var id = document.getElementById("h1").dataset.id;
var resultsDiv = document.getElementById('results');

window.onload = async () => {
    let results = await fetch(`/api/user/myresults`).then(res => res.json());
    if(results.status !== 'success') showAlert(results.message, 'error');
    else {
        results = results.data;
        results.forEach( result => {
            resultsDiv.innerHTML += `
            <div class="resultDiv">
                <p>${result.exam.name}</p>
                <p>${result.marksAllocated}</p>
                <p>${result.rank}</p>
                <p>${result.percentile}</p>
            </div>`;
        });
    }
}