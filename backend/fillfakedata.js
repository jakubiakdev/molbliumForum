import { faker } from '@faker-js/faker';
import fs from 'fs';

const api = 'http://localhost:8080/api/v1';

let users = []

for (let i = 0; i < 50; i++) {
  users.push({
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.username().substring(0, 20),
    displayName: faker.person.fullName(),
  })
}

// write users to disk
fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

for (let index = 0; index < users.length; index++) {
    await new Promise(resolve => setTimeout(resolve, 30));
    const user = users[index];
    await fetch(`${api}/api/v1/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, password: user.password, username: user.username, displayName: user.displayName })
    }).then(res => {
        if(res.status !== 200) {
        console.error(res)
        }
        console.log("user created")
    })
}

await new Promise(resolve => setTimeout(resolve, 5000));

let tokens = []

for (let index = 0; index < users.length; index++) {
    await new Promise(resolve => setTimeout(resolve, 30));
    const user = users[index];
    await fetch(`${api}/api/v1/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, password: user.password })
    }).then(res => {
            return res.json()
    })
        .then(data => {
            tokens.push(data)
            console.log(data)
        })
        .catch(err => {
            console.error(err);
        })
}


await new Promise(resolve => setTimeout(resolve, 5000));


let threadids = []

let tags = [{id: 0},{id: 0},{id: 0}] // increase chance of empty tag 

await fetch(`${api}/api/v1/tags`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
}).then(res => {
    return res.json()
}).then(data => {
    tags = [...tags, ...data]
})

await new Promise(resolve => setTimeout(resolve, 5000));

console.log({title: faker.lorem.sentence(), content: faker.lorem.paragraphs(5), tag: faker.helpers.arrayElement(tags).id})

for (let i = 0; i < 50; i++) {
    let thread = { title: faker.lorem.sentence(), content: faker.lorem.paragraphs(5), tag: faker.helpers.arrayElement(tags).id }
    console.log(thread)
    await fetch(`${api}/api/v1/threads/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${faker.helpers.arrayElement(tokens).token}`
        },
        body: JSON.stringify(thread)
    }).then(res => {
        return res.json()
    }).then(data => {
        console.log(data)
        threadids.push(data.id)
    })
}

for (let i = 0; i < 250; i++) {
    await fetch(`${api}/api/v1/threads/${faker.helpers.arrayElement(threadids)}/addPost`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${faker.helpers.arrayElement(tokens).token}`
        },
        body: JSON.stringify({ content: faker.lorem.paragraphs(2) }) 
    })
}