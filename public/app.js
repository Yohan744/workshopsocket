// ----- timer ---- //

const wait = (delay) => {
    return new  Promise((resolve => {
        setTimeout(() => {
            resolve();
        },delay)
    }))
}

// ------------------------------- interaction ------------------------------- //
const people = document.querySelector("#people");
const messages = document.querySelector("#messages")
people.innerHTML += `
    <div class="user">
        <div class="imgUser">
            
        </div>
        <h2 class="nameUser">Chat général</h2>
    </div>
    `

const chatGeneral = document.querySelector('.user')
chatGeneral.onclick = () => {
    people.style.left = "-100vw"
    people.style.transition = "all, 0.5s"
}

const headerMessage = document.querySelector("#headerMessage")
headerMessage.innerHTML += `
        <div class="imgDivMessageUser">
        
        </div>
        <h2 class="titleMessage">Chat général</h2>
    `
const backButton = document.querySelector("#backArrow")
backButton.onclick = () => {
    people.style.left = "0"
}


// -------------------------------- connection -------------------------------- //

let socket = io();
let login = {};

let formLogin = document.querySelector('#formLogin');

socket.on('userId', id => {
    console.log(id)
    login.userId = id
})

formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)
    const name = formData.get("nom")
    const mail = formData.get("email")
    let hash = md5(mail)
    login.name = name
    login.mail = mail
    login.image = `https://gravatar.com/avatar/${hash}`


    socket.emit('user', login)

    // ajouter la disparition SI l'utilisateur est deja ajouter / Viens d'etre ajouter
})

// ------------------------------- Message ------------------------------- //

let formMessage = document.getElementById('formMessage');
let input = document.getElementById('input');

let messageFrame = {}

formMessage.addEventListener('submit', function (e) {
    e.preventDefault();
    messageFrame.user = login.name
    messageFrame.message = input.value
    messageFrame.image = login.image
    messageFrame.id = login.userId
    if (input.value) {
        socket.emit('chat message', messageFrame);
        input.value = '';
    }


});

socket.on('chat message', function (msg) {
    let item = document.createElement('li');
    if (msg.id === login.userId) {
        // item.classList.add("row-reverse")
        item.className = "row-reverse"
    } else {
        // item.classList.add("row")
        item.className = "row"
    }

    item.innerHTML += `
                <div class="message-container">
                <img alt="img_profil" src="${msg.image}">
                <p class="message-name">${msg.user}</p>
                <p class="message-text">: ${msg.message}</p>
                </div>`

    // item.textContent = msg;
    messages.appendChild(item);
    document.scrollTo(0, document.body.scrollHeight+item);

});

socket.on('connect message', function (msg) {
    let item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    document.scrollTo(0, document.body.scrollHeight+item);
});

socket.on('participants', (users) => {
    console.log(users)
    let participants = document.querySelector("#participants")
    participants.innerHTML = ""

    users.forEach(user => {
        participants.innerHTML += `
            <li id="${user.userId}">
                <img alt="img_profil" src="${user.image}">
                <p>${user.name}</p>
            </li>`
    })

})

document.querySelector("#input").addEventListener('input', (e) => {
    const test = e.target.value
    console.log(test)
    socket.emit('isWriting', login);
})

const isWriting = document.querySelector("#isWriting")

socket.on('isWriting', (login) => {
    isWriting.innerHTML = `${login.name} est en train d'écrire`
    wait(4000).then(() => {
        isWriting.innerHTML = ''
    })

})




