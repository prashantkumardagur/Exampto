// Updates navigation bar with active link
navIndex = document.querySelector('h1').dataset.nav;
if(navIndex) document.querySelectorAll('.nav-links li')[navIndex].classList.add('active');


// Addes arrow icon to .btn-link class elements
const updateBtnLinks = () => {
    document.querySelectorAll('.btn-link').forEach( (btn) =>{ btn.innerHTML += ' <i class="fas fa-arrow-right"></i>';})
}


// AleatBox functionality
var alertBox = document.getElementById('alertBox');
const showAlert = (alertString, type='success',timer=4000) =>{
    alertBox.innerHTML = '<i class="far fa-bell icon-left"></i>' + alertString;
    alertBox.style.top = "30px";
    alertBox.style.backgroundColor = ( type === 'success' ? 'var(--accent)' : 'var(--red)' );
    setTimeout(hideAlert, timer);
}
const hideAlert = () => { alertBox.style.top = "-80px";}


// Creates a card for a given test and authType(coordinator/user)
const createExamCard = ( test, auth ) => {
    let testDiv = document.createElement("div");
    testDiv.classList.add("examCard","relative");

    testDiv.innerHTML = `
    <div class="count top-right boxed boxed-blue small"><i class="fas fa-users"></i>${test.meta.studentsEnrolled}</div>
    <div class='boxed boxed-blue small'>${test.category}</div>
    <h5>${test.name}</h5>
    <p>Duration : ${test.duration} | Total Questions : ${test.totalQuestions}</p>
    <div class="boxed small boxed-blue grey mar-top-5"> ${new Date(test.startTime).toLocaleString()} </div>
    <a href="/${auth}/viewtest/${test._id}" class="btn-link">Know More</a>`;

    return testDiv;
}



// Date/Time functionality for dashboard
const dateHolder = document.getElementById('dateHolder');
const updateDate = () => {
    const timeHolder = document.getElementById('timeHolder');
    let now = new Date();

    let monthNames = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
    dateHolder.innerHTML = now.getDate() + " " + monthNames[now.getMonth()] + " " + now.getFullYear();
    
    if(timeHolder) { 
        updateTime();
        window.setTimeout(updateTime, 5000);
    }
}
if(dateHolder) updateDate();

function updateTime() {
    now = new Date(Date.now());
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    document.getElementById('timeHolder').innerHTML = hours + " : " + minutes + " " + ampm;
}