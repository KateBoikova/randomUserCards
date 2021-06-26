'use strict';

const options = {
    results: 10,
    seed: 'abc',
    page: 1,
}

fetch(`https://randomuser.me/api/?results=${options.result}&seed=${options.seed}&page=${options.page}`)
    .then(response => response.json())
    .then(({ results }) => renderUsers(results));

function renderUsers(users) {
    console.dir(users);
}