var coordinatorlistDiv = document.getElementById('coordinatorlist');

window.onload = () => {
    createCoordinatorList();
}

// fetches the user list from the server
const getCoordinatorList = async () => {
    let coordinatorListRequest = await fetch('/api/admin/getcoordinatorlist').then(res => res.json());
    if(coordinatorListRequest.status !== 'success') {
        showAlert('Failed to fetch coordinator list', 'error');
        return false;
    }
    return coordinatorListRequest.data;
}

// creates the user list
const createCoordinatorList = async () => {
    let coordinatorList = await getCoordinatorList();
    if(!coordinatorList) return;

    coordinatorlistDiv.className = 'userlist';
    coordinatorlistDiv.innerHTML = `<ul>
        <li class="listHeadings w500">
            <p>Name</p>
            <p>Email</p>
            <p>Username</p>
        </li>
    </ul>`;
    let ul = document.querySelector('#coordinatorlist ul');
    coordinatorList.forEach(coordinator => {
        let li = document.createElement('li');
        li.innerHTML = `<p>${coordinator.name}</p><p>${coordinator.email}</p><p>${coordinator.username}</p>`;
        ul.appendChild(li);
    })
}