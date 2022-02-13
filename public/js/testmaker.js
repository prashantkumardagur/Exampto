var testId = document.getElementById('h1').dataset.id;
var myTestDiv = document.getElementById('myTestDiv');
var testContentsDiv = document.getElementById('testContentsDiv');
var totalQuestions = document.getElementById('totalQuestions');
var maxMarking = document.getElementById('maxMarking');
var newContent = document.getElementById('newContent');

var contents = {};
var answers = [];

const createQuesDiv = (content, index) => {
    let quesDiv = document.createElement('div');
    quesDiv.classList.add('quesDiv');
    quesDiv.innerHTML = `
        <h6>QUESTION ${index + 1}</h6>
        <p class="question">${content.question}</p>
        <ul>
            ${content.options.map( (option, i) => `<li class="option ${ answers[index]===i+1 ? 'correct' : '' }">${option}</li>` ).join('')}
        </ul>
    `;
    testContentsDiv.appendChild(quesDiv);
}

window.onload = async () => {
    var myTest = await fetch(`/api/testmaker/${testId}`).then(res => res.json());

    if(myTest.status === 'failure') {
        myTestDiv.innerHTML = `Test not found. Please contact the administrator if something is wrong.`;

    } else {
        myTest = myTest.data;
        contents = myTest.contents;
        answers = myTest.answers;

        var detailForm = document.createElement('form');
        detailForm.setAttribute('id', 'detailForm');
        detailForm.setAttribute('method', 'post');
        detailForm.setAttribute('autocomplete', 'off');
        detailForm.classList.add('testMakerForm', 'grid-2');

        let dateDiff = ( new Date(myTest.lastStartTime) - new Date(myTest.startTime) ) / 60000;

        detailForm.innerHTML = `
        <section>
            <label for="name">Test Name</label>
            <input type="text" name="name" id="name" value="${myTest.name}" required>
        </section>
        <section>
            <label for="category">Category</label>
            <select name="category" id="category" required>
                <option value="JEE" selected>JEE</option>
                <option value="NEET">NEET</option>
                <option value="SSC">SSC</option>
            </select>
        </section>
        <section>
            <label for="positive">Positive Marking</label>
            <input type="number" name="positive" id="positive" value="${myTest.marking.positive}" required step="1" min="1" max="10">
        </section>
        <section>
            <label for="negative">Negative Marking</label>
            <input type="number" name="negative" id="negative" value="${myTest.marking.negative}" required step="1" min="0" max="10">
        </section>
        <section>
            <label for="duration">Duration (in minutes)</label>
            <input type="number" name="duration" id="duration" value="${myTest.duration}" required step="1" min="30" max="300">
        </section>
        <section>
            <label for="startduration">Start duration (in minutes)</label>
            <input type="number" name="startduration" id="startDuration" value="${dateDiff}" required step="1" min="5" max="300">
        </section>
        <section>
            <label for="startDate">Start Date</label>
            <input type="datetime-local" name="startTime" id="startTime" value="${myTest.startTime.slice(0,16)}" required>
        </section>
        <section>
            <label for="price">Price</label>
            <input type="number" name="price" id="price" value="${myTest.price}" required step="1" min="0" max="10000">
        </section>  
        <button class="btn primary large" id="testUpdateBtn">Update Test Details</button>
        <button class="btn primary large red-bg" id="testDeleteBtn">Delete Test</a>
        `;

        myTestDiv.innerHTML = '';
        myTestDiv.classList.remove('loading');
        myTestDiv.appendChild(detailForm);

        detailForm.addEventListener('submit', e => e.preventDefault());

        document.getElementById('testUpdateBtn').addEventListener('click', async () => {
            let startTime = new Date(detailForm.elements.startTime.value);
            let lastStartTime = new Date(startTime.getTime() + (detailForm.elements.startDuration.value * 60000));
    
            testDetails = {
                id: testId,
                name: detailForm.elements.name.value,
                category: detailForm.elements.category.value,
                positive: detailForm.elements.positive.value,
                negative: detailForm.elements.negative.value,
                duration: detailForm.elements.duration.value,
                startTime : startTime.toISOString(),
                lastStartTime : lastStartTime.toISOString(),
                price: detailForm.elements.price.value,
            }
    
            let updateResponse = await fetch(`/api/testmaker/${testId}?_method=PATCH`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testDetails)
                })
                .then(res => res.json())
            showAlert('Test details updated successfully');
        });

        document.getElementById('testDeleteBtn').addEventListener('click', async () => {
            let deleteResponse = await fetch(`/api/testmaker/${testId}?_method=DELETE`, {method: 'POST'}).then(res => res.json());
            if(deleteResponse.status === 'success') window.location.href = '/coordinator/tests';
            else showAlert(deleteResponse.message);
        });


        totalQuestions.innerHTML = contents.length;
        maxMarking.innerHTML = contents.length * parseInt(myTest.marking.positive);
        contents.forEach( createQuesDiv );


        newContent.addEventListener('submit', async e => {
            e.preventDefault();

            let newContentData = {
                id: testId,
                question: newContent.elements.newQuestion.value,
                options: [
                    newContent.elements.option1.value,
                    newContent.elements.option2.value,
                    newContent.elements.option3.value,
                    newContent.elements.option4.value,
                ],
                answer: parseInt(newContent.elements.correctOption.value)
            }

            let newContentResponse = await fetch(`/api/testmaker/${testId}/addquestion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContentData)
                })
                .then(res => res.json())

            if(newContentResponse.status === 'success') {
                showAlert('Question added successfully');
                newContent.reset();

                contents.push({
                    question : newContentData.question,
                    options : newContentData.options,
                });
                answers.push(newContentData.answer);

                totalQuestions.innerHTML = contents.length;
                maxMarking.innerHTML = contents.length * parseInt(myTest.marking.positive);
                createQuesDiv(newContentData, contents.length - 1);

            } else {
                showAlert(newContentResponse.message);
            }
        })


    }
}



