'use strict';

const options = {
    results: 10,
    seed: 'abc',
    page: 1,
}

loadUsers(options);

const [btnPrev, btnNext] = document.querySelectorAll('button');
btnPrev.addEventListener('click', btnPrevHandler);
btnNext.addEventListener('click', btnNextHandler);


function btnPrevHandler(e) {
    if (options.page >= 1) {
        options.page--;
        loadUsers(options);
    }
}

function btnNextHandler(e) {
    options.page++;
    loadUsers(options);
}

function loadUsers({results, seed, page}) {
    fetch(`https://randomuser.me/api/?results=${results}&seed=${seed}&page=${page}`)
        .then(response => response.json())
        .then(({ results }) => renderUsers(results));
}

function renderUsers(users) {
    const userList = document.querySelector('.userList');
    if (userList) {
        userList.remove();
    }

    const newUserList = document.createElement('ul');
    newUserList.classList.add('userList');
    document.getElementById('root').append(newUserList);

    const liUserColletion = users.map(user => createUserListItem(user));
    newUserList.append(...liUserColletion);

    createReturnTofirstPageBtn();
}

function createReturnTofirstPageBtn() {
    if (document.getElementsByClassName('returnBtn').length !== 0) {

        document.getElementsByClassName('returnBtn')[0].remove();

    }
    if (options.page === 1) {
        return;
    }
    const returnBtn = document.createElement('button');
    returnBtn.classList.add('returnBtn');
    returnBtn.setAttribute('title', 'Back to the first page');
    document.getElementById('root').append(returnBtn);

    returnBtn.addEventListener('click', returnToFirstPage);

    function returnToFirstPage(e) {
        options.page = 1;
        loadUsers(options);
    }

}

function createUserListItem({
    name: {first: firstName, last: lastName}, 
    picture: {large: userImageSrc},
    dob: {age: userAge},
    email: userEmail,
    gender: userGender,
    login: {username: userId},
}) {
    const userListItem = document.createElement('li');
    userListItem.classList.add('userListItem');

    const topBlock = document.createElement('div');
    topBlock.classList.add('topBlock');
    
    const followBtn = document.createElement('button');
    followBtn.innerText = 'Follow';
    followBtn.classList.add('followBtn');
    followBtn.setAttribute('title', `Follow ${firstName} ${lastName}`)
    followBtn.style.backgroundColor = userGender === 'female' ? '#A74A95' : '#189399';

    userListItem.append(topBlock);
    userListItem.append(createUserImage(userImageSrc));
    userListItem.append(createUserFullName(firstName, lastName));
    userListItem.append(createUserAge(userAge));
    userListItem.append(createUserEmail(userEmail));
    userListItem.append(followBtn);

    topBlock.style.backgroundColor = userGender === 'female' ? '#E6BFDE' : '#68CBD0';


    userListItem.addEventListener('click', (e) => selectUser(e, {firstName, lastName, userId}, userListItem));
 
    return userListItem;
}


function createUserImage(userImageSrc) {
    const img = new Image();
    img.src = userImageSrc;
    img.alt = 'user profile image';
    return img;
}

function createUserFullName(firstName, lastName) {
    const div = document.createElement('div');
    div.classList.add('userFullName');
    div.innerText = `${firstName}, ${lastName}`;
    return div;
}

function createUserAge(userAge) {
    const div2 = document.createElement('div');
    div2.classList.add('userAge');
    div2.innerText = `${userAge}`;
    return div2;
}

function createUserEmail(userEmail) {
    const div3 = document.createElement('div');
    div3.classList.add('userEmail');
    div3.innerText = `${userEmail}`;
    return div3;
}



function selectUser(e, {firstName, lastName, userId}, userListItem) {    
    if (document.getElementById(userId)) {
        document.getElementById(userId).remove();
        userListItem.classList.remove('selectedUser');

        if (document.getElementById('selectedUsersList').childElementCount === 1) {
            document.getElementById('selectedUsersList').innerHTML = '';
        }

    } else {
        const selectedUsersListItem = document.createElement('li');
        selectedUsersListItem.setAttribute('id', userId);
        selectedUsersListItem.classList.add('selectedUsersListItem');
        selectedUsersListItem.innerText=`${firstName} ${lastName}`;
        document.getElementById('selectedUsersList').prepend(selectedUsersListItem);

        userListItem.classList.add('selectedUser');

        if (document.getElementsByClassName('deleteSelections').length === 0) {
            const deleteSelections = document.createElement('button');
            deleteSelections.classList.add('deleteSelections');
            deleteSelections.innerText = 'X';
            document.getElementById('selectedUsersList').append(deleteSelections);
            deleteSelections.addEventListener('click', deleteSelectedItems);
        }
        
    }
   
    function deleteSelectedItems (e) {
        document.getElementById('selectedUsersList').innerHTML = '';
        document.querySelectorAll('.userListItem').forEach(item => item.classList.remove('selectedUser'));
    }
}



/************************************User selection feature***********************************/