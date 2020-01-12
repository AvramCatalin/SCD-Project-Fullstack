function loadUsers() {
    //ready state de 4 => Done
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            displayUsers(JSON.parse(this.response));
        }
    };
    xhttp.open('GET', '/users', true);
    xhttp.send();
}

function displayUsers(users) {
    if (!document.querySelector('.user-container')) {
        var usersContainer = document.querySelector('#usersContainer');
        users.forEach(user => {
            usersContainer.innerHTML += `\n<p id="${user.email}" class="user-container">${user.firstName} ${user.lastName}</p>`;
        });
        makeUsersSelectable();
    }
}

function makeUsersSelectable() {
    let users = document.querySelectorAll('.user-container');
    users.forEach(user => {
        user.addEventListener('click', function () {
            let users = document.querySelectorAll('.user-container');
            users.forEach(user => {
                user.classList.remove('selected');
            });
            user.classList.add('selected');
        });
    });
}