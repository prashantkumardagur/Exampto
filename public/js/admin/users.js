var userlistDiv = document.getElementById('userlist');

window.onload = () => {
    createUserList();
}

// fetches the user list from the server
const getUserList = async () => {
    let userListRequest = await fetch('/api/admin/getuserlist').then(res => res.json());
    if(userListRequest.status !== 'success') {
        showAlert('Failed to fetch user list', 'error');
        return false;
    }
    return userListRequest.data;
}

// creates the user list
const createUserList = async () => {
    let userList = await getUserList();
    if(!userList) return;

    userlistDiv.className = 'userlist';
    userlistDiv.innerHTML = `<ul>
        <li class="listHeadings w500">
            <p>Name</p>
            <p>Email</p>
            <p>Username</p>
        </li>
    </ul>`;
    let ul = document.querySelector('#userlist ul');
    userList.forEach(user => {
        let li = document.createElement('li');
        li.innerHTML = `<p>${user.name}</p><p>${user.email}</p><p>${user.username}</p>`;
        ul.appendChild(li);
    })
}